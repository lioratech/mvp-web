import payrollData from '../_components/structure.json';

// Tipos para os filtros
export interface PayrollFilters {
  empresa?: string;
  departamento?: string;
  competencia?: string;
}

// Tipos para dados processados
export interface ProcessedPayrollData {
  totalFolha: number;
  funcionariosAtivos: number;
  mediaSalarial: number;
  departamentos: number;
  custosPorFuncao: Array<{
    funcao: string;
    custo: number;
    funcionarios: number;
  }>;
  distribuicaoSalarial: Array<{
    faixa: string;
    valor: number;
  }>;
  empresasFiltradas: string[];
  totalEmpresas: number;
  totalFuncionarios: number;
  competenciaAtual: string;
  competenciasDisponiveis: string[];
  funcoesDisponiveis: string[];
}

// Classe para gerenciar filtros de folha de pagamento
export class PayrollFilterManager {
  private data: any;

  constructor(data: any) {
    this.data = data;
  }

  // Extrair empresas únicas
  getEmpresas() {
    const empresasUnicas = new Set<string>();
    this.data.data.forEach((empresa: any) => {
      if (empresa.nome && empresa.nome.includes('LTDA')) {
        empresasUnicas.add(empresa.nome);
      }
    });
    return Array.from(empresasUnicas).map((nome, index) => ({
      id: nome,
      nome: nome
    }));
  }

  // Extrair funções únicas
  getFuncoes() {
    const funcoesUnicas = new Set<string>();
    this.data.data.forEach((empresa: any) => {
      empresa.funcionarios?.forEach((func: any) => {
        if (func.funcao) {
          funcoesUnicas.add(func.funcao);
        }
      });
    });
    return Array.from(funcoesUnicas).map((funcao, index) => ({
      id: funcao,
      nome: funcao
    }));
  }

  // Extrair competências únicas dos dados
  getCompetencias() {
    const competenciasUnicas = new Set<string>();
    this.data.data.forEach((empresa: any) => {
      if (empresa.competencia) {
        competenciasUnicas.add(empresa.competencia);
      }
    });
    return Array.from(competenciasUnicas).map((competencia, index) => ({
      id: competencia,
      nome: competencia
    }));
  }

  // Aplicar filtros aos dados
  applyFilters(filters: PayrollFilters) {
    let filteredData = [...this.data.data];

    // Filtrar por empresa
    if (filters.empresa) {
      filteredData = filteredData.filter(empresa => empresa.nome === filters.empresa);
    }

    // Filtrar por função/departamento
    if (filters.departamento) {
      filteredData = filteredData.map(empresa => ({
        ...empresa,
        funcionarios: empresa.funcionarios.filter((func: any) => func.funcao === filters.departamento)
      })).filter(empresa => empresa.funcionarios.length > 0);
    }

    // Filtrar por competência
    if (filters.competencia && filters.competencia !== 'todas') {
      filteredData = filteredData.filter(empresa => {
        if (!empresa.competencia) return false;
        return empresa.competencia === filters.competencia;
      });
    }

    return filteredData;
  }

  // Processar dados filtrados
  processFilteredData(filteredData: any[]): ProcessedPayrollData {
    const totalFolha = filteredData.reduce((acc, empresa) => {
      return acc + empresa.funcionarios.reduce((empAcc, func) => {
        const liquido = func.eventos.find((e: any) => e.codigo === '*LÍQUIDO*')?.valor || 0;
        return empAcc + liquido;
      }, 0);
    }, 0);

    const funcionariosAtivos = filteredData.reduce((acc, empresa) => {
      return acc + empresa.funcionarios.filter((f: any) => f.condicao === 'Ativo').length;
    }, 0);

    const mediaSalarial = funcionariosAtivos > 0 ? totalFolha / funcionariosAtivos : 0;

    // Análise por função
    const funcoes = new Map();
    filteredData.forEach((empresa) => {
      empresa.funcionarios.forEach((func: any) => {
        const funcao = func.funcao;
        const liquido = func.eventos.find((e: any) => e.codigo === '*LÍQUIDO*')?.valor || 0;
        
        if (!funcoes.has(funcao)) {
          funcoes.set(funcao, { count: 0, total: 0 });
        }
        
        const dados = funcoes.get(funcao);
        dados.count++;
        dados.total += liquido;
      });
    });

    const custosPorFuncao = Array.from(funcoes.entries()).map(([funcao, dados]: [string, any]) => ({
      funcao,
      custo: dados.total,
      funcionarios: dados.count
    }));

    // Distribuição salarial
    const salarios = filteredData.flatMap(empresa => 
      empresa.funcionarios.map((func: any) => {
        const liquido = func.eventos.find((e: any) => e.codigo === '*LÍQUIDO*')?.valor || 0;
        return liquido;
      })
    ).filter(s => s > 0);

    const salarioMedio = salarios.length > 0 ? salarios.reduce((a, b) => a + b, 0) / salarios.length : 0;
    
    const distribuicaoSalarial = [
      { faixa: 'Até R$ 1.500', valor: salarios.filter(s => s <= 1500).length },
      { faixa: 'R$ 1.500 - R$ 2.500', valor: salarios.filter(s => s > 1500 && s <= 2500).length },
      { faixa: 'Acima de R$ 2.500', valor: salarios.filter(s => s > 2500).length },
    ];

    // Extrair dados disponíveis para filtros
    const competenciasDisponiveis = this.getCompetencias().map(c => c.nome);
    const funcoesDisponiveis = this.getFuncoes().map(f => f.nome);

    return {
      totalFolha,
      funcionariosAtivos,
      mediaSalarial,
      departamentos: filteredData.length,
      custosPorFuncao,
      distribuicaoSalarial,
      empresasFiltradas: filteredData.map(e => e.nome),
      totalEmpresas: this.data.data.length,
      totalFuncionarios: this.data.data.reduce((acc, empresa) => acc + empresa.funcionarios.length, 0),
      competenciaAtual: filteredData[0]?.competencia || 'Janeiro/2025',
      competenciasDisponiveis,
      funcoesDisponiveis
    };
  }

  // Obter dados processados com filtros
  getProcessedData(filters: PayrollFilters): ProcessedPayrollData {
    const filteredData = this.applyFilters(filters);
    return this.processFilteredData(filteredData);
  }

  // Obter estatísticas de filtros
  getFilterStats(filters: PayrollFilters) {
    const filteredData = this.applyFilters(filters);
    const totalData = this.data.data;
    
    return {
      dadosFiltrados: filteredData.length,
      totalDados: totalData.length,
      porcentagemFiltrada: totalData.length > 0 ? (filteredData.length / totalData.length) * 100 : 0,
      funcionariosFiltrados: filteredData.reduce((acc, empresa) => acc + empresa.funcionarios.length, 0),
      totalFuncionarios: totalData.reduce((acc, empresa) => acc + empresa.funcionarios.length, 0)
    };
  }

  // Método para debug - verificar dados filtrados
  debugFilters(filters: PayrollFilters) {
    const filteredData = this.applyFilters(filters);
    console.log('Filtros aplicados:', filters);
    console.log('Dados filtrados:', filteredData);
    console.log('Total de empresas filtradas:', filteredData.length);
    console.log('Total de funcionários filtrados:', filteredData.reduce((acc, empresa) => acc + empresa.funcionarios.length, 0));
    return filteredData;
  }
}

// Instância global do gerenciador de filtros
export const payrollFilterManager = new PayrollFilterManager(payrollData); 