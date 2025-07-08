# Conventional Commits 1.0.0

https://github.com/conventional-commits/conventionalcommits.org

## 概要

Conventional Commits の仕様はコミットメッセージのための軽量の規約です。
明示的なコミット履歴を作成するための簡単なルールを提供します。この規則に従うことで自動化ツールの導入を簡単にします。
コミットメッセージで機能追加・修正・破壊的変更などを説明することで、この規約は [SemVer](http://semver.org/lang/ja/) と協調動作します。

コミットメッセージは次のような形にする必要があります:

---

原文：

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

訳：

```
<型>[任意 スコープ]: <タイトル>

[任意 本文]

[任意 フッター]
```

---

<br />

あなたのライブラリの利用者に意図を伝えるために、コミットは以下の構造化された要素を持ちます：

1. **fix:** _型_ `fix` を持つコミットはコードベースのバグにパッチを当てます (これは Semantic Versioning における [`PATCH`](http://semver.org/#summary) に相当します)。
1. **feat:** _型_ `feat` を持つコミットはコードベースに新しい機能を追加します (これは Semantic Versioning における [`MINOR`](http://semver.org/#summary) に相当します)。
1. **BREAKING CHANGE:** _フッター_ に `BREAKING CHANGE:` が書かれているか型/スコープの直後に `!` が追加されているコミットは API の破壊的変更を導入します (Semantic Versioning における [`MAJOR`](http://semver.org/#summary) に相当します)。
   `BREAKING CHANGE` は任意の _型_ のコミットに含めることができます。
1. `fix:` や `feat:` 以外の _型_ も許されています。たとえば [@commitlint/config-conventional](https://github.com/conventional-changelog/commitlint/tree/master/%40commitlint/config-conventional) (これは [Angular の規約](https://github.com/angular/angular/blob/22b96b9/CONTRIBUTING.md#-commit-message-guidelines) が基になっています) は `build:`, `chore:`, `ci:`,`docs:`, `style:`, `refactor:`, `perf:`, `test:`, などを推奨しています。
1. [git trailer format](https://git-scm.com/docs/git-interpret-trailers) に似た規約に従って、`BREAKING CHANGE: <タイトル>` 以外の _フッター_ が与えられるかもしれません。

追加の型たちは Conventional Commits の仕様で義務付けられているものではなく、(BREAKING CHANGE を含まない限り) Semantic Versioning に対する暗黙的な効果を持ちません。

<br /><br />

コミットの型には追加の文脈の情報として _スコープ_ を追加することができます。スコープは括弧で囲みます。たとえば `feat(parser): add ability to parse arrays` のようになります。

## 例

### タイトルおよび破壊的変更のフッターを持つコミットメッセージ

```
feat: allow provided config object to extend other configs

BREAKING CHANGE: `extends` key in config file is now used for extending other config files
```

### 破壊的変更を目立たせるために `!` を持つコミットメッセージ

```
feat!: send an email to the customer when a product is shipped
```

### スコープおよび破壊的変更を目立たせるための `!` を持つコミットメッセージ

```
feat(api)!: send an email to the customer when a product is shipped
```

### `!` と BREAKING CHANGE フッターの両方を持つコミットメッセージ

```
chore!: drop support for Node 6

BREAKING CHANGE: use JavaScript features not available in Node 6.
```

### 本文を持たないコミットメッセージ

```
docs: correct spelling of CHANGELOG
```

### スコープを持つコミットメッセージ

```
feat(lang): add polish language
```

### 複数段落からなる本文と複数のフッターを持ったコミットメッセージ

```
fix: prevent racing of requests

Introduce a request id and a reference to latest request. Dismiss
incoming responses other than from latest request.

Remove timeouts which were used to mitigate the racing issue but are
obsolete now.

Reviewed-by: Z
Refs: #123
```

## 仕様

この文書におけるキーワード「しなければならない (MUST)」「してはならない (MUST NOT)」「要求されている (REQUIRED)」「することになる (SHALL)」「することはない(SHALL NOT)」「する必要がある (SHOULD)」「しないほうがよい (SHOULD NOT)」「推奨される (RECOMMENDED)」「してもよい (MAY)」「選択できる (OPTIONAL)」は [RFC 2119](https://www.ietf.org/rfc/rfc2119.txt) ([JPNIC 日本語訳](https://www.nic.ad.jp/ja/tech/ipa/RFC2119JA.html)) で述べられているように解釈されるべきものです。

1. コミットは `feat` や `fix` などの型から始まり (MUST)、その後ろにはスコープ (OPTIONAL) と `!` (OPTIONAL) が続き、その後ろにコロンとスペース (REQUIRED) が続く。
1. コミットがあなたのアプリケーションやライブラリに新しい機能を追加するとき、型 `feat` が使われなければならない (MUST)。
1. コミットがあなたのアプリケーションのためのバグ修正を行うとき、型 `fix` が使われなければならない (MUST)。
1. スコープを型の後ろに記述してもよい (MAY)。スコープは、コードベースのセクションを記述する括弧で囲まれた名詞にしなければならない (MUST)。例: `fix(parser):`。
1. 型/スコープの後ろのコロンとスペースの直後にタイトルが続かなければならない (MUST)。
   タイトルはコード変更の短かい要約である。例: `fix: array parsing issue when multiple spaces were contained in string`。
1. 短いタイトルの後ろにより長いコミットの本文を追加してもよい (MAY)。これはコード変更に関する追加の情報を提供する。
   本文はタイトルの下の 1 行の空行から始めなければならない (MUST)。
1. コミットの本文は自由な形式であり、改行で区切られた複数の段落で構成することができる (MAY)。
1. ひとつ以上のフッターを、本文の下の 1 行の空行に続けて書くことができる (MAY)。
   それぞれのフッターは、ひとつの単語トークン、それに続く `:<space>` か `<space>#` によるセパレータ、そして文字列の値から構成されなければならない (MUST) (これは [git trailer convention](https://git-scm.com/docs/git-interpret-trailers) に触発されている)。
1. フッターのトークンは空白の代わりに `-` を使わなければならない (MUST)。例えば `Acked-by` とする (これは複数段落からなる本文からフッターを区別するのに役立つ)。
   例外として `BREAKING CHANGE` があり、これをトークンとして使用することができる (MAY)。
1. フッターの値にはスペースと改行を含めることができる (MAY)。そして次のフッターのトークンとセパレータの組が見つかった時、以前のフッターのパースは終了しなければならない (MUST)。
1. 破壊的変更は、コミットの型/スコープの接頭辞か、フッターによって明示されなければならない (MUST)。
1. 破壊的変更がフッターとして含まれる場合は、大文字の BREAKING CHANGE の後ろにコロンとスペース、そしてタイトルを続けなければならない (MUST)。例: `BREAKING CHANGE: environment variables now take precedence over config files`。
1. 破壊的変更が型/スコープの接頭辞として含まれる場合は、`:` の直前に `!` を用いて明示されねばならない (MUST)。`!` が使用された場合には、 フッターから `BREAKING CHANGE:` を省略してもよい (MAY)。その場合はコミットのタイトル部分で破壊的変更の内容を説明することになる (SHALL)。
1. `feat` と `fix` 以外の型を使うことができる (MAY)。例: `docs: updated ref docs.`。
1. Conventional Commits を構成する情報の単位は、大文字の `BREAKING CHANGE` を除いて、実装は大文字と小文字を区別してはならない (MUST NOT)。
1. フッターのトークンにおいて BREAKING-CHANGE は BREAKING CHANGE と同じトークンとして解釈されなければならない (MUST)。
