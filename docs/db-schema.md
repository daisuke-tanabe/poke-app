# データベース設計書

## pokemonsテーブル

- ポケモンの基本情報を管理するテーブル
- 各ポケモンは複数の図鑑・タイプに所属可能
- 身長・体重はdouble precision型で小数点第1位までの実数値

| カラム    | 型                          | 説明                                          |
| --------- | --------------------------- | --------------------------------------------- |
| id        | SERIAL                      | ポケモンのID、オートインクリメント、主キー    |
| name_ja   | text [NOT NULL]             | ポケモンの日本語名                            |
| name_kana | text [NOT NULL]             | ポケモンのローマ字名                          |
| name_en   | text [NOT NULL]             | ポケモンの英語名                              |
| height    | double precision [NOT NULL] | ポケモンの身長、小数点第1位までの実数値、必須 |
| weight    | double precision [NOT NULL] | ポケモンの体重、小数点第1位までの実数値、必須 |

---

## regionsテーブル

- 各地方（region）のマスタ情報を管理
- 各地方は複数の図鑑（pokedex）を持つ
- `slug`カラムは、`name_en`をすべて小文字にし、ケバブケース（単語間をハイフンで区切る形式）に変換した値

| カラム  | 型              | 説明                                  |
| ------- | --------------- | ------------------------------------- |
| id      | integer         | 地方のID、主キー                      |
| name_ja | text [NOT NULL] | 地方の日本語名                        |
| name_en | text [NOT NULL] | 地方の英語名                          |
| slug    | text [NOT NULL] | スラッグ、URL表示のためなどに存在する |

### 投入データ

| id  | name_ja  | name_en | slug   |
| --- | -------- | ------- | ------ |
| 1   | 全国     | Global  | global |
| 10  | カントー | Kanto   | kanto  |
| 20  | ジョウト | Johto   | johto  |
| 30  | ホウエン | Hoeen   | hoeen  |
| 40  | シンオウ | Sinnoh  | sinnoh |
| 50  | イッシュ | Unova   | unova  |
| 60  | カロス   | Kalos   | kalos  |
| 70  | アローラ | Alola   | alola  |
| 80  | ヒスイ   | Hisui   | hisui  |
| 90  | ガラル   | Galar   | galar  |
| 100 | パルデア | Paldea  | paldea |

---

## pokedexesテーブル

- ポケモンがどの図鑑（pokedex）に所属するかを管理するマスタテーブル
- 各図鑑は地方（region）に紐づく
- `slug`カラムは、`name_en`をすべて小文字にし、ケバブケース（単語間をハイフンで区切る形式）に変換した値
- 1つの図鑑に複数のポケモンが所属可能

| カラム    | 型                 | 説明                                  |
| --------- | ------------------ | ------------------------------------- |
| id        | integer            | 図鑑のID、主キー                      |
| region_id | integer [NOT NULL] | regionsテーブルのidを参照、外部キー   |
| name_ja   | text [NOT NULL]    | 図鑑の日本語名                        |
| name_en   | text [NOT NULL]    | 図鑑の英語名                          |
| slug      | text [NOT NULL]    | スラッグ、URL表示のためなどに存在する |

### 投入データ

