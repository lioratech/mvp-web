// Tipos para eventos de folha de pagamento
export interface PayrollEvent {
  code: string;
  description: string;
  quantity: number | null;
  value: number;
}

// Tipos para funcionários
export interface Employee {
  admission: string;
  cbo: string;
  condition: 'Ativo' | 'Inativo';
  cpf: string;
  events: PayrollEvent[];
  function: string;
  name: string;
  salary_type: string;
}

// Tipos para empresas
export interface Company {
  cnpj: string;
  competency: string;
  company_id: string;
  address: string;
  employees: Employee[];
  name?: string;
}

// Tipos para dados de folha de pagamento
export interface PayrollData {
  data: Company[];
}

// Tipos para filtros avançados
export interface AdvancedFilters {
  companies?: string[];
  functions?: string[];
  competencies?: string[];
  status?: ('Ativo' | 'Inativo')[];
  salaryRange?: {
    min: number;
    max: number;
  };
  admissionDate?: {
    start: string;
    end: string;
  };
  events?: string[];
}

// Tipos para dados processados
export interface ProcessedPayrollData {
  totalPayroll: number;
  activeEmployees: number;
  inactiveEmployees: number;
  averageSalary: number;
  totalCompanies: number;
  totalEmployees: number;
  currentCompetency: string;
  salaryDistribution: Array<{
    range: string;
    value: number;
    percentage: number;
  }>;
  costsByFunction: Array<{
    function: string;
    cost: number;
    employees: number;
    average: number;
  }>;
  costsByCompany: Array<{
    company: string;
    cost: number;
    employees: number;
    average: number;
  }>;
  mainEvents: Array<{
    code: string;
    description: string;
    total: number;
    average: number;
  }>;
  filterStatistics: {
    filteredData: number;
    totalData: number;
    filteredPercentage: number;
    filteredEmployees: number;
    totalEmployees: number;
  };
  filterOptions: {
    companies: Array<{ id: string; name: string }>;
    functions: Array<{ id: string; name: string }>;
    competencies: Array<{ id: string; name: string }>;
    events: Array<{ id: string; name: string }>;
  };
}

// Tipos para componentes de filtros
export interface FilterOption {
  id: string;
  name: string;
  count?: number;
}

export interface FilterSection {
  title: string;
  key: keyof AdvancedFilters;
  options: FilterOption[];
  multiSelect?: boolean;
  searchable?: boolean;
}

// Tipos para gráficos e visualizações
export interface ChartData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    backgroundColor?: string[];
    borderColor?: string[];
    borderWidth?: number;
  }>;
}

// Tipos para relatórios
export interface ReportConfig {
  type: 'pdf' | 'excel' | 'csv';
  period: string;
  filters: AdvancedFilters;
  includeCharts: boolean;
  includeDetails: boolean;
}

// Tipos para alertas e notificações
export interface PayrollAlert {
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  timestamp: string;
  action?: string;
}

// Tipos para métricas de BI
export interface BIMetrics {
  costPerEmployee: number;
  turnover: number;
  operationalEfficiency: number;
  trends: {
    growth: number;
    period: string;
  };
  previousMonthComparison: {
    variation: number;
    type: 'increase' | 'decrease' | 'stable';
  };
} 