-- Create account_payroll_events table
CREATE TABLE IF NOT EXISTS public.account_payroll_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID REFERENCES public.accounts(id) ON DELETE CASCADE NOT NULL,
  name VARCHAR(255) NOT NULL,
  external_id VARCHAR(255),
  description TEXT,
  color VARCHAR(7) DEFAULT '#3B82F6',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Enable RLS
ALTER TABLE public.account_payroll_events ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "account_payroll_events_read" ON public.account_payroll_events FOR SELECT
  TO authenticated USING (
    public.has_role_on_account(account_id)
  );

CREATE POLICY "account_payroll_events_insert" ON public.account_payroll_events FOR INSERT
  TO authenticated WITH CHECK (
    public.has_role_on_account(account_id)
  );

CREATE POLICY "account_payroll_events_update" ON public.account_payroll_events FOR UPDATE
  TO authenticated USING (
    public.has_role_on_account(account_id)
  ) WITH CHECK (
    public.has_role_on_account(account_id)
  );

CREATE POLICY "account_payroll_events_delete" ON public.account_payroll_events FOR DELETE
  TO authenticated USING (
    public.has_role_on_account(account_id)
  );

-- Create indexes
CREATE INDEX IF NOT EXISTS account_payroll_events_account_id_idx ON public.account_payroll_events(account_id);
CREATE INDEX IF NOT EXISTS account_payroll_events_external_id_idx ON public.account_payroll_events(external_id);

-- Add triggers
CREATE TRIGGER set_timestamps
  BEFORE UPDATE ON public.account_payroll_events
  FOR EACH ROW EXECUTE FUNCTION public.trigger_set_timestamps();

CREATE TRIGGER set_user_tracking
  BEFORE INSERT OR UPDATE ON public.account_payroll_events
  FOR EACH ROW EXECUTE FUNCTION public.trigger_set_user_tracking(); 