# プロジェクト概要

## プロジェクトの目的
AIエージェントによる自動化・開発の限界や課題を探求し、知見を共有するためのリポジトリ。ポケモン図鑑データベースをNext.js（TypeScript）+ Prisma + PostgreSQLで構築し、DB設計・データアクセス・API・画面実装・初期データ投入など、すべてAIエージェントによる自動生成・自動化を目指している。

## 技術スタック
- **フロントエンド**: Next.js 15 (TypeScript 5), React 19
- **バックエンド**: Node.js 22, Prisma 6
- **データベース**: PostgreSQL 17（Supabase CLIによるローカル環境）
- **UI**: Tailwind CSS, shadcn/ui
- **テスト**: Vitest, @testing-library/react
- **その他**: Lefthook（Git hooks）, Prettier, ESLint

## プロジェクト構造
- `src/app/`: Next.js App Router構造
- `src/components/`: 再利用可能なUIコンポーネント
- `src/data/`: データアクセス層（API層）
- `src/lib/`: ユーティリティ・設定
- `prisma/`: Prismaスキーマ・マイグレーション・シード
- `docs/`: 要件定義書・設計書類

## 開発フロー
TDD（Test-Driven Development）を採用。Red（テスト作成）→ Green（最小実装）→ Refactor（改善）のサイクルを重視。