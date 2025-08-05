# タスク完了時の要件

## 必須実行コマンド
タスク完了時には以下のコマンドを実行してコードの品質を確認する：

1. **型チェック**: `npm run type-check`
2. **リント**: `npm run lint`
3. **フォーマット**: `npm run format` 
4. **テスト**: `npm run test`

## データベース関連タスクの場合
- Prismaスキーマ変更時: `npx prisma generate`
- マイグレーション実行: `npx prisma migrate deploy`
- シードデータ更新時: `npm run seed`

## コミット前の確認事項
- Lefthook（Git hooks）により自動実行される品質チェック
- `.env`ファイルはコミット対象外
- コミットメッセージは`docs/commit-message-rules.md`に従う

## 開発サーバー確認
- `npm run dev`でローカルサーバー起動
- http://localhost:3000 で動作確認

## TDD原則
- Red（テスト作成）→ Green（最小実装）→ Refactor（改善）
- テスト失敗確認後に実装開始
- リファクタリング時はテストが通り続けることを確認