| id  | region_id | name_ja          | name_en       | slug          |
| --- | --------- | ---------------- | ------------- | ------------- |
| 1   | 1         | 全国             | National      | national      |
| 10  | 10        | カントー         | Kanto         | kanto         |
| 20  | 20        | ジョウト         | Johto         | johto         |
| 30  | 30        | ホウエン         | Hoeen         | hoeen         |
| 40  | 40        | シンオウ         | Sinnoh        | sinnoh        |
| 50  | 50        | イッシュ         | Unova         | unova         |
| 60  | 60        | カロス           | Kalos         | kalos         |
| 70  | 70        | アローラ         | Alola         | alola         |
| 71  | 70        | メレメレ         | Melemele      | melemele      |
| 72  | 70        | アーカラ         | Akala         | akala         |
| 73  | 70        | ウラウラ         | Ula'ula       | ulaula        |
| 74  | 70        | ポニ             | Poni          | poni          |
| 80  | 80        | ヒスイ           | Hisui         | hisui         |
| 90  | 90        | ガラル           | Galar         | galar         |
| 91  | 90        | ヨロイじま       | Isle of Armor | isle-of-armor |
| 92  | 90        | カンムリせつげん | Crown Tundra  | crown-tundra  |
| 100 | 100       | パルデア         | Paldea        | paldea        |
| 101 | 100       | キタカミ         | Kitakami      | kitakami      |
| 102 | 100       | ブルーベリー     | Blueberry     | blueberry     |

---

## pokedex_entriesテーブル

- ポケモンと図鑑（pokedex）の所属関係を管理する中間テーブル
- 各エントリは必ずポケモン・図鑑の両方に紐づく（外部キーはNOT NULL）
- 主キーはid（SERIAL, オートインクリメント）
- (pokedex_id, entry_number) の組み合わせにUNIQUE制約を付与し、同じ図鑑内でentry_numberが重複しないようにする

| カラム       | 型                 | 説明                                  |
| ------------ | ------------------ | ------------------------------------- |
| id           | SERIAL             | 主キー、オートインクリメント          |
| pokemon_id   | integer [NOT NULL] | pokemonsテーブルのidを参照、外部キー  |
| pokedex_id   | integer [NOT NULL] | pokedexesテーブルのidを参照、外部キー |
| entry_number | integer [NOT NULL] | 図鑑内での番号、ユニーク制約          |

---

## typesテーブル

ポケモンのタイプを格納するマスタテーブルです。

- `slug`カラムは、`name_en`をすべて小文字にし、ケバブケース（単語間をハイフンで区切る形式）に変換した値です。URLや識別子として利用します。

| カラム  | 型              | 説明                                  |
| ------- | --------------- | ------------------------------------- |
| id      | integer         | タイプのID、主キー                    |
| name_ja | text [NOT NULL] | タイプの日本語名                      |
| name_en | text [NOT NULL] | タイプの英語名                        |
| slug    | text [NOT NULL] | スラッグ、URL表示のためなどに存在する |

### 投入データ

| id  | name_ja    | name_en  | slug     |
| --- | ---------- | -------- | -------- |
| 10  | ノーマル   | Normal   | normal   |
| 20  | ほのお     | Fire     | fire     |
| 30  | みず       | Water    | water    |
| 40  | でんき     | Electric | electric |
| 50  | くさ       | Grass    | grass    |
| 60  | こおり     | Ice      | ice      |
| 70  | かくとう   | Fighting | fighting |
| 80  | どく       | Poison   | poison   |
| 90  | じめん     | Ground   | ground   |
| 100 | ひこう     | Flying   | flying   |
| 110 | エスパー   | Psychic  | psychic  |
| 120 | むし       | Bug      | bug      |
| 130 | いわ       | Rock     | rock     |
| 140 | ゴースト   | Ghost    | ghost    |
| 150 | ドラゴン   | Dragon   | dragon   |
| 160 | あく       | Dark     | dark     |
| 170 | はがね     | Steel    | steel    |
| 180 | フェアリー | Fairy    | fairy    |

---

## type_entriesテーブル

ポケモンとタイプの関係、そしてタイプの順序を格納する中間テーブルです。
主キーは pokemon_id と type_id をまとめた複合キーです。

| カラム     | 型                 | 説明                                               |
| ---------- | ------------------ | -------------------------------------------------- |
| pokemon_id | integer [NOT NULL] | pokemonsテーブルのidを参照、外部キー（複合主キー） |
| type_id    | integer [NOT NULL] | typesテーブルのidを参照、外部キー（複合主キー）    |
