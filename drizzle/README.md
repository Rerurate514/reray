# データベースマイグレーション

このディレクトリの `*.sql` は、Cloudflare D1 に適用するマイグレーションです。

## 適用方法

適用は wrangler が行います（`wrangler.jsonc` の `d1_databases[].migrations_dir` が `drizzle` を指しています）。

- ローカル環境: `pnpm db:migrate:local`
- リモート環境: `pnpm db:migrate:remote`

wrangler はファイル名の昇順で未適用のものだけを実行し、適用済みのマイグレーションは `d1_migrations` テーブルで管理します。

## 追加方法（手書き）

1. `drizzle/` に連番で `NNNN_name.sql` を作成します（例: `0005_add_example.sql`）。
2. 複数の文を書く場合は `--> statement-breakpoint` で区切ります。
3. `pnpm db:migrate:local` でローカル D1 に適用して確認します。

## drizzle-kit について

- `meta/_journal.json` と `meta/*_snapshot.json` は drizzle-kit の管理ファイルです。wrangler は参照しません。
- このリポジトリではマイグレーションを手書きで運用しています。`drizzle-kit generate` は基準となる snapshot が古く、既存の連番と衝突する `NNNN_*.sql` を生成してしまうため、実行しないでください。
