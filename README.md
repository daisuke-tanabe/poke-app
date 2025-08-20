# poke-app

AIエージェントによる自動化・開発の限界や課題を探求し、知見を共有するためのリポジトリです。

## プロジェクト概要

- ポケモン図鑑データベースをNext.js（TypeScript）+ Prisma + PostgreSQLで構築
- DB設計・データアクセス・API・画面実装・初期データ投入など、すべてAIエージェントによる自動生成・自動化を目指します
- AIエージェントの実践・検証・学習のための教材・実験場として活用

## セットアップ手順

1. 必要なパッケージのインストール
   ```sh
   npm install
   ```
2. Prismaマイグレーション＆シード投入
   ```sh
   npx prisma generate
   npx prisma migrate deploy
   npx tsx prisma/seed.ts
   ```
3. 開発サーバー起動（Supabaseローカル環境も自動で起動します）
   ```sh
   npm run dev
   ```
4. ブラウザで http://localhost:3000/ を開き、全国図鑑のポケモン一覧が表示されることを確認

## 注意事項

- `.env` にはDB接続情報が含まれるため、コミットしないでください
- すべてのコード・設計・データ投入はAIエージェントによる自動生成・自動化を前提としています
- DBはSupabase CLIで起動・管理しています。Docker Composeは不要です。

## Supabase MCP接続

AIエージェント（Claude Code）からSupabaseプロジェクトに直接アクセスするためのMCP（Model Context Protocol）設定です。

### アクセストークンの発行

1. [Supabase Dashboard](https://supabase.com/dashboard/account/tokens) でPersonal Access Tokenを発行
2. 適切な権限（読み取り専用推奨）を設定

### MCP設定方法

プロジェクトスコープでの設定（推奨）:

1. プロジェクトルートに `.mcp.json` ファイルを作成
2. 以下の設定を追加:

```json
{
  "servers": {
    "supabase": {
      "command": "npx",
      "args": ["-y", "@supabase/mcp-server-supabase@latest"],
      "env": {
        "SUPABASE_ACCESS_TOKEN": "your_personal_access_token_here",
        "SUPABASE_PROJECT_REF": "your_project_id"
      }
    }
  }
}
```

または、Claude Code CLIコマンドで設定:

```sh
claude mcp add supabase -s local -e SUPABASE_ACCESS_TOKEN=your_token_here -- npx -y @supabase/mcp-server-supabase@latest
```

詳細な設定方法は [Supabase MCP Documentation](https://supabase.com/docs/guides/getting-started/mcp) を参照してください。

