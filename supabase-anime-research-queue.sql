create table if not exists public.anime_research_queue (
  id uuid primary key default gen_random_uuid(),
  anilist_id integer not null unique,
  title text not null,
  title_romaji text,
  title_english text,
  start_date text,
  season text,
  genres text[] default '{}',
  cover_image text,
  official_url text,
  description text,
  status text not null default 'researching' check (status in ('researching', 'reviewed', 'published', 'skipped')),
  admin_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.anime_research_queue enable row level security;

drop policy if exists "Admins manage anime research queue" on public.anime_research_queue;
create policy "Admins manage anime research queue"
  on public.anime_research_queue
  for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());
