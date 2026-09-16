-- Supabase SQL Editorで、このファイルの内容を一度だけ実行してください。

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.spot_submissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  status text not null default 'pending' check (status in ('pending', 'approved', 'returned')),
  work text not null,
  spot text not null,
  prefecture text not null,
  city text,
  coordinates text,
  visit_status text check (visit_status in ('自由訪問可能', '条件付き', '外観のみ')),
  visit_conditions text,
  scene text not null,
  source_url text not null,
  contact_email text,
  admin_note text,
  reviewed_at timestamptz,
  reviewed_by uuid references auth.users(id)
);

alter table public.admin_users enable row level security;
alter table public.spot_submissions enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.admin_users where user_id = auth.uid()
  );
$$;

grant execute on function public.is_admin() to authenticated;

drop policy if exists "anyone can submit a spot" on public.spot_submissions;
create policy "anyone can submit a spot"
on public.spot_submissions for insert to anon, authenticated
with check (true);

drop policy if exists "admins can read submissions" on public.spot_submissions;
create policy "admins can read submissions"
on public.spot_submissions for select to authenticated
using (public.is_admin());

drop policy if exists "admins can update submissions" on public.spot_submissions;
create policy "admins can update submissions"
on public.spot_submissions for update to authenticated
using (public.is_admin())
with check (public.is_admin());

create or replace function public.assign_known_admin()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.email = 'yuu.0220.2008@icloud.com' then
    insert into public.admin_users (user_id, email)
    values (new.id, new.email)
    on conflict (user_id) do nothing;
  end if;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created_assign_admin on auth.users;
create trigger on_auth_user_created_assign_admin
after insert on auth.users
for each row execute procedure public.assign_known_admin();
