'use server';

import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { getLogger } from '@kit/shared/logger';
import { revalidatePath } from 'next/cache';

interface PayrollEvent {
  codigo: string;
  descricao: string;
  quantidade: number;
  valor: number;
  tipo: 'P' | 'D';
}

interface PayrollEmployee {
  codigo: string;
  nome: string;
  cpf: string;
  situacao: string;
  data_admissao: string;
  vinculo: string;
  cc: string;
  depto: string;
  horas_mes: number;
  cargo_codigo: string;
  cargo_descricao: string;
  cbo: string;
  filial: string;
  salario: number;
  salario_base: number;
  eventos: PayrollEvent[];
  totais: {
    proventos: number;
    descontos: number;
    liquido: number;
  };
  bases: {
    base_inss: number;
    base_fgts: number;
    base_irrf: number;
    valor_fgts: number;
  };
}

interface PayrollCompetence {
  competencia: string;
  funcionarios: PayrollEmployee[];
}

interface PayrollCompany {
  cnpj: string;
  codigo: string;
  nome: string;
  competencia: string;
  emissao: string;
}

interface PayrollData {
  empresa: PayrollCompany;
  competencias: PayrollCompetence[];
  metadata: {
    data_inicio: string;
    data_fim: string;
    tempo_execucao_segundos: number;
  };
}

// Função para converter data brasileira para ISO
function convertBrazilianDate(dateStr: string): string {
  if (!dateStr) return new Date().toISOString().split('T')[0];
  
  // Formato esperado: DD/MM/YYYY
  const [day, month, year] = dateStr.split('/');
  if (day && month && year) {
    const isoDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    console.log(`Convertendo data: ${dateStr} -> ${isoDate}`);
    return isoDate;
  }
  
  // Fallback para data atual se formato inválido
  console.warn(`Formato de data inválido: ${dateStr}, usando data atual`);
  return new Date().toISOString().split('T')[0];
}

export async function savePayrollData(
  accountId: string,
  payrollData: PayrollData
) {
  const logger = await getLogger();
  const supabase = getSupabaseServerClient();

  try {
    logger.info({ accountId }, 'Iniciando salvamento de dados de folha de pagamento');

    // Processar cada competência
    for (const competency of payrollData.competencias) {
      // 1. Inserir/obter período
      const { data: period, error: periodError } = await supabase
        .from('payroll_periods')
        .upsert({
          account_id: accountId,
          period: competency.competencia,
          issue_date: convertBrazilianDate(payrollData.empresa.emissao),
          status: 'active'
        }, {
          onConflict: 'account_id,period'
        })
        .select()
        .single();

      if (periodError) {
        logger.error({ periodError, accountId, competency: competency.competencia }, 'Erro ao inserir período');
        throw new Error(`Erro ao inserir período: ${periodError.message}`);
      }

      // 2. Processar funcionários em lotes
      const batchSize = 50;
      for (let i = 0; i < competency.funcionarios.length; i += batchSize) {
        const batch = competency.funcionarios.slice(i, i + batchSize);
        
        await processEmployeeBatch(accountId, period.id, batch, supabase, logger);
        
        logger.info({
          accountId,
          periodId: period.id,
          processed: i + batch.length,
          total: competency.funcionarios.length
        }, 'Processando lote de funcionários');
      }
    }

    // Revalidar cache
    revalidatePath('/home/[account]/uploads');

    logger.info({ accountId }, 'Dados de folha de pagamento salvos com sucesso');
    
    return {
      success: true,
      message: 'Dados salvos com sucesso!'
    };

  } catch (error) {
    logger.error({ error, accountId }, 'Erro ao salvar dados de folha de pagamento');
    throw error;
  }
}

