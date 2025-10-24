'use server';

import { revalidatePath } from 'next/cache';

import { getLogger } from '@kit/shared/logger';
import { getSupabaseServerClient } from '@kit/supabase/server-client';

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
  platform_id?: string;
  funcionarios: PayrollEmployee[];
  resumo_rubrica?: Array<{
    codigo: string;
    descricao: string;
    quantidade: number;
    valor: number;
    tipo: string;
  }>;
  quadro_competencia?: {
    inss?: Record<string, number>;
    fgts_pis_iss?: Record<string, number>;
    irrf_calculo?: Record<string, number>;
    irrf_pagamento?: Record<string, number>;
  };
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
  metadata?: {
    data_inicio: string;
    data_fim: string;
    tempo_execucao_segundos: number;
  };
}

export async function savePayrollData(
  accountId: string,
  payrollData: PayrollData,
) {
  const client = getSupabaseServerClient();
  const logger = await getLogger();

  try {
    logger.info(
      { accountId, cnpj: payrollData.empresa.cnpj },
      'Iniciando processo de salvamento da folha de pagamento',
    );

    // 1. Salvar registros na tabela payrolls do Supabase
    // Coletar competências únicas para evitar conflitos
    const uniquePayrolls = new Map<
      string,
      { month: number; year: number; filial: string }
    >();

    for (const competency of payrollData.competencias) {
      const filial = competency.funcionarios[0]?.filial || 'Filial Principal';
      const [monthStr, yearStr] = competency.competencia.split('/');
      const month = parseInt(monthStr, 10);
      const year = parseInt(yearStr, 10);

      if (isNaN(month) || isNaN(year)) {
        logger.error(
          { competencia: competency.competencia },
          'Formato de competência inválido',
        );
        continue;
      }

      const key = `${month}-${year}`;
      if (!uniquePayrolls.has(key)) {
        uniquePayrolls.set(key, { month, year, filial });
      }
    }

    // Inserir todas as folhas únicas de uma vez
    const payrollIdMap = new Map<string, string>(); // Mapa: "month-year" -> payroll_id

    if (uniquePayrolls.size > 0) {
      const payrollsToInsert = Array.from(uniquePayrolls.values()).map(
        (p) =>
          ({
            account_id: accountId,
            month: p.month,
            year: p.year,
            cnpj: payrollData.empresa.cnpj,
            filial: p.filial,
            is_current: true,
          }) as any,
      );

      const { error } = await client.from('payrolls').upsert(payrollsToInsert, {
        onConflict: 'account_id,month,year',
      });

      if (error) {
        logger.error(
          { accountId, error: error.message },
          'Erro ao salvar folha no Supabase',
        );
        throw new Error(`Erro ao salvar folha: ${error.message}`);
      }

      // Buscar os IDs das payrolls criadas/atualizadas
      for (const [key, p] of uniquePayrolls.entries()) {
        const { data: payroll, error: selectError } = await client
          .from('payrolls')
          .select('id')
          .eq('account_id', accountId)
          .eq('month', p.month)
          .eq('year', p.year)
          .single();

        if (selectError || !payroll) {
          logger.error(
            {
              accountId,
              month: p.month,
              year: p.year,
              error: selectError?.message,
            },
            'Erro ao buscar ID da payroll criada',
          );
          throw new Error(
            `Erro ao buscar ID da payroll: ${selectError?.message}`,
          );
        }

        payrollIdMap.set(key, payroll.id);
      }
    }

    logger.info(
      {
        accountId,
        count: uniquePayrolls.size,
        payrollIds: Array.from(payrollIdMap.values()),
      },
      'Folhas salvas no Supabase com sucesso e IDs obtidos',
    );

    // Adicionar platform_id diretamente em cada competência
    for (const competency of payrollData.competencias) {
      const [monthStr, yearStr] = competency.competencia.split('/');
      const key = `${parseInt(monthStr, 10)}-${parseInt(yearStr, 10)}`;
      const platformId = payrollIdMap.get(key);

      if (platformId) {
        competency.platform_id = platformId;
      }
    }

    logger.info(
      {
        accountId,
        competenciasCount: payrollData.competencias.length,
        competenciasWithPlatformId: payrollData.competencias.filter(
          (c) => c.platform_id,
        ).length,
      },
      'Platform IDs adicionados às competências',
    );

    // 2. Chamar API para processar dados no MySQL
    const apiUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/payroll/process`;

    logger.info({ accountId, apiUrl }, 'Chamando API de processamento');

    // Obter cookies de autenticação e CSRF token
    const { cookies } = await import('next/headers');
    const cookieStore = await cookies();
    const cookieHeader = cookieStore
      .getAll()
      .map((cookie) => `${cookie.name}=${cookie.value}`)
      .join('; ');

    const csrfToken = cookieStore.get('csrf-token')?.value || '';

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookieHeader,
        'x-csrf-token': csrfToken,
      },
      body: JSON.stringify({
        accountId,
        payrollData,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      logger.error(
        { accountId, status: response.status, error: errorData },
        'Erro ao chamar API de processamento',
      );
      throw new Error(
        `Erro ao processar dados no MySQL: ${errorData.details || response.statusText}`,
      );
    }

    const result = await response.json();

    logger.info(
      { accountId, result },
      'Dados processados com sucesso no MySQL',
    );

    // Revalidar o cache da página de listagem
    revalidatePath('/home/[account]/uploads/lists');

    logger.info({ accountId }, 'Processo de salvamento concluído');

    return {
      success: true,
      message: 'Dados salvos e processados com sucesso!',
      details: result.data,
    };
  } catch (error) {
    logger.error({ accountId, error }, 'Erro no processo de salvamento');

    throw error;
  }
}
