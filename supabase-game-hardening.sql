-- ゲーム参加ルール・非公開チェックイン座標を適用する更新。
-- 実行順：supabase-game-features.sql → このファイル。
-- 投稿テーブルや画像バケットが未作成の場合も、このファイル内で用意する。
-- 公開済みSupabase環境向けです。座標の公開列が既に削除済みでも再実行できます。
-- 英訳・安全確認情報が不足する既存チャレンジは下書きに戻す。

-- 投稿・画像の基本テーブルがまだない本番環境も、この更新で補う。
create table if not exists public.spot_submissions (
  id uuid primary key default gen_random_uuid(),
  submitted_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  status text not null default 'pending' check (status in ('pending', 'approved', 'returned')),
  submission_type text not null default 'new_spot' check (submission_type in ('new_spot', 'correction', 'image_addition')),
  target_place_id text,
  target_place_name text,
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
  image_path text,
  image_url text,
  admin_note text,
  reviewed_at timestamptz,
  reviewed_by uuid references auth.users(id)
);
alter table public.spot_submissions enable row level security;

-- 投稿者を特定し、投稿を認証済み利用者本人に限定する。
alter table public.spot_submissions
  add column if not exists submitted_by uuid references auth.users(id) on delete set null;
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

create or replace function public.is_confirmed_participant()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from auth.users
    where id = auth.uid() and email_confirmed_at is not null
  );
$$;
revoke all on function public.is_confirmed_participant() from public;
grant execute on function public.is_confirmed_participant() to authenticated;

drop policy if exists "anyone can submit a spot" on public.spot_submissions;
drop policy if exists "authenticated participants submit own spots" on public.spot_submissions;
create policy "authenticated participants submit own spots"
on public.spot_submissions for insert to authenticated
with check (
  auth.uid() = submitted_by
  and public.is_confirmed_participant()
  and status = 'pending'
  and admin_note is null
  and reviewed_at is null
  and reviewed_by is null
  and image_url is null
);
drop policy if exists "admins can read submissions" on public.spot_submissions;
create policy "admins can read submissions"
on public.spot_submissions for select to authenticated
using (public.is_admin());
drop policy if exists "admins can update submissions" on public.spot_submissions;
create policy "admins can update submissions"
on public.spot_submissions for update to authenticated
using (public.is_admin()) with check (public.is_admin());

