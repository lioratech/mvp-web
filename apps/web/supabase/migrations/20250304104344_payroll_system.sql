-- Migration: Payroll System Tables
-- Description: Create tables for payroll data management and people analytics

-- Create payroll periods table
CREATE TABLE IF NOT EXISTS public.payroll_periods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID REFERENCES public.accounts(id) ON DELETE CASCADE NOT NULL,
  period VARCHAR(7) NOT NULL, -- MM/YYYY format
  issue_date DATE NOT NULL,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'archived', 'processing')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(account_id, period)
);

-- Create payroll employees table
CREATE TABLE IF NOT EXISTS public.payroll_employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID REFERENCES public.accounts(id) ON DELETE CASCADE NOT NULL,
  employee_code VARCHAR(50) NOT NULL,
  name VARCHAR(255) NOT NULL,
  cpf VARCHAR(14) NOT NULL,
  hire_date DATE NOT NULL,
  employment_type VARCHAR(50) NOT NULL,
  position_code VARCHAR(50),
  position_description VARCHAR(255),
  cbo VARCHAR(10), -- Brazilian Occupation Classification
  branch VARCHAR(50),
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'terminated')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(account_id, employee_code)
);

-- Create payroll departments table
CREATE TABLE IF NOT EXISTS public.payroll_departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID REFERENCES public.accounts(id) ON DELETE CASCADE NOT NULL,
  department_code VARCHAR(50) NOT NULL,
  name VARCHAR(255) NOT NULL,
  cost_center VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(account_id, department_code)
);

-- Create payroll sheets table (main payroll data per period)
CREATE TABLE IF NOT EXISTS public.payroll_sheets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  period_id UUID REFERENCES public.payroll_periods(id) ON DELETE CASCADE NOT NULL,
  employee_id UUID REFERENCES public.payroll_employees(id) ON DELETE CASCADE NOT NULL,
  department_id UUID REFERENCES public.payroll_departments(id),
  employment_status VARCHAR(50) NOT NULL,
  monthly_hours INTEGER NOT NULL,
  salary DECIMAL(12,2) NOT NULL,
  base_salary DECIMAL(12,2) NOT NULL,
  total_earnings DECIMAL(12,2) NOT NULL DEFAULT 0,
  total_deductions DECIMAL(12,2) NOT NULL DEFAULT 0,
  net_pay DECIMAL(12,2) NOT NULL DEFAULT 0,
  inss_base DECIMAL(12,2) NOT NULL DEFAULT 0,
  fgts_base DECIMAL(12,2) NOT NULL DEFAULT 0,
  irrf_base DECIMAL(12,2) NOT NULL DEFAULT 0,
  fgts_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(period_id, employee_id)
);

-- Create payroll events table (individual payroll items)
CREATE TABLE IF NOT EXISTS public.payroll_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sheet_id UUID REFERENCES public.payroll_sheets(id) ON DELETE CASCADE NOT NULL,
  event_code VARCHAR(50) NOT NULL,
  description VARCHAR(255) NOT NULL,
  quantity DECIMAL(10,2) NOT NULL DEFAULT 0,
  amount DECIMAL(12,2) NOT NULL DEFAULT 0,
  event_type VARCHAR(1) NOT NULL CHECK (event_type IN ('P', 'D')), -- P=Earnings, D=Deductions
  category VARCHAR(50), -- Salary, Benefits, Deductions, etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_payroll_periods_account ON public.payroll_periods(account_id);
