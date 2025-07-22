# コミットメッセージルール

[Conventional Commits](https://conventionalcommits.org) ベースの簡潔なコミットメッセージ規約です。

## 基本フォーマット

```
<type>(<scope>): <description>

<body>
```

- **type**: 変更の種類（必須）
- **scope**: 変更範囲（省略可）  
- **description**: 変更内容の簡潔な説明（必須）
- **body**: 詳細な説明（省略可、改行で区切る）

## Type 一覧

| Type | 説明 | 例 |
|------|------|-----|
| `feat` | 新機能追加 | `feat(auth): ログイン機能を追加` |
| `fix` | バグ修正 | `fix(api): ユーザー取得APIのエラーハンドリング修正` |
| `refactor` | リファクタリング | `refactor(components): Container/Presentationalパターンに変更` |
| `docs` | ドキュメント変更 | `docs: READMEの環境構築手順を更新` |
| `style` | コードフォーマット | `style: prettier適用` |
| `test` | テスト追加・修正 | `test(utils): バリデーション関数のテストを追加` |
| `chore` | その他の変更 | `chore: パッケージ依存関係を更新` |

**その他のType**: `perf`（パフォーマンス改善）、`ci`（CI/CD設定）なども使用可能

## Scope 例

- `auth` - 認証関連
- `api` - API関連
- `db` - データベース関連
- `ui` - UIコンポーネント
- `utils` - ユーティリティ関数
- `config` - 設定ファイル

## 実践例

### 良い例
```
feat(pokemon-grid): ポケモンカード一覧表示を実装

- Container/Presentationalパターンで設計
- レスポンシブグリッドレイアウトに対応
- タイプ別フィルタリング機能を追加
```

```
fix(api): ポケモン検索で日本語名が正しく検索できない問題を修正
```

```
refactor(components): PokemonCardコンポーネントを統合
```

### 悪い例
```
update code
```

```
ポケモンの表示を直した
```

## 破壊的変更

API の互換性を壊す変更は `!` をつけます：

```
feat(api)!: ユーザー情報APIの形式を変更

BREAKING CHANGE: レスポンスフィールドがcamelCaseに変更されました
```

## ルール

1. **type は小文字で記述**
2. **description は現在形で記述**（「追加した」ではなく「追加」）
3. **日本語で記述**（チーム内のコミュニケーション言語）
4. **50文字以内を目安に**（GitHub上での表示を考慮）
5. **body は必要に応じて詳細を記述**（なぜその変更をしたのか）