-- 申請画像は非公開、承認済み画像だけ公開バケットへ移す。
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('submission-images', 'submission-images', false, 5242880, array['image/jpeg','image/png','image/webp']),
  ('spot-images', 'spot-images', true, 5242880, array['image/jpeg','image/png','image/webp'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;
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

-- 投稿写真は非公開バケットにアカウント別のパスで保存する。
drop policy if exists "anyone can upload submission images" on storage.objects;
drop policy if exists "authenticated participants upload own submission images" on storage.objects;
create policy "authenticated participants upload own submission images"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'submission-images'
  and split_part(name, '/', 1) = auth.uid()::text
  and public.is_confirmed_participant()
);

drop function if exists public.get_approved_spots();
create function public.get_approved_spots()
returns table (
  id uuid, work text, spot text, prefecture text, city text,
  coordinates text, visit_status text, visit_conditions text,
  image_url text, scene text, source_url text, created_at timestamptz
)
language sql security definer set search_path = public stable
as $$
  select id, work, spot, prefecture, city, coordinates, visit_status,
    visit_conditions, image_url, scene, source_url, created_at
  from public.spot_submissions
  where status = 'approved' and submission_type = 'new_spot'
  order by created_at desc;
$$;
revoke all on function public.get_approved_spots() from public;
grant execute on function public.get_approved_spots() to anon, authenticated;

drop function if exists public.get_approved_spot_updates();
create function public.get_approved_spot_updates()
returns table (
  id uuid, target_place_id text, correction_text text,
  image_url text, created_at timestamptz
)
language sql security definer set search_path = public stable
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

-- 自分で記録した訪問と、GPSで獲得したスタンプの訪問履歴を分ける。
create table if not exists public.user_visits (
  user_id uuid not null references auth.users(id) on delete cascade,
  place_id text not null,
  visit_type text not null check (visit_type in ('self_reported', 'gps_checkin')),
  visited_at timestamptz not null default now(),
  primary key (user_id, place_id, visit_type)
);
alter table public.user_visits enable row level security;
drop policy if exists "users view own visits" on public.user_visits;
create policy "users view own visits"
on public.user_visits for select to authenticated
using (auth.uid() = user_id and public.is_confirmed_participant());
drop policy if exists "users create own self reported visits" on public.user_visits;
create policy "users create own self reported visits"
on public.user_visits for insert to authenticated
with check (auth.uid() = user_id and visit_type = 'self_reported' and public.is_confirmed_participant());
drop policy if exists "users delete own self reported visits" on public.user_visits;
create policy "users delete own self reported visits"
on public.user_visits for delete to authenticated
using (auth.uid() = user_id and visit_type = 'self_reported' and public.is_confirmed_participant());

-- 参加に関わる表もメール確認済み利用者だけが読める・変更できる。
drop policy if exists "users manage their favorites" on public.user_favorites;
create policy "confirmed users manage their favorites"
on public.user_favorites for all to authenticated
using (auth.uid() = user_id and public.is_confirmed_participant())
with check (auth.uid() = user_id and public.is_confirmed_participant());
drop policy if exists "users view their stamps" on public.visit_stamps;
create policy "confirmed users view their stamps"
on public.visit_stamps for select to authenticated
using (auth.uid() = user_id and public.is_confirmed_participant());

-- 公開チャレンジは日英の案内を持ち、GPS座標は管理者専用テーブルへ隔離する。
alter table public.viewpoint_challenges
  add column if not exists title_en text not null default '',
  add column if not exists hint_en text not null default '',
  add column if not exists access_notes text not null default '',
  add column if not exists access_notes_en text not null default '',
  add column if not exists evidence_url text not null default '';

create table if not exists public.viewpoint_challenge_checkins (
  place_id text primary key references public.viewpoint_challenges(place_id) on delete cascade,
  latitude numeric not null check (latitude between -90 and 90),
  longitude numeric not null check (longitude between -180 and 180),
  checkin_radius_m integer not null check (checkin_radius_m between 30 and 200),
  updated_at timestamptz not null default now()
);
alter table public.viewpoint_challenge_checkins enable row level security;
drop policy if exists "admins manage private challenge checkins" on public.viewpoint_challenge_checkins;
create policy "admins manage private challenge checkins"
on public.viewpoint_challenge_checkins for all to authenticated
using (public.is_admin()) with check (public.is_admin());

-- 既存の座標・半径が有効なチャレンジだけを退避する。古い広すぎる範囲や
-- 不正な座標は自動公開せず、管理者が安全な場所を設定し直す。
-- 公開列が残っている場合だけ移行し、既にこの更新を実行済みなら何もしない。
do $$
begin
  if exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'viewpoint_challenges' and column_name = 'latitude')
    and exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'viewpoint_challenges' and column_name = 'longitude')
    and exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'viewpoint_challenges' and column_name = 'checkin_radius_m') then
    insert into public.viewpoint_challenge_checkins (place_id, latitude, longitude, checkin_radius_m)
    select place_id, latitude, longitude, checkin_radius_m
    from public.viewpoint_challenges
    where latitude between -90 and 90 and longitude between -180 and 180
      and checkin_radius_m between 30 and 200
    on conflict (place_id) do update set
      latitude = excluded.latitude, longitude = excluded.longitude,
      checkin_radius_m = excluded.checkin_radius_m, updated_at = now();
  end if;
end;
$$;

update public.viewpoint_challenges
set status = 'draft'
where status = 'published'
  and (btrim(title_en) = '' or btrim(hint_en) = '' or btrim(access_notes) = ''
    or btrim(access_notes_en) = '' or btrim(evidence_url) = ''
    or not exists (select 1 from public.viewpoint_challenge_checkins p where p.place_id = viewpoint_challenges.place_id));

alter table public.viewpoint_challenges
  drop column if exists latitude,
  drop column if exists longitude,
  drop column if exists checkin_radius_m;

