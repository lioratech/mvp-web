/*
 * -------------------------------------------------------
 * Section: Positions (Cargos)
 * Tabela para gerenciar os cargos/funções da empresa
 * -------------------------------------------------------
 */

-- Positions Table
create table if not exists public.positions (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references public.accounts(id) on delete cascade,
  name varchar(255) not null,
  external_id varchar(100),
  description text,
  color varchar(7) default '#3B82F6',
  hierarchy_level int default 0,
  is_active boolean default true,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  created_by uuid not null references auth.users(id),
  updated_by uuid not null references auth.users(id),
  
  -- Constraints
  constraint positions_name_check check (length(name) > 0),
  constraint positions_color_check check (color ~ '^#[0-9A-F]{6}$'),
  constraint positions_hierarchy_check check (hierarchy_level >= 0),
  constraint positions_external_id_unique unique (account_id, external_id)
);

-- Indexes
create index if not exists positions_account_id_idx on public.positions(account_id);
create index if not exists positions_external_id_idx on public.positions(account_id, external_id);
create index if not exists positions_name_idx on public.positions(account_id, name);

-- RLS
alter table public.positions enable row level security;

-- RLS Policies
create policy "positions_select" on public.positions
  for select
  to authenticated
  using (
    account_id = (select auth.uid()) or
    public.has_role_on_account(account_id)
  );

create policy "positions_insert" on public.positions
  for insert
  to authenticated
  with check (
    public.has_permission(auth.uid(), account_id, 'positions.manage'::public.app_permissions) or
    public.is_account_owner(account_id)
  );

create policy "positions_update" on public.positions
  for update
  to authenticated
  using (
    public.has_permission(auth.uid(), account_id, 'positions.manage'::public.app_permissions) or
    public.is_account_owner(account_id)
  )
  with check (
    public.has_permission(auth.uid(), account_id, 'positions.manage'::public.app_permissions) or
    public.is_account_owner(account_id)
  );

create policy "positions_delete" on public.positions
  for delete
  to authenticated
  using (
    public.has_permission(auth.uid(), account_id, 'positions.manage'::public.app_permissions) or
    public.is_account_owner(account_id)
  );

-- Triggers
create trigger trigger_set_timestamps
  before update on public.positions
  for each row
  execute function public.trigger_set_timestamps();

create trigger trigger_set_user_tracking
  before insert or update on public.positions
  for each row
  execute function public.trigger_set_user_tracking();

-- Grant permissions
grant select, insert, update, delete on public.positions to authenticated;
