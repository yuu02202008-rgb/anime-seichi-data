# 自動聖地調査の設定

この仕組みは、調査キューに追加されたアニメを1時間ごとに最大3作品ずつ調べます。結果は公開せず、管理者ページの「聖地承認」→「確認待ち」に下書きとして入ります。

## 1. Supabaseの設定

SupabaseのSQL Editorで `supabase-auto-research.sql` の内容を一度だけ実行します。

## 2. GitHubの秘密情報

GitHubのリポジトリで、`設定` → `Secrets and variables` → `Actions` → `New repository secret` を開き、次の3つを登録します。

| 名前 | 入れるもの |
| --- | --- |
| `SUPABASE_URL` | Supabase Project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Settings → API にある service_role key |
| `OPENAI_API_KEY` | OpenAI Platformで作成したAPI key |

秘密情報はソースコード、管理者ページ、公開サイトには絶対に書かないでください。

## 3. 実行

GitHubの `Actions` で `Create sacred-place review drafts` を開き、`Run workflow` を押すとすぐに実行できます。以後は1時間ごとに新しいキューを確認します。

## 安全設計

- 自動処理は `spot_submissions` の `pending` 下書きだけを作成します。
- 一般公開されるのは、管理者が承認ボタンを押した後だけです。
- 根拠URLが取れない候補は下書きに入れません。
- 自動生成された候補は必ず根拠と場所を確認してから承認します。
