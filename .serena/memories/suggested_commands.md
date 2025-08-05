# 推奨コマンド

## 開発用コマンド
- `npm run dev`: 開発サーバー起動
- `npm run dev:next`: Next.js開発サーバー（Turbopack使用）
- `npm run build`: 本番ビルド
- `npm run start`: 本番サーバー起動

## テスト関連
- `npm run test`: テスト実行
- `npm run test:watch`: ウォッチモードでテスト実行
- `npm run test:ui`: Vitest UIでテスト実行
- `npm run test:coverage`: カバレッジ付きテスト実行

## コード品質
- `npm run lint`: ESLintでのリント実行
- `npm run lint-fix`: ESLintでの自動修正
- `npm run format`: Prettierでのフォーマット
- `npm run type-check`: TypeScriptの型チェック

## データベース関連
- `npx prisma generate`: Prismaクライアント生成
- `npx prisma migrate deploy`: マイグレーション実行
- `npm run seed`: シードデータ投入
- `npx tsx prisma/seed.ts`: シード直接実行

## セットアップ手順
1. `npm install`
2. `npx prisma generate`
3. `npx prisma migrate deploy`
4. `npm run seed`
5. `npm run dev`

## macOS（Darwin）固有のコマンド
- `ls`: ファイル一覧
- `find`: ファイル検索
- `grep`: テキスト検索
- `git`: バージョン管理