drop policy if exists "public can view published viewpoint challenges" on public.viewpoint_challenges;
create policy "public can view published viewpoint challenges"
on public.viewpoint_challenges for select to anon, authenticated
using (status = 'published');

-- 管理者だけが非公開座標を読む。
drop function if exists public.admin_list_viewpoint_challenges();
create function public.admin_list_viewpoint_challenges()
returns table (
  id uuid, place_id text, title text, title_en text, hint text, hint_en text,
  access_notes text, access_notes_en text, evidence_url text, latitude numeric,
  longitude numeric, checkin_radius_m integer, status text, created_at timestamptz
)
language plpgsql security definer set search_path = public stable
as $$
begin
  if not public.is_admin() then raise exception '管理者権限が必要です'; end if;
  return query
  select c.id, c.place_id, c.title, c.title_en, c.hint, c.hint_en,
    c.access_notes, c.access_notes_en, c.evidence_url, p.latitude, p.longitude,
    p.checkin_radius_m, c.status, c.created_at
  from public.viewpoint_challenges c
  left join public.viewpoint_challenge_checkins p on p.place_id = c.place_id
  order by c.created_at desc;
end;
$$;
revoke all on function public.admin_list_viewpoint_challenges() from public;
grant execute on function public.admin_list_viewpoint_challenges() to authenticated;

create or replace function public.admin_save_viewpoint_challenge(
  p_place_id text, p_title text, p_title_en text, p_hint text, p_hint_en text,
  p_access_notes text, p_access_notes_en text, p_evidence_url text,
  p_latitude numeric, p_longitude numeric, p_checkin_radius_m integer, p_status text
)
returns void
language plpgsql security definer set search_path = public
as $$
begin
  if not public.is_admin() then raise exception '管理者権限が必要です'; end if;
  if p_status is null or p_status not in ('draft', 'published') then raise exception '公開状態が不正です'; end if;
  if p_title is null or btrim(p_title) = '' or p_title_en is null or btrim(p_title_en) = ''
    or p_hint is null or btrim(p_hint) = '' or p_hint_en is null or btrim(p_hint_en) = ''
    or p_access_notes is null or btrim(p_access_notes) = '' or p_access_notes_en is null or btrim(p_access_notes_en) = ''
    or p_evidence_url is null or p_evidence_url !~ '^https://[^[:space:]]+$'
    or p_latitude is null or p_latitude not between -90 and 90
    or p_longitude is null or p_longitude not between -180 and 180
    or p_checkin_radius_m is null or p_checkin_radius_m not between 30 and 200 then
    raise exception '日英の説明、安全確認URL、位置と半径を確認してください';
  end if;
  insert into public.viewpoint_challenges (place_id, title, title_en, hint, hint_en, access_notes, access_notes_en, evidence_url, status)
  values (p_place_id, btrim(p_title), btrim(p_title_en), btrim(p_hint), btrim(p_hint_en),
    btrim(p_access_notes), btrim(p_access_notes_en), btrim(p_evidence_url), p_status)
  on conflict (place_id) do update set
    title = excluded.title, title_en = excluded.title_en, hint = excluded.hint, hint_en = excluded.hint_en,
    access_notes = excluded.access_notes, access_notes_en = excluded.access_notes_en,
    evidence_url = excluded.evidence_url, status = excluded.status, updated_at = now();
  insert into public.viewpoint_challenge_checkins (place_id, latitude, longitude, checkin_radius_m)
  values (p_place_id, p_latitude, p_longitude, p_checkin_radius_m)
  on conflict (place_id) do update set
    latitude = excluded.latitude, longitude = excluded.longitude,
    checkin_radius_m = excluded.checkin_radius_m, updated_at = now();
end;
$$;
revoke all on function public.admin_save_viewpoint_challenge(text, text, text, text, text, text, text, text, numeric, numeric, integer, text) from public;
grant execute on function public.admin_save_viewpoint_challenge(text, text, text, text, text, text, text, text, numeric, numeric, integer, text) to authenticated;

create or replace function public.admin_set_viewpoint_challenge_status(p_challenge_id uuid, p_status text)
returns void
language plpgsql security definer set search_path = public
as $$
declare
  challenge_row public.viewpoint_challenges%rowtype;
