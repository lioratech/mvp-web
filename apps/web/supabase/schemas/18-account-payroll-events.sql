/*
 * -------------------------------------------------------
 * Section: Account Payroll Events
 * We create the schema for payroll events within team accounts
 * -------------------------------------------------------
 */

-- Create account_payroll_events table
create table if not exists public.account_payroll_events (
  id uuid primary key default gen_random_uuid(),
  account_id uuid references public.accounts(id) on delete cascade not null,
  name varchar(255) not null,
  external_id varchar(255),
  description text,
  color varchar(7) default '#3B82F6',
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null
);

comment on table public.account_payroll_events is 'Payroll events within team accounts';
comment on column public.account_payroll_events.account_id is 'The team account this payroll event belongs to';
comment on column public.account_payroll_events.name is 'The name of the payroll event';
comment on column public.account_payroll_events.external_id is 'External identifier for the payroll event';
comment on column public.account_payroll_events.description is 'Optional description of the payroll event';
comment on column public.account_payroll_events.color is 'Hex color code for the payroll event';
comment on column public.account_payroll_events.created_by is 'User who created the payroll event';
comment on column public.account_payroll_events.updated_by is 'User who last updated the payroll event';

-- Indexes
create index ix_account_payroll_events_account_id on public.account_payroll_events(account_id);
create index ix_account_payroll_events_created_at on public.account_payroll_events(created_at);
create index ix_account_payroll_events_external_id on public.account_payroll_events(external_id);

-- Enable RLS
alter table public.account_payroll_events enable row level security;

-- RLS Policies
-- SELECT: Team members can view payroll events
create policy "account_payroll_events_read" on public.account_payroll_events for select
  to authenticated using (
    public.has_role_on_account(account_id)
  );

-- INSERT: Team members with appropriate permissions can create payroll events
create policy "account_payroll_events_create" on public.account_payroll_events for insert
  to authenticated with check (
    public.has_role_on_account(account_id) and
    public.has_permission(
      auth.uid(),
      account_id,
      'payroll.manage'::public.app_permissions
    )
  );

-- UPDATE: Team members with appropriate permissions can update payroll events
create policy "account_payroll_events_update" on public.account_payroll_events for update
  to authenticated using (
    public.has_role_on_account(account_id) and
    public.has_permission(
      auth.uid(),
      account_id,
      'payroll.manage'::public.app_permissions
    )
  );

-- DELETE: Team members with appropriate permissions can delete payroll events
create policy "account_payroll_events_delete" on public.account_payroll_events for delete
  to authenticated using (
    public.has_role_on_account(account_id) and
    public.has_permission(
      auth.uid(),
      account_id,
      'payroll.manage'::public.app_permissions
    )
  );

-- Triggers
create trigger set_timestamps
  before update on public.account_payroll_events
  for each row
  execute function public.trigger_set_timestamps();

create trigger set_user_tracking
  before insert or update on public.account_payroll_events
  for each row
  execute function public.trigger_set_user_tracking();

-- Grant permissions
grant select, insert, update, delete on public.account_payroll_events to authenticated; 