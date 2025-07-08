# コーディングルール（必須）

このドキュメントはプロジェクトで必ず守るべきコーディングルールです。

## 変数
- **必ず** `const` を**最優先で使うこと**。は条件付き代入やループでの再代入が必要な場合は `let`を使用してもよい。

## 命名規則
- 変数・関数はキャメルケース（例: `pokemonList`）。
- クラス・型はパスカルケース（例: `PokemonCard`）。
- 定数（変更しない値）は全て大文字スネークケース（例: `MAX_PAGE_SIZE`）も可。
- データ取得関数は取得元を明確にする。データ取得の`get`プレフィックスは避ける。
  - データベース: `findXxx`, `searchXxx`, `listXxx`
  - API: `fetchXxx`
  - ファイル: `readXxx`
  - その他: 処理内容に応じて適切な動詞を選択
  - 例：
    ```typescript
    // 推奨
    findUserById(), searchPokemons(), listRegions()
    fetchUserProfile(), readConfig()
    getName(), getAge(), getCurrentUser()  // 単純なgetterは可
    
    // 非推奨
    getAllUsers(), getDataFromAPI(), getConfigFile()
    ```

## 反復処理
- 配列の反復には**必ず** `Array.prototype.map`、`filter`、`reduce`、`some`、`every`、`find`、`flatMap` などの**配列メソッド（イテレータ関数）を最優先で使うこと**。
- `for`、`for...of`、`forEach` の使用および配列メソッド（イテレータ関数）の多重ネストは**原則禁止**とする。ただしパフォーマンスや副作用が明確に必要な場合のみ、**例外的に専用関数に分離して使うこと**。
  - パフォーマンスが重要な大量データ処理（例：数千件以上のデータ変換、seed処理など）する場合。
  - 高階関数では中間配列の大量生成によりメモリ効率が著しく悪化する場合。

## オブジェクト操作
- 条件チェック内でのオブジェクト変更（副作用）は**禁止**する。条件チェックと代入は明確に分離すること。
  - 例：
    ```typescript
    // 推奨
    const filters: Record<string, unknown> = {};
    if (name) {
      filters.name = { contains: name };
    }
    
    // 非推奨
    if (name && (filters.name = { contains: name })) { /* 処理 */ }
    ```

## テスト品質
- テストに合格するために分岐や返却値をハードコーディング（例: `if (input === 42) return 'foo';` や `return 123;` や `if (input === 'test') return 'ok';`）するのは**禁止**する。
- テスト以外の入力値や利用シーンでも正しく動作するように実装すること。
- テストのために一時的に値や挙動を固定したい場合は、**必ず**モックやスタブなどテスト専用の仕組みを使い、実装本体には影響を与えないこと。

## その他
- 未使用の変数・関数・import・定数は削除する。
