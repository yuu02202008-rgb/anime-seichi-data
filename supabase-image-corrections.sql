-- 画像アップロード・訂正申請・承認後公開を追加する更新です。一度だけ実行してください。

alter table public.spot_submissions
  add column if not exists submission_type text not null default 'new_spot',
  add column if not exists target_place_id text,
  add column if not exists target_place_name text,
  add column if not exists image_path text,
  add column if not exists image_url text;

alter table public.spot_submissions
  drop constraint if exists spot_submissions_submission_type_check;

alter table public.spot_submissions
  add constraint spot_submissions_submission_type_check
  check (submission_type in ('new_spot', 'correction', 'image_addition'));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('submission-images', 'submission-images', false, 5242880, array['image/jpeg','image/png','image/webp']),
  ('spot-images', 'spot-images', true, 5242880, array['image/jpeg','image/png','image/webp'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "anyone can upload submission images" on storage.objects;
create policy "anyone can upload submission images"
on storage.objects for insert to anon, authenticated
with check (bucket_id = 'submission-images');

drop policy if exists "admins can read submission images" on storage.objects;
create policy "admins can read submission images"
on storage.objects for select to authenticated
using (bucket_id = 'submission-images' and public.is_admin());

drop policy if exists "admins can publish spot images" on storage.objects;
create policy "admins can publish spot images"
on storage.objects for insert to authenticated
with check (bucket_id = 'spot-images' and public.is_admin());

drop policy if exists "admins can update spot images" on storage.objects;
create policy "admins can update spot images"
on storage.objects for update to authenticated
using (bucket_id = 'spot-images' and public.is_admin())
with check (bucket_id = 'spot-images' and public.is_admin());

drop policy if exists "public can read spot images" on storage.objects;
create policy "public can read spot images"
on storage.objects for select to public
using (bucket_id = 'spot-images');

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
    and submission_type = 'new_spot'
  order by created_at desc;
$$;

revoke all on function public.get_approved_spots() from public;
grant execute on function public.get_approved_spots() to anon, authenticated;

drop function if exists public.get_approved_spot_updates();

create function public.get_approved_spot_updates()
returns table (
  id uuid,
  target_place_id text,
  correction_text text,
  image_url text,
  created_at timestamptz
)
language sql
security definer
set search_path = public
stable
as $$
  select id, target_place_id, scene as correction_text, image_url, created_at
  from public.spot_submissions
  where status = 'approved'
    and submission_type in ('correction', 'image_addition')
    and target_place_id is not null
  order by created_at asc;
$$;

revoke all on function public.get_approved_spot_updates() from public;
grant execute on function public.get_approved_spot_updates() to anon, authenticated;

