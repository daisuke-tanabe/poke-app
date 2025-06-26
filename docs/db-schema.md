# データベース設計書

## pokemonsテーブル

- ポケモンの基本情報を管理するテーブル
- 各ポケモンは複数のフォーム（Form）を持つ

| カラム    | 型                    | 説明                   |
| --------- | --------------------- | ---------------------- |
| id        | SERIAL [PK]           | ポケモンのID           |
| name_ja   | text [NOT NULL]       | ポケモンの日本語名     |
| name_kana | text [NOT NULL]       | ポケモンのローマ字名   |
| name_en   | text [NOT NULL]       | ポケモンの英語名       |

---

## formsテーブル（フォーム情報）

- 各ポケモンの「通常」「色違い」「メガシンカ」などのバリエーションを管理するテーブル
- 各フォームは画像URL（sprite）や表示順（order）を持つ
- 1つのポケモンに複数のフォームが存在可能

| カラム      | 型                                   | 説明                         |
| ----------- | ------------------------------------ | ---------------------------- |
| id          | SERIAL [PK]                         | フォームID                   |
| pokemon_id  | integer [FK, NOT NULL, CASCADE]     | 対象ポケモンID               |
| name_ja     | text [NOT NULL]                     | フォームの日本語名           |
| name_en     | text [NOT NULL]                     | フォームの英語名             |
| sprite      | text [NOT NULL]                     | フォーム画像のURL            |
| order       | integer [NOT NULL]                  | ポケモン内でのフォーム表示順 |

**制約**
- UNIQUE (pokemon_id, order): 同一ポケモン内でorder重複禁止

---

## regionsテーブル

- 各地方（region）のマスタ情報を管理
- 各地方は複数の図鑑（pokedex）を持つ

| カラム  | 型                        | 説明            |
| ------- | ------------------------- | --------------- |
| id      | integer [PK]              | 地方のID        |
| name_ja | text [NOT NULL]           | 地方の日本語名  |
| name_en | text [NOT NULL]           | 地方の英語名    |
| slug    | text [NOT NULL, UNIQUE]   | スラッグ        |

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

| カラム    | 型                                | 説明            |
| --------- | --------------------------------- | --------------- |
| id        | integer [PK]                      | 図鑑のID        |
| region_id | integer [FK, NOT NULL, CASCADE]   | 地方ID          |
| name_ja   | text [NOT NULL]                   | 図鑑の日本語名  |
| name_en   | text [NOT NULL]                   | 図鑑の英語名    |
| slug      | text [NOT NULL, UNIQUE]           | スラッグ        |

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

- ポケモンの「フォーム」単位で図鑑（pokedex）への所属関係を管理する中間テーブル
- 各エントリは必ずフォーム（form_id）・図鑑（pokedex_id）の両方に紐づく（外部キーはNOT NULL）

| カラム       | 型                                         | 説明               |
| ------------ | ------------------------------------------ | ------------------ |
| id           | SERIAL [PK]                               | エントリID         |
| pokedex_id   | integer [FK, NOT NULL, CASCADE]           | 図鑑ID             |
| form_id      | integer [FK, NOT NULL, CASCADE]           | フォームID         |
| entry_number | integer [NOT NULL]                        | 図鑑内での番号     |

**制約**
- UNIQUE (pokedex_id, entry_number, form_id): 図鑑・番号・フォームの組み合わせで一意

---

## typesテーブル

- ポケモンのタイプを格納するマスタテーブル

| カラム  | 型                        | 説明            |
| ------- | ------------------------- | --------------- |
| id      | integer [PK]              | タイプID        |
| name_ja | text [NOT NULL]           | タイプの日本語名|
| name_en | text [NOT NULL]           | タイプの英語名  |
| slug    | text [NOT NULL, UNIQUE]   | スラッグ        |

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

- フォーム単位でタイプの関係・順序を格納する中間テーブル

| カラム            | 型                                         | 説明               |
| ----------------- | ------------------------------------------ | ------------------ |
| id                | SERIAL [PK]                               | タイプエントリID   |
| pokedex_entry_id  | integer [FK, NOT NULL, CASCADE]           | 図鑑エントリID     |
| type_id           | integer [FK, NOT NULL, CASCADE]           | タイプID           |
| form_id           | integer [FK, NOT NULL, CASCADE]           | フォームID         |

**制約**
- UNIQUE (pokedex_entry_id, type_id): 図鑑エントリ・タイプの組み合わせで一意
