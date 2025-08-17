/*
 * -------------------------------------------------------
 * Migration: Departments
 * We create the schema for departments within team accounts
 * -------------------------------------------------------
 */

-- Create departments table
create table if not exists public.departments (
  id uuid primary key default gen_random_uuid(),
  account_id uuid references public.accounts(id) on delete cascade not null,
  name varchar(100) not null,
  description text,
  external_id varchar(100),
  color varchar(7) check (color ~* '^#[0-9A-F]{6}$'),
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null
);

comment on table public.departments is 'Departments within team accounts';
comment on column public.departments.account_id is 'The team account this department belongs to';
comment on column public.departments.name is 'The name of the department';
comment on column public.departments.description is 'Optional description of the department';
comment on column public.departments.color is 'Hex color code for the department';
comment on column public.departments.created_by is 'User who created the department';
comment on column public.departments.updated_by is 'User who last updated the department';

-- Indexes
create index ix_departments_account_id on public.departments(account_id);
create index ix_departments_created_at on public.departments(created_at);

-- Enable RLS
alter table public.departments enable row level security;

-- RLS Policies
-- SELECT: Team members can view departments
create policy departments_read on public.departments for select
  to authenticated using (
    public.has_role_on_account(account_id)
  );

-- INSERT: Team members with appropriate permissions can create departments
create policy departments_create on public.departments for insert
  to authenticated with check (
    public.has_role_on_account(account_id) and
    public.has_permission(
      auth.uid(),
      account_id,
      'departments.manage'::public.app_permissions
    )
  );

-- UPDATE: Team members with appropriate permissions can update departments
create policy departments_update on public.departments for update
  to authenticated using (
    public.has_role_on_account(account_id) and
    public.has_permission(
      auth.uid(),
      account_id,
      'departments.manage'::public.app_permissions
    )
  );

-- DELETE: Team members with appropriate permissions can delete departments
create policy departments_delete on public.departments for delete
  to authenticated using (
    public.has_role_on_account(account_id) and
    public.has_permission(
      auth.uid(),
      account_id,
      'departments.manage'::public.app_permissions
    )
  );

-- Triggers
create trigger set_timestamps
  before update on public.departments
  for each row
  execute function public.trigger_set_timestamps();

create trigger set_user_tracking
  before insert or update on public.departments
  for each row
  execute function public.trigger_set_user_tracking();

-- Grant permissions
grant select, insert, update, delete on public.departments to authenticated; 