async function processEmployeeBatch(
  accountId: string,
  periodId: string,
  employees: PayrollEmployee[],
  supabase: any,
  logger: any
) {
  try {
    // 1. Inserir/atualizar funcionários (remover duplicatas)
    const employeeMap = new Map();
    employees.forEach(emp => {
      if (!employeeMap.has(emp.codigo)) {
        employeeMap.set(emp.codigo, {
          account_id: accountId,
          employee_code: emp.codigo,
          name: emp.nome,
          cpf: emp.cpf,
          hire_date: convertBrazilianDate(emp.data_admissao),
          employment_type: emp.vinculo,
          position_code: emp.cargo_codigo,
          position_description: emp.cargo_descricao,
          cbo: emp.cbo,
          branch: emp.filial,
          status: emp.situacao === 'Trabalhando' ? 'active' : 'inactive'
        });
      }
    });
    
    const employeeData = Array.from(employeeMap.values());
    
    logger.info({ 
      accountId, 
      employeeCount: employeeData.length,
      employeeCodes: employeeData.map(e => e.employee_code)
    }, 'Inserindo funcionários');

    const { data: insertedEmployees, error: employeeError } = await supabase
      .from('payroll_employees')
      .upsert(employeeData, {
        onConflict: 'account_id,employee_code'
      })
      .select();

    if (employeeError) {
      logger.error({ employeeError, employeeData }, 'Erro ao inserir funcionários');
      throw new Error(`Erro ao inserir funcionários: ${employeeError.message}`);
    }

    // 2. Inserir/atualizar departamentos (remover duplicatas)
    const departmentMap = new Map();
    employees.forEach(emp => {
      if (!departmentMap.has(emp.depto)) {
        departmentMap.set(emp.depto, {
          account_id: accountId,
          department_code: emp.depto,
          name: `Departamento ${emp.depto}`,
          cost_center: emp.cc
        });
      }
    });
    
    const departments = Array.from(departmentMap.values());
    
    logger.info({ 
      accountId, 
      departmentCount: departments.length,
      departmentCodes: departments.map(d => d.department_code)
    }, 'Inserindo departamentos');

    const { data: insertedDepartments, error: deptError } = await supabase
      .from('payroll_departments')
      .upsert(departments, {
        onConflict: 'account_id,department_code'
      })
      .select();

    if (deptError) {
      logger.error({ deptError, departments }, 'Erro ao inserir departamentos');
      throw new Error(`Erro ao inserir departamentos: ${deptError.message}`);
    }

    // 3. Inserir folhas de pagamento
    const sheetsData = employees.map(emp => {
      const employee = insertedEmployees.find(e => e.employee_code === emp.codigo);
      const department = insertedDepartments.find(d => d.department_code === emp.depto);
      
      return {
        period_id: periodId,
        employee_id: employee.id,
        department_id: department?.id,
        employment_status: emp.situacao,
        monthly_hours: emp.horas_mes,
        salary: emp.salario,
        base_salary: emp.salario_base,
        total_earnings: emp.totais.proventos,
        total_deductions: emp.totais.descontos,
        net_pay: emp.totais.liquido,
        inss_base: emp.bases.base_inss,
        fgts_base: emp.bases.base_fgts,
        irrf_base: emp.bases.base_irrf,
        fgts_amount: emp.bases.valor_fgts
      };
    });

    const { data: insertedSheets, error: sheetsError } = await supabase
      .from('payroll_sheets')
      .upsert(sheetsData, {
        onConflict: 'period_id,employee_id'
      })
      .select();

    if (sheetsError) {
      throw new Error(`Erro ao inserir folhas de pagamento: ${sheetsError.message}`);
    }

    // 4. Inserir eventos de pagamento
    const eventsData = [];
    for (let i = 0; i < employees.length; i++) {
      const emp = employees[i];
      const sheet = insertedSheets.find(s => s.employee_id === insertedEmployees[i].id);
      
      if (sheet) {
        for (const event of emp.eventos) {
          eventsData.push({
            sheet_id: sheet.id,
            event_code: event.codigo,
            description: event.descricao,
            quantity: event.quantidade,
            amount: event.valor,
            event_type: event.tipo,
            category: event.tipo === 'P' ? 'Earnings' : 'Deductions'
          });
        }
      }
    }

    if (eventsData.length > 0) {
      const { error: eventsError } = await supabase
        .from('payroll_events')
        .insert(eventsData);

      if (eventsError) {
        throw new Error(`Erro ao inserir eventos: ${eventsError.message}`);
      }
    }

  } catch (error) {
    logger.error({ error, accountId, periodId }, 'Erro ao processar lote de funcionários');
    throw error;
  }
}

// Função para obter estatísticas dos dados salvos
export async function getPayrollStats(accountId: string) {
  const supabase = getSupabaseServerClient();
  
  try {
    const { data: stats, error } = await supabase
      .from('people_analytics')
      .select('period, company_name, employee_name, salary, total_earnings, total_deductions, net_pay')
      .eq('company_name', (await supabase.from('accounts').select('name').eq('id', accountId).single()).data?.name);

    if (error) throw error;

    return stats;
  } catch (error) {
    console.error('Erro ao obter estatísticas:', error);
    return [];
  }
}
