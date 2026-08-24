-- Supabase SQL Editorで一度実行してください。
-- 承認済みの申請だけを、連絡先を除いて公開サイトへ渡す関数です。

create or replace function public.get_approved_spots()
returns table (
  id uuid,
  work text,
  spot text,
  prefecture text,
  city text,
  scene text,
  source_url text,
  created_at timestamptz
)
language sql
security definer
set search_path = public
stable
as $$
  select id, work, spot, prefecture, city, scene, source_url, created_at
  from public.spot_submissions
  where status = 'approved'
  order by created_at desc;
$$;

revoke all on function public.get_approved_spots() from public;
grant execute on function public.get_approved_spots() to anon, authenticated;