begin
  if not public.is_admin() then raise exception '管理者権限が必要です'; end if;
  if p_status is null or p_status not in ('draft', 'published', 'archived') then raise exception '公開状態が不正です'; end if;
  select * into challenge_row from public.viewpoint_challenges where id = p_challenge_id;
  if not found then raise exception 'チャレンジが見つかりません'; end if;
  if p_status = 'published' and (
    btrim(challenge_row.title_en) = '' or btrim(challenge_row.hint_en) = ''
    or btrim(challenge_row.access_notes) = '' or btrim(challenge_row.access_notes_en) = ''
    or btrim(challenge_row.evidence_url) = ''
    or not exists (select 1 from public.viewpoint_challenge_checkins where place_id = challenge_row.place_id)
  ) then raise exception '安全情報と日英の説明がそろっていないため公開できません'; end if;
  update public.viewpoint_challenges set status = p_status, updated_at = now() where id = p_challenge_id;
end;
$$;
revoke all on function public.admin_set_viewpoint_challenge_status(uuid, text) from public;
grant execute on function public.admin_set_viewpoint_challenge_status(uuid, text) to authenticated;

-- 生の緯度経度はこのRPC内だけで使い、履歴やスタンプへ保存しない。
drop function if exists public.award_visit_stamp(text, numeric, numeric);
drop function if exists public.award_visit_stamp(text, numeric, numeric, numeric);
create function public.award_visit_stamp(
  requested_place_id text, current_latitude numeric,
  current_longitude numeric, reported_accuracy_m numeric
)
returns table (place_id text, awarded boolean, message text)
language plpgsql security definer set search_path = public
as $$
declare
  challenge_id uuid;
  target_latitude numeric;
  target_longitude numeric;
  target_radius integer;
  distance_m numeric;
  inserted_count integer;
begin
  if auth.uid() is null then raise exception 'ログインが必要です'; end if;
  if not public.is_confirmed_participant() then
    raise exception 'メール確認後に参加できます';
  end if;
  if current_latitude is null or current_latitude not between -90 and 90
    or current_longitude is null or current_longitude not between -180 and 180
    or reported_accuracy_m is null or reported_accuracy_m < 0 or reported_accuracy_m > 100 then
    return query select requested_place_id, false, '現在地の精度が不足しています'; return;
  end if;
  select c.id, p.latitude, p.longitude, p.checkin_radius_m
  into challenge_id, target_latitude, target_longitude, target_radius
  from public.viewpoint_challenges c
  join public.viewpoint_challenge_checkins p on p.place_id = c.place_id
  where c.place_id = requested_place_id and c.status = 'published';
  if not found then
    return query select requested_place_id, false, 'この地点はスタンプ対象外です'; return;
  end if;
  distance_m := 6371000 * 2 * asin(sqrt(least(1, greatest(0,
    power(sin(radians(current_latitude - target_latitude) / 2), 2)
    + cos(radians(target_latitude)) * cos(radians(current_latitude))
    * power(sin(radians(current_longitude - target_longitude) / 2), 2)
  ))));
  if distance_m + reported_accuracy_m > target_radius then
    return query select requested_place_id, false, 'スタンプ範囲の外です'; return;
  end if;
  insert into public.visit_stamps (user_id, place_id, challenge_id)
  values (auth.uid(), requested_place_id, challenge_id)
  on conflict (user_id, place_id) do nothing;
  get diagnostics inserted_count = row_count;
  if inserted_count = 0 then
    return query select requested_place_id, false, 'このスタンプは獲得済みです'; return;
  end if;
  insert into public.user_visits (user_id, place_id, visit_type)
  values (auth.uid(), requested_place_id, 'gps_checkin')
  on conflict (user_id, place_id, visit_type) do nothing;
  return query select requested_place_id, true, 'スタンプを獲得しました';
end;
$$;
revoke all on function public.award_visit_stamp(text, numeric, numeric, numeric) from public;
grant execute on function public.award_visit_stamp(text, numeric, numeric, numeric) to authenticated;
