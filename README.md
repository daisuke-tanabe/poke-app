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

## コミットメッセージのフォーマット

このリポジトリでは [Conventional Commits](https://www.conventionalcommits.org/ja/v1.0.0/) に従ったコミットメッセージを必須とします。

例:

- feat: 新機能の追加
- fix: バグ修正
- docs: ドキュメントのみの変更
- style: フォーマットやスペースのみの変更
- refactor: リファクタリング
- perf: パフォーマンス改善
- test: テスト追加・修正
- chore: ビルドや補助ツール、ライブラリの変更

## 注意事項

- `.env` にはDB接続情報が含まれるため、コミットしないでください
- すべてのコード・設計・データ投入はAIエージェントによる自動生成・自動化を前提としています

---

AIエージェントによる自動化・開発の限界や課題を探求し、知見を共有するためのリポジトリです。
