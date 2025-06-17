# poke-app

このリポジトリは「AIエージェントでどこまで自動化・開発できるか」に挑戦する実験的プロジェクトです。

## プロジェクト概要

- ポケモン図鑑データベースをNext.js（TypeScript）+ Prisma + PostgreSQLで構築
- DB設計・データアクセス・API・画面実装・初期データ投入など、すべてAIエージェントによる自動生成・自動化を目指します
- AIエージェントの実践・検証・学習のための教材・実験場として活用

## 技術スタック

- Next.js 15 (TypeScript 5)
- Node.js 22
- Prisma 6
- PostgreSQL 17（Dockerコンテナ）
- Tailwind CSS

## セットアップ手順

1. 必要なパッケージのインストール
   ```sh
   npm install
   ```
2. DBコンテナの起動
   ```sh
   docker compose up -d
   ```
3. Prismaマイグレーション＆シード投入
   ```sh
   npx prisma generate
   npx prisma migrate reset --force
   npx tsx prisma/seed.ts
   ```
4. 開発サーバー起動
   ```sh
   npm run dev
   ```
5. ブラウザで http://localhost:3000/ を開き、全国図鑑のポケモン一覧が表示されることを確認

## 注意事項

- `.env` にはDB接続情報が含まれるため、コミットしないでください
- すべてのコード・設計・データ投入はAIエージェントによる自動生成・自動化を前提としています
