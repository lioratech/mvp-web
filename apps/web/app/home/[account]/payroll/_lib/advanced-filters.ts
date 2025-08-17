import payrollData from '../_components/structure.json';
import { AdvancedFilters, ProcessedPayrollData, Company, Employee, PayrollEvent } from '../_components/types';

export class AdvancedPayrollFilterManager {
  private data: Company[];

  constructor(data: any) {
    this.data = data.data;
  }

  // Extrair empresas únicas
  getCompanies() {
    const companiesUnique = new Set<string>();
    this.data.forEach((company) => {
      if (company.name && company.name.includes('LTDA')) {
        companiesUnique.add(company.name);
      }
    });
    return Array.from(companiesUnique).map((name) => ({
      id: name,
      name: name
    }));
  }

  // Extrair funções únicas
  getFunctions() {
    const functionsUnique = new Set<string>();
    this.data.forEach((company) => {
      company.employees?.forEach((employee) => {
        if (employee.function) {
          functionsUnique.add(employee.function);
        }
      });
    });
    return Array.from(functionsUnique).map((function_) => ({
      id: function_,
      name: function_
    }));
  }

  // Extrair competências únicas
  getCompetencies() {
    const competenciesUnique = new Set<string>();
    this.data.forEach((company) => {
      if (company.competency) {
        competenciesUnique.add(company.competency);
      }
    });
    return Array.from(competenciesUnique).map((competency) => ({
      id: competency,
      name: competency
    }));
  }

  // Extrair eventos únicos
  getEvents() {
    const eventsUnique = new Set<string>();
    this.data.forEach((company) => {
      company.employees?.forEach((employee) => {
        employee.events?.forEach((event) => {
          if (event.code && event.code !== '*LÍQUIDO*') {
            eventsUnique.add(event.code);
          }
        });
      });
    });
    return Array.from(eventsUnique).map((code) => ({
      id: code,
      name: code
    }));
  }

  // Função auxiliar para converter data de admissão
  private parseAdmissionDate(admission: string | null | undefined): Date | null {
    if (!admission || typeof admission !== 'string') {
      return null;
    }

    try {
      if (admission.includes('/')) {
        // Formato DD/MM/YYYY
        const parts = admission.split('/');
        if (parts.length === 3) {
          return new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
        }
      } else if (admission.includes('-')) {
        // Formato YYYY-MM-DD
        return new Date(admission);
      }
    } catch (error) {
      console.warn('Erro ao processar data de admissão:', admission);
    }

    return null;
  }

  // Aplicar filtros avançados
  applyAdvancedFilters(filters: AdvancedFilters): Company[] {
    let filteredData = [...this.data];

    // Filtrar por empresas
    if (filters.companies && filters.companies.length > 0) {
      filteredData = filteredData.filter(company => 
        company.name && filters.companies!.includes(company.name)
      );
    }

    // Filtrar por competências
    if (filters.competencies && filters.competencies.length > 0) {
      filteredData = filteredData.filter(company => 
        company.competency && filters.competencies!.includes(company.competency)
      );
    }

    // Filtrar funcionários por função
    if (filters.functions && filters.functions.length > 0) {
      filteredData = filteredData.map(company => ({
        ...company,
        employees: company.employees.filter(employee => 
          employee.function && filters.functions!.includes(employee.function)
        )
      })).filter(company => company.employees.length > 0);
    }

    // Filtrar por status
    if (filters.status && filters.status.length > 0) {
      filteredData = filteredData.map(company => ({
        ...company,
        employees: company.employees.filter(employee => 
          employee.condition && filters.status!.includes(employee.condition)
        )
      })).filter(company => company.employees.length > 0);
    }

    // Filtrar por faixa salarial
    if (filters.salaryRange) {
      filteredData = filteredData.map(company => ({
        ...company,
        employees: company.employees.filter(employee => {
          const liquid = employee.events.find(e => e.code === '*LÍQUIDO*')?.value || 0;
          return liquid >= filters.salaryRange!.min && liquid <= filters.salaryRange!.max;
        })
      })).filter(company => company.employees.length > 0);
    }

    // Filtrar por data de admissão
    if (filters.admissionDate) {
      filteredData = filteredData.map(company => ({
        ...company,
        employees: company.employees.filter(employee => {
          const admissionDate = this.parseAdmissionDate(employee.admission);
          if (!admissionDate) return false;
          
          const start = new Date(filters.admissionDate!.start);
          const end = new Date(filters.admissionDate!.end);
          return admissionDate >= start && admissionDate <= end;
        })
      })).filter(company => company.employees.length > 0);
    }

    // Filtrar por eventos
    if (filters.events && filters.events.length > 0) {
      filteredData = filteredData.map(company => ({
        ...company,
        employees: company.employees.filter(employee => 
          employee.events.some(event => filters.events!.includes(event.code))
        )
      })).filter(company => company.employees.length > 0);
    }

    return filteredData;
  }

