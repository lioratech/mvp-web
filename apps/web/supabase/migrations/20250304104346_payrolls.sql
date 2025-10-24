/*
 * -------------------------------------------------------
 * Section: Payrolls (Folhas de Pagamento)
 * Tabela para gerenciar as folhas de pagamento da empresa
 * -------------------------------------------------------
 */

-- Payrolls Table
create table if not exists public.payrolls (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references public.accounts(id) on delete cascade,
  month integer not null,
  year integer not null,
  cnpj varchar(18) not null,
  filial varchar(100) not null,
  is_current boolean default true,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  created_by uuid not null references auth.users(id),
  updated_by uuid not null references auth.users(id),
  
  -- Constraints
  constraint payrolls_month_check check (month >= 1 and month <= 12),
  constraint payrolls_year_check check (year >= 2000 and year <= 2100),
  constraint payrolls_cnpj_check check (length(cnpj) >= 14),
  constraint payrolls_filial_check check (length(filial) > 0),
  constraint payrolls_unique unique (account_id, month, year)
);

-- Indexes
create index if not exists payrolls_account_id_idx on public.payrolls(account_id);
create index if not exists payrolls_month_year_idx on public.payrolls(account_id, month, year);
create index if not exists payrolls_cnpj_idx on public.payrolls(account_id, cnpj);
create index if not exists payrolls_filial_idx on public.payrolls(account_id, filial);
create index if not exists payrolls_is_current_idx on public.payrolls(account_id, is_current);

-- Comments
comment on table public.payrolls is 'Folhas de pagamento dentro de contas de equipe';
comment on column public.payrolls.account_id is 'A conta de equipe à qual esta folha pertence';
comment on column public.payrolls.month is 'Mês de referência da folha (1-12)';
comment on column public.payrolls.year is 'Ano de referência da folha';
comment on column public.payrolls.cnpj is 'CNPJ da empresa';
comment on column public.payrolls.filial is 'Filial/unidade da empresa';
comment on column public.payrolls.is_current is 'Indica se a folha é a atual/mais recente da conta';
comment on column public.payrolls.created_by is 'Usuário que criou a folha';
comment on column public.payrolls.updated_by is 'Usuário que atualizou a folha pela última vez';

-- RLS
alter table public.payrolls enable row level security;

-- RLS Policies
create policy "payrolls_select" on public.payrolls
  for select
  to authenticated
  using (
    account_id = (select auth.uid()) or
    public.has_role_on_account(account_id)
  );

create policy "payrolls_insert" on public.payrolls
  for insert
  to authenticated
  with check (
    public.has_permission(auth.uid(), account_id, 'payrolls.manage'::public.app_permissions) or
    public.is_account_owner(account_id)
  );

create policy "payrolls_update" on public.payrolls
  for update
  to authenticated
  using (
    public.has_permission(auth.uid(), account_id, 'payrolls.manage'::public.app_permissions) or
    public.is_account_owner(account_id)
  )
  with check (
    public.has_permission(auth.uid(), account_id, 'payrolls.manage'::public.app_permissions) or
    public.is_account_owner(account_id)
  );

create policy "payrolls_delete" on public.payrolls
  for delete
  to authenticated
  using (
    public.has_permission(auth.uid(), account_id, 'payrolls.manage'::public.app_permissions) or
    public.is_account_owner(account_id)
  );

-- Function to ensure only one current payroll per account
create or replace function public.ensure_single_current_payroll()
returns trigger
language plpgsql
security definer
set search_path = '' as $$
begin
  -- Se a nova folha está sendo marcada como current
  if new.is_current = true then
    -- Desmarcar todas as outras folhas da mesma conta
    update public.payrolls
    set is_current = false
    where account_id = new.account_id
      and id != new.id
      and is_current = true;
  end if;
  
  return new;
end;
$$;

-- Function to set most recent payroll as current after deletion
create or replace function public.set_most_recent_payroll_as_current()
returns trigger
language plpgsql
security definer
set search_path = '' as $$
begin
  -- Se a folha excluída era a atual
  if old.is_current = true then
    -- Marcar a folha mais recente (por ano/mês) como atual
    update public.payrolls
    set is_current = true
    where id = (
      select id
      from public.payrolls
      where account_id = old.account_id
      order by year desc, month desc, created_at desc
      limit 1
    );
  end if;
  
  return old;
end;
$$;

-- Triggers
create trigger trigger_ensure_single_current_payroll
  before insert or update on public.payrolls
  for each row
  execute function public.ensure_single_current_payroll();

create trigger trigger_set_most_recent_after_delete
  after delete on public.payrolls
  for each row
  execute function public.set_most_recent_payroll_as_current();

create trigger trigger_set_timestamps
  before update on public.payrolls
  for each row
  execute function public.trigger_set_timestamps();

create trigger trigger_set_user_tracking
  before insert or update on public.payrolls
  for each row
  execute function public.trigger_set_user_tracking();

-- Grant permissions
grant select, insert, update, delete on public.payrolls to authenticated;

