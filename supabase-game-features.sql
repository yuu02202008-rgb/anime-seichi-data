-- ANIME SEICHI DATA: ゲーム参加・訪問記録・お気に入り用の追加設定
-- Supabase SQL Editor で一度だけ実行する。
-- 閲覧はログイン不要。投稿、スタンプ、訪問履歴、お気に入りだけログインした利用者に紐づける。

-- 既存の初期設定が未実行でも、管理者判定に必要な土台を作る。
create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;

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

-- すでにこのメールアドレスでログイン登録済みなら、管理者として登録する。
insert into public.admin_users (user_id, email)
select id, email from auth.users where email = 'yuu.0220.2008@icloud.com'
on conflict do nothing;

create table if not exists public.user_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text check (char_length(display_name) between 1 and 30),
  created_at timestamptz not null default now()
);

create table if not exists public.viewpoint_challenges (
  id uuid primary key default gen_random_uuid(),
  place_id text not null unique,
  title text not null,
  hint text not null,
  -- 正確な撮影地点を公開してよい場合だけ保存する。未公開地点はnullにする。
  latitude numeric,
  longitude numeric,
  checkin_radius_m integer not null default 80 check (checkin_radius_m between 30 and 500),
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.user_favorites (
  user_id uuid not null references auth.users(id) on delete cascade,
  place_id text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, place_id)
);

create table if not exists public.visit_stamps (
  user_id uuid not null references auth.users(id) on delete cascade,
  place_id text not null,
  challenge_id uuid references public.viewpoint_challenges(id) on delete set null,
  awarded_at timestamptz not null default now(),
  primary key (user_id, place_id)
);

alter table public.user_profiles enable row level security;
alter table public.viewpoint_challenges enable row level security;
alter table public.user_favorites enable row level security;
alter table public.visit_stamps enable row level security;

drop policy if exists "public can view published viewpoint challenges" on public.viewpoint_challenges;
create policy "public can view published viewpoint challenges"
on public.viewpoint_challenges for select to anon, authenticated
using (status = 'published');
drop policy if exists "admins manage viewpoint challenges" on public.viewpoint_challenges;
create policy "admins manage viewpoint challenges"
on public.viewpoint_challenges for all to authenticated
using (public.is_admin()) with check (public.is_admin());

drop policy if exists "users can view their own profile" on public.user_profiles;
create policy "users can view their own profile"
on public.user_profiles for select to authenticated using (auth.uid() = user_id);
drop policy if exists "users can create their own profile" on public.user_profiles;
create policy "users can create their own profile"
on public.user_profiles for insert to authenticated with check (auth.uid() = user_id);
drop policy if exists "users can update their own profile" on public.user_profiles;
create policy "users can update their own profile"
on public.user_profiles for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "users manage their favorites" on public.user_favorites;
create policy "users manage their favorites"
on public.user_favorites for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "users view their stamps" on public.visit_stamps;
create policy "users view their stamps"
on public.visit_stamps for select to authenticated using (auth.uid() = user_id);

-- 位置情報を受け取り、公開済み・安全確認済みのチャレンジだけでスタンプを付与する。
-- 正確な撮影地点が未公開のチャレンジには使えないため、住所保護にも対応できる。
create or replace function public.award_visit_stamp(
  requested_place_id text,
  current_latitude numeric,
  current_longitude numeric
)
returns table (place_id text, awarded boolean, message text)
language plpgsql
security definer
set search_path = public
as $$
declare
  challenge public.viewpoint_challenges%rowtype;
  distance_m numeric;
begin
  if auth.uid() is null then
    raise exception 'ログインが必要です';
  end if;
  select * into challenge from public.viewpoint_challenges
  where viewpoint_challenges.place_id = requested_place_id
    and status = 'published'
    and latitude is not null
    and longitude is not null;
  if not found then
    return query select requested_place_id, false, 'この地点はスタンプ対象外です';
    return;
  end if;
  distance_m := 6371000 * 2 * asin(sqrt(
    power(sin(radians(current_latitude - challenge.latitude) / 2), 2)
    + cos(radians(challenge.latitude)) * cos(radians(current_latitude))
    * power(sin(radians(current_longitude - challenge.longitude) / 2), 2)
  ));
  if distance_m > challenge.checkin_radius_m then
    return query select requested_place_id, false, 'スタンプ範囲の外です';
    return;
  end if;
  insert into public.visit_stamps (user_id, place_id, challenge_id)
  values (auth.uid(), requested_place_id, challenge.id)
  on conflict (user_id, place_id) do nothing;
  return query select requested_place_id, true, 'スタンプを獲得しました';
end;
$$;

revoke all on function public.award_visit_stamp(text, numeric, numeric) from public;
grant execute on function public.award_visit_stamp(text, numeric, numeric) to authenticated;