  // Processar dados filtrados
  processFilteredData(filteredData: Company[]): ProcessedPayrollData {
    const totalPayroll = filteredData.reduce((acc, company) => {
      return acc + company.employees.reduce((empAcc, employee) => {
        const liquid = employee.events.find(e => e.code === '*LÍQUIDO*')?.value || 0;
        return empAcc + liquid;
      }, 0);
    }, 0);

    const activeEmployees = filteredData.reduce((acc, company) => {
      return acc + company.employees.filter(e => e.condition === 'Ativo').length;
    }, 0);

    const inactiveEmployees = filteredData.reduce((acc, company) => {
      return acc + company.employees.filter(e => e.condition === 'Inativo').length;
    }, 0);

    const totalEmployees = activeEmployees + inactiveEmployees;
    const averageSalary = totalEmployees > 0 ? totalPayroll / totalEmployees : 0;

    // Análise por função
    const functions = new Map<string, { count: number; total: number }>();
    filteredData.forEach((company) => {
      company.employees.forEach((employee) => {
        const function_ = employee.function || 'Função não informada';
        const liquid = employee.events.find(e => e.code === '*LÍQUIDO*')?.value || 0;
        
        if (!functions.has(function_)) {
          functions.set(function_, { count: 0, total: 0 });
        }
        
        const data = functions.get(function_)!;
        data.count++;
        data.total += liquid;
      });
    });

    const costsByFunction = Array.from(functions.entries()).map(([function_, data]) => ({
      function: function_,
      cost: data.total,
      employees: data.count,
      average: data.count > 0 ? data.total / data.count : 0
    }));

    // Análise por empresa
    const companies = new Map<string, { count: number; total: number }>();
    filteredData.forEach((company) => {
      const name = company.name || company.cnpj || 'Empresa não informada';
      const total = company.employees.reduce((acc, employee) => {
        const liquid = employee.events.find(e => e.code === '*LÍQUIDO*')?.value || 0;
        return acc + liquid;
      }, 0);
      
      companies.set(name, {
        count: company.employees.length,
        total
      });
    });

    const costsByCompany = Array.from(companies.entries()).map(([company, data]) => ({
      company,
      cost: data.total,
      employees: data.count,
      average: data.count > 0 ? data.total / data.count : 0
    }));

    // Análise de eventos principais
    const events = new Map<string, { total: number; count: number; description: string }>();
    filteredData.forEach((company) => {
      company.employees.forEach((employee) => {
        employee.events.forEach((event) => {
          if (event.code !== '*LÍQUIDO*') {
            if (!events.has(event.code)) {
              events.set(event.code, { total: 0, count: 0, description: event.description || 'Descrição não informada' });
            }
            const data = events.get(event.code)!;
            data.total += event.value;
            data.count++;
          }
        });
      });
    });

    const mainEvents = Array.from(events.entries())
      .map(([code, data]) => ({
        code,
        description: data.description,
        total: data.total,
        average: data.count > 0 ? data.total / data.count : 0
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 10);

    // Distribuição salarial
    const salaries = filteredData.flatMap(company => 
      company.employees.map(employee => {
        const liquid = employee.events.find(e => e.code === '*LÍQUIDO*')?.value || 0;
        return liquid;
      })
    ).filter(s => s > 0);

    const salaryDistribution = [
      { range: 'Até R$ 1.500', value: salaries.filter(s => s <= 1500).length, percentage: 0 },
      { range: 'R$ 1.501 - R$ 3.000', value: salaries.filter(s => s > 1500 && s <= 3000).length, percentage: 0 },
      { range: 'R$ 3.001 - R$ 5.000', value: salaries.filter(s => s > 3000 && s <= 5000).length, percentage: 0 },
      { range: 'R$ 5.001 - R$ 8.000', value: salaries.filter(s => s > 5000 && s <= 8000).length, percentage: 0 },
      { range: 'Acima de R$ 8.000', value: salaries.filter(s => s > 8000).length, percentage: 0 }
    ];

    // Calcular percentuais
    const totalSalaries = salaries.length;
    salaryDistribution.forEach(range => {
      range.percentage = totalSalaries > 0 ? (range.value / totalSalaries) * 100 : 0;
    });

    return {
      totalPayroll,
      activeEmployees,
      inactiveEmployees,
      averageSalary,
      totalCompanies: filteredData.length,
      totalEmployees,
      currentCompetency: filteredData[0]?.competency || 'Competência não informada',
      salaryDistribution,
      costsByFunction,
      costsByCompany,
      mainEvents,
      filterStatistics: {
        filteredData: filteredData.length,
        totalData: this.data.length,
        filteredPercentage: this.data.length > 0 ? (filteredData.length / this.data.length) * 100 : 0,
        filteredEmployees: totalEmployees,
        totalEmployees: this.data.reduce((acc, company) => acc + company.employees.length, 0)
      },
      filterOptions: {
        companies: this.getCompanies(),
        functions: this.getFunctions(),
        competencies: this.getCompetencies(),
        events: this.getEvents()
      }
    };
  }

  // Obter dados processados com filtros
  getProcessedData(filters: AdvancedFilters): ProcessedPayrollData {
    const filteredData = this.applyAdvancedFilters(filters);
    return this.processFilteredData(filteredData);
  }

  // Debug dos filtros aplicados
  debugFilters(filters: AdvancedFilters) {
    console.log('Filtros aplicados:', filters);
    const filteredData = this.applyAdvancedFilters(filters);
    console.log('Dados filtrados:', filteredData);
    return filteredData;
  }
}

// Instância global do gerenciador de filtros
export const advancedPayrollFilterManager = new AdvancedPayrollFilterManager(payrollData); 