CREATE INDEX IF NOT EXISTS idx_payroll_periods_period ON public.payroll_periods(period);
CREATE INDEX IF NOT EXISTS idx_payroll_employees_account ON public.payroll_employees(account_id);
CREATE INDEX IF NOT EXISTS idx_payroll_employees_code ON public.payroll_employees(employee_code);
CREATE INDEX IF NOT EXISTS idx_payroll_employees_cpf ON public.payroll_employees(cpf);
CREATE INDEX IF NOT EXISTS idx_payroll_departments_account ON public.payroll_departments(account_id);
CREATE INDEX IF NOT EXISTS idx_payroll_sheets_period ON public.payroll_sheets(period_id);
CREATE INDEX IF NOT EXISTS idx_payroll_sheets_employee ON public.payroll_sheets(employee_id);
CREATE INDEX IF NOT EXISTS idx_payroll_sheets_department ON public.payroll_sheets(department_id);
CREATE INDEX IF NOT EXISTS idx_payroll_events_sheet ON public.payroll_events(sheet_id);
CREATE INDEX IF NOT EXISTS idx_payroll_events_type ON public.payroll_events(event_type);

-- Enable Row Level Security
ALTER TABLE public.payroll_periods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payroll_employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payroll_departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payroll_sheets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payroll_events ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "payroll_periods_access" ON public.payroll_periods
  FOR ALL TO authenticated USING (
    account_id = (SELECT auth.uid()) OR
    public.has_role_on_account(account_id)
  );

CREATE POLICY "payroll_employees_access" ON public.payroll_employees
  FOR ALL TO authenticated USING (
    account_id = (SELECT auth.uid()) OR
    public.has_role_on_account(account_id)
  );

CREATE POLICY "payroll_departments_access" ON public.payroll_departments
  FOR ALL TO authenticated USING (
    account_id = (SELECT auth.uid()) OR
    public.has_role_on_account(account_id)
  );

CREATE POLICY "payroll_sheets_access" ON public.payroll_sheets
  FOR ALL TO authenticated USING (
    period_id IN (
      SELECT id FROM public.payroll_periods 
      WHERE account_id = (SELECT auth.uid()) OR 
            public.has_role_on_account(account_id)
    )
  );

CREATE POLICY "payroll_events_access" ON public.payroll_events
  FOR ALL TO authenticated USING (
    sheet_id IN (
      SELECT ps.id FROM public.payroll_sheets ps
      JOIN public.payroll_periods pp ON ps.period_id = pp.id
      WHERE pp.account_id = (SELECT auth.uid()) OR 
            public.has_role_on_account(pp.account_id)
    )
  );

-- Create views for analytics
CREATE OR REPLACE VIEW public.people_analytics AS
SELECT 
  a.name as company_name,
  pp.period,
  pe.name as employee_name,
  pe.cpf,
  pe.position_description,
  pd.name as department_name,
  ps.salary,
  ps.total_earnings,
  ps.total_deductions,
  ps.net_pay,
  ps.monthly_hours,
  ps.inss_base,
  ps.fgts_base,
  ps.fgts_amount,
  pp.issue_date
FROM public.payroll_sheets ps
JOIN public.payroll_periods pp ON ps.period_id = pp.id
JOIN public.payroll_employees pe ON ps.employee_id = pe.id
JOIN public.accounts a ON pe.account_id = a.id
LEFT JOIN public.payroll_departments pd ON ps.department_id = pd.id;

-- Create department summary view
CREATE OR REPLACE VIEW public.department_summary AS
SELECT 
  a.name as company_name,
  pp.period,
  pd.name as department_name,
  COUNT(ps.id) as total_employees,
  SUM(ps.salary) as total_salaries,
  SUM(ps.total_earnings) as total_earnings,
  SUM(ps.total_deductions) as total_deductions,
  SUM(ps.net_pay) as total_net_pay,
  AVG(ps.salary) as average_salary,
  AVG(ps.monthly_hours) as average_hours
FROM public.payroll_sheets ps
JOIN public.payroll_periods pp ON ps.period_id = pp.id
JOIN public.payroll_employees pe ON ps.employee_id = pe.id
JOIN public.accounts a ON pe.account_id = a.id
LEFT JOIN public.payroll_departments pd ON ps.department_id = pd.id
GROUP BY a.name, pp.period, pd.name;

-- Function removed - using TypeScript savePayrollData instead
GRANT SELECT ON public.people_analytics TO authenticated;
GRANT SELECT ON public.department_summary TO authenticated;
