# poke-app

AIエージェントによる自動化・開発の限界や課題を探求し、知見を共有するためのリポジトリです。

## プロジェクト概要

- ポケモン図鑑データベースをNext.js（TypeScript）+ Prisma + PostgreSQLで構築
- DB設計・データアクセス・API・画面実装・初期データ投入など、すべてAIエージェントによる自動生成・自動化を目指します
- AIエージェントの実践・検証・学習のための教材・実験場として活用

## 技術スタック

- Next.js 15 (TypeScript 5)
- Node.js 22
- Prisma 6
- PostgreSQL 17（Supabase CLIによるローカル環境）
- Tailwind CSS

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

## コミットメッセージのフォーマット

コミットメッセージの詳細なルールは [`docs/commit-message-rules.md`](docs/commit-message-rules.md) を参照してください。

## コーディング・依存パッケージ方針

- package.jsonの依存ライブラリはキャレット（^）やチルダ（~）を付けず、必ずバージョンを固定してください。
- PrettierとESLintの競合を防ぐため、`eslint-config-prettier`を導入しています。

## 注意事項

- `.env` にはDB接続情報が含まれるため、コミットしないでください
- すべてのコード・設計・データ投入はAIエージェントによる自動生成・自動化を前提としています
- DBはSupabase CLIで起動・管理しています。Docker Composeは不要です。

## 要件定義書の格納場所

要件定義書は `docs/` ディレクトリ配下（`docs/*`）に格納しています。

- 例: `docs/requirements.md`, `docs/db_schema.md` など
