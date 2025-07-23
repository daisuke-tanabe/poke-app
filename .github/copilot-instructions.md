# copilot-instructions.md

## 基本設定

- 常に日本語で会話する。
- 遠慮しないで、全力を尽くしてください。

## 開発ワークフロー

原則として和田卓人（t-wada）氏が提唱するテスト駆動開発（TDD）で進めてください。

### Red Phase（テスト作成）

- 期待される入出力に基づき、まずテストを作成する。
- 実装コードは書かず、テストのみを用意する。
- テストを実行し、失敗を確認する。
- テストが正しいことを確認できた段階でコミットする。

### Green Phase（最小実装）

- テストをパスさせる最小限の実装を進める。
- 実装中はテストを変更せず、コードを修正し続ける。
- すべてのテストが通過するまで繰り返す。

### Refactor Phase（改善）

- テストを通したまま、コードの品質を向上させる。
- 重複削除、命名改善、構造化を行う。
- リファクタリング後も全テスト通過を確認。

## 要件定義書

[REQUIREMENTS.md](../docs/REQUIREMENTS.md)の内容に従う

## 設計書

[DB_SCHEMA.md](../docs/DB_SCHEMA.md)の内容に従う

## コーディング

[CODING_GUIDELINES.md](../docs/CODING_GUIDELINES.md)の内容に従う
[CODING_RULES.md](../docs/CODING_RULES.md)の内容に従う
[COMMIT_MESSAGE_RULES.md](../docs/COMMIT_MESSAGE_RULES.md)の内容に従う
[COMPONENT_DESIGN_RULES.md](../docs/COMPONENT_DESIGN_RULES.md)の内容に従う
