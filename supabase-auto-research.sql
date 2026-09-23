-- 自動聖地調査を有効にするため、SupabaseのSQL Editorで一度だけ実行してください。
-- 自動調査の結果は「確認待ち」の下書きとして保存され、承認するまで公開されません。

alter table public.anime_research_queue
  add column if not exists research_status text not null default 'queued'
    check (research_status in ('queued', 'processing', 'drafted', 'no_match', 'failed')),
  add column if not exists researched_at timestamptz,
  add column if not exists research_error text,
  add column if not exists drafted_spot_count integer not null default 0;

update public.anime_research_queue
set research_status = 'queued'
where research_status is null;
