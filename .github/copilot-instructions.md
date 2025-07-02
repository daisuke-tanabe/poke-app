# コミットメッセージルール（Conventional Commits 準拠）

このプロジェクトのコミットメッセージは、`docs/commit-message-rules.md` に従い、Conventional Commits 1.0.0 仕様を厳守してください。

## 基本フォーマット

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

- type: feat, fix, docs, style, refactor, test, chore, build, ci など
- scope: 任意。影響範囲やモジュール名などを括弧で指定
- description: 変更内容の要約（日本語可、50文字以内推奨）
- body: 任意。詳細な説明や背景、理由など
- footer: 任意。BREAKING CHANGEや関連Issue等

## 例

```
feat: ポケモン検索機能を追加
fix(pokemon): フォーム名の誤表示を修正
refactor(repo): PokemonForm→Formへのリネーム対応
chore: Prismaクライアントを再生成

BREAKING CHANGE: Formモデルのフィールド構成を変更
```

## 参考

- Conventional Commits 1.0.0: https://www.conventionalcommits.org/ja/v1.0.0/
- 詳細は docs/commit-message-rules.md を参照
