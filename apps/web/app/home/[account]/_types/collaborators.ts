export interface CollaboratorStatus {
  id: number;
  platform_id: number | null;
  account_id: number | null;
  reference_month: number | null;
  reference_year: number | null;
  company_cnpj: string | null;
  company_code: number | null;
  company_issue_date: string | null;
  collaborator_code: number | null;
  collaborator_name: string | null;
  collaborator_cpf: string | null;
  collaborator_status: string | null;
  collaborator_admission_date: string | null;
  collaborator_link: string | null;
  collaborator_cc: number | null;
  collaborator_department: number | null;
  collaborator_hours_per_month: number | null;
  collaborator_position_code: number | null;
  collaborator_position_description: string | null;
  collaborator_cbo: string | null;
  collaborator_branch: number | null;
  collaborator_salary: number | null;
  collaborator_base_salary: number | null;
  event_code: number | null;
  event_description: string | null;
  event_quantity: number | null;
  event_value: number | null;
  event_type: string | null;
  total_earnings: number | null;
  total_deductions: number | null;
  total_net_salary: number | null;
  base_inss: number | null;
  base_fgts: number | null;
  base_fgts_value: number | null;
  base_irrf: number | null;
}

export interface MonthlyCollaboratorsData {
  current: {
    total_colaboradores: number;
    status_breakdown: Array<{
      status: string;
      count: number;
    }>;
    growth_percentage: number;
  };
  monthly: Array<{
    year: number;
    month: number;
    period: string;
    month_name: string;
    total: number;
    status_breakdown: Array<{
      status: string;
      count: number;
    }>;
  }>;
}

export interface CollaboratorsChartData {
  month: string;
  [status: string]: string | number; 
}
