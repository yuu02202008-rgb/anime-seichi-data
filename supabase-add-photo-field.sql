-- 写真URLを保存・公開できるようにする更新です。一度だけ実行してください。

alter table public.spot_submissions
  add column if not exists image_url text;

drop function if exists public.get_approved_spots();

create function public.get_approved_spots()
returns table (
  id uuid,
  work text,
  spot text,
  prefecture text,
  city text,
  coordinates text,
  visit_status text,
  visit_conditions text,
  image_url text,
  scene text,
  source_url text,
  created_at timestamptz
)
language sql
security definer
set search_path = public
stable
as $$
  select id, work, spot, prefecture, city, coordinates, visit_status, visit_conditions, image_url, scene, source_url, created_at
  from public.spot_submissions
  where status = 'approved'
  order by created_at desc;
$$;

revoke all on function public.get_approved_spots() from public;
grant execute on function public.get_approved_spots() to anon, authenticated;
