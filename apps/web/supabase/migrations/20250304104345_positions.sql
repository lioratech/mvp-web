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
  parent_id uuid references public.positions(id) on delete set null,
  department_id uuid references public.departments(id) on delete set null,
  is_leadership boolean default false,
  is_active boolean default true,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  created_by uuid not null references auth.users(id),
  updated_by uuid not null references auth.users(id),
  
  -- Constraints
  constraint positions_name_check check (length(name) > 0),
  constraint positions_color_check check (color ~ '^#[0-9A-F]{6}$'),
  constraint positions_external_id_unique unique (account_id, external_id)
);

-- Indexes
create index if not exists positions_account_id_idx on public.positions(account_id);
create index if not exists positions_external_id_idx on public.positions(account_id, external_id);
create index if not exists positions_name_idx on public.positions(account_id, name);
create index if not exists positions_parent_id_idx on public.positions(parent_id);
create index if not exists positions_department_id_idx on public.positions(department_id);
create index if not exists positions_is_leadership_idx on public.positions(account_id, is_leadership);

-- Comments
comment on table public.positions is 'Cargos/funções dentro de contas de equipe';
comment on column public.positions.account_id is 'A conta de equipe à qual este cargo pertence';
comment on column public.positions.name is 'Nome do cargo';
comment on column public.positions.external_id is 'ID externo para integração com sistemas externos';
comment on column public.positions.description is 'Descrição opcional do cargo';
comment on column public.positions.color is 'Código de cor hexadecimal para o cargo';
comment on column public.positions.parent_id is 'Cargo pai na hierarquia (ex: Head reporta ao Diretor)';
comment on column public.positions.department_id is 'Departamento ao qual o cargo pertence';
comment on column public.positions.is_leadership is 'Indica se o cargo é de liderança';
comment on column public.positions.is_active is 'Indica se o cargo está ativo';
comment on column public.positions.created_by is 'Usuário que criou o cargo';
comment on column public.positions.updated_by is 'Usuário que atualizou o cargo pela última vez';

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

-- Function to validate parent_id belongs to same account
create or replace function public.validate_position_parent()
returns trigger
language plpgsql
security definer
set search_path = '' as $$
begin
  -- Se parent_id não é nulo, validar se pertence à mesma conta
  if new.parent_id is not null then
    if not exists (
      select 1 from public.positions
      where id = new.parent_id
      and account_id = new.account_id
    ) then
      raise exception 'O cargo superior deve pertencer à mesma conta';
    end if;
    
    -- Validar que não é o próprio cargo (evitar auto-referência)
    if new.parent_id = new.id then
      raise exception 'Um cargo não pode ser superior a si mesmo';
    end if;
  end if;
  
  return new;
end;
$$;

-- Triggers
create trigger trigger_validate_position_parent
  before insert or update on public.positions
  for each row
  execute function public.validate_position_parent();


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
