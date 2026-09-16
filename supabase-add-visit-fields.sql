-- 既に作成済みのSupabaseプロジェクトで、一度だけ実行してください。

alter table public.spot_submissions
  add column if not exists coordinates text,
  add column if not exists visit_status text,
  add column if not exists visit_conditions text;

alter table public.spot_submissions
  drop constraint if exists spot_submissions_visit_status_check;

alter table public.spot_submissions
  add constraint spot_submissions_visit_status_check
  check (visit_status is null or visit_status in ('自由訪問可能', '条件付き', '外観のみ'));

drop function if exists public.get_approved_spots();

create or replace function public.get_approved_spots()
returns table (
  id uuid,
  work text,
  spot text,
  prefecture text,
  city text,
  coordinates text,
  visit_status text,
  visit_conditions text,
  scene text,
  source_url text,
  created_at timestamptz
)
language sql
security definer
set search_path = public
stable
as $$
  select id, work, spot, prefecture, city, coordinates, visit_status, visit_conditions, scene, source_url, created_at
  from public.spot_submissions
  where status = 'approved'
  order by created_at desc;
$$;

revoke all on function public.get_approved_spots() from public;
grant execute on function public.get_approved_spots() to anon, authenticated;
