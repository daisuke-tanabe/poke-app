# コーディングルール（必須）

このドキュメントはプロジェクトで必ず守るべきコーディングルールです。

## 変数
- 原則 `const` を使う。

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
- 配列の反復には原則として `map` / `filter` / `reduce` などの高階関数を優先して使う。
- 高階関数をネストしている場合は、可読性とパフォーマンスの観点から設計を再検討する。
- `for` や `forEach` の使用は基本的に禁止とするが、以下の条件を満たす場合のみ `for` / `forEach` の使用を許可する。必ず専用関数に分離し、関数名で処理内容を明確にすること
  - パフォーマンスが重要な大量データ処理（例：数千件以上のデータ変換、seed処理など）する場合。
  - 高階関数では中間配列の大量生成によりメモリ効率が著しく悪化する場合。

## オブジェクト操作
- 条件チェック内でのオブジェクト変更（副作用）は禁止する。条件チェックと代入は明確に分離すること。
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
- テストに合格するために分岐や返却値をハードコーディング（例: `if (input === 42) return 'foo';` や `return 123;` や `if (input === 'test') return 'ok';`）するのは禁止する。
- テスト以外の入力値や利用シーンでも正しく動作するように実装すること。
- テストのために一時的に値や挙動を固定したい場合は、必ずモックやスタブなどテスト専用の仕組みを使い、実装本体には影響を与えないこと。

## その他
- 未使用の変数・関数・import・定数は削除する。
