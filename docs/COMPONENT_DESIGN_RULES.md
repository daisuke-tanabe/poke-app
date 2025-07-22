# コンポーネント設計ルール

## Container/Presentational パターン

### 概要

データ取得とUI表示の責務を明確に分離する設計パターンです。これにより、保守性と再利用性を向上させます。pokemon-searchディレクトリの設計パターンを標準として採用し、実用性を重視したアプローチを取ります。

### 設計原則

#### Container Component（container.tsx）
- **責務**: データ取得、状態管理、ビジネスロジック
- **特徴**:
  - サーバーコンポーネント（async function）
  - データベース、API、リポジトリからのデータ取得を行う
  - 取得したデータを Presentational Component にpropsとして渡す
  - UI に関するロジックは含めない
  - **型定義**: コンポーネントのProps型は同じファイル内にインライン定義する

#### Presentational Component（presentational.tsx）
- **責務**: UI の描画、表示ロジック、ユーザーインタラクション
- **特徴**:
  - クライアントコンポーネント（`'use client'`ディレクティブ）
  - propsとして受け取ったデータを表示する
  - データ取得は行わない
  - **レイアウト責務**: ルートレベルのマージンやレイアウト調整を担当
  - **型定義**: コンポーネントのProps型は同じファイル内にインライン定義する
  - 状態管理はカスタムフックに委譲することも可能

#### Components ディレクトリ（components/）
- **責務**: 再利用可能な子コンポーネント群
- **特徴**:
  - マージンを含まない、純粋なUIコンポーネント
  - 関連する小さなコンポーネントは一つのファイルに統合してもよい
  - **型定義**: コンポーネントのProps型は同じファイル内にインライン定義する

### ファイル構成

```
src/app/_containers/[feature-name]/
├── components/          # 子コンポーネント群（オプション）
│   └── ComponentName.tsx    # 必要に応じて関連コンポーネントを統合
├── hooks/              # カスタムフック（オプション）
├── container.tsx       # Container Component + Props型定義
├── presentational.tsx  # Presentational Component + Props型定義
└── index.ts           # エントリーポイント（containerをre-export）
```

### 型定義の方針

**基本原則**: 過度な分割を避け、コンポーネントと型定義を同一ファイルに配置

- **Container Component**: `PokemonGridContainerProps` などの型をcontainer.tsx内に定義
- **Presentational Component**: `PokemonGridPresentationalProps` などの型をpresentational.tsx内に定義  
- **Child Components**: 各コンポーネントファイル内に型定義を配置
- **共通型**: `/repositories/types` や `/types` など、既存の型定義を再利用

**型分離の判断基準**:

#### 分離すべき型（types.tsに配置）
- 複数のコンポーネント間で共有される複雑なドメイン型
- 外部に公開するAPI型定義  
- データ変換用のUI専用型（例: `UIPokemon`, `UIPokemonForm`）
- 同じ型を3回以上書く場合

#### 分離すべきでない型（各ファイル内に定義）
- **単一のコンポーネントでのみ使用されるProps型**
- コンポーネント固有の状態管理型
- 再利用されない小さな型定義
- **同じ型を書く必要がない限り分離しない**

**重要**: 型の分離は必要性が明確な場合のみ行う。迷った場合は同一ファイル内に定義する。

### 実装例

#### index.ts（エントリーポイント）
```tsx
export * from './container';
```

#### Container Component（container.tsx）
```tsx
import { pokemonRepository } from '@/repositories/pokemonRepository';

import { PokemonGridPresentational } from './presentational';

export type PokemonGridContainerProps = {
  currentPage: number;
  perPage: number;
  pokemonName: string;
  pokedexSlug: string;
  types: [string, string];
};

export async function PokemonGridContainer({ 
  currentPage, 
  perPage, 
  pokemonName, 
  pokedexSlug, 
  types 
}: PokemonGridContainerProps) {
  // データ取得のみを担当
  const { pokemons: rawPokemons } = await pokemonRepository.searchPokedexEntriesWithForms({
    pokedexSlug,
    page: currentPage,
    pageSize: perPage,
    name: pokemonName,
    type1: types[0],
    type2: types[1],
  });

  // データをPresentational Componentに渡す
  return <PokemonGridPresentational pokemons={rawPokemons} />;
}
```

#### Presentational Component（presentational.tsx）
```tsx
'use client';

import { PokemonCardList } from './components/CardList';

import type { PokemonWithForms } from '@/repositories/types';

type PokemonGridPresentationalProps = {
  pokemons: PokemonWithForms[];
};

export function PokemonGridPresentational({ pokemons }: PokemonGridPresentationalProps) {
  return (
    <div className="mb-10">
      <PokemonCardList pokemons={pokemons} />
    </div>
  );
}
```

#### Components（components/CardList.tsx）
```tsx
'use client';

import Image from 'next/image';
import { useState } from 'react';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/card';

import type { PokemonWithForms } from '@/repositories/types';

type CardListProps = {
  pokemons: PokemonWithForms[];
};

type PokemonCardContentProps = {
  pokemon: PokemonWithForms;
};

// 関連する小さなコンポーネントは同一ファイルに統合
function PokemonCardContent({ pokemon }: PokemonCardContentProps) {
  // 実装...
}

export function CardList({ pokemons }: CardListProps) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {pokemons.map((pokemon) => (
        <Card key={pokemon.id}>
          {/* マージンを含まない純粋なUIコンポーネント */}
          <PokemonCardContent pokemon={pokemon} />
        </Card>
      ))}
    </div>
  );
}
```

### メリット

1. **単一責任の原則**: 各コンポーネントが明確な責務を持つ
2. **テスタビリティ**: データ取得とUI表示を個別にテスト可能
3. **再利用性**: Child Component は他のコンテキストでも使用可能
4. **保守性**: 関連する型とコンポーネントが同一ファイルにあり修正しやすい
5. **可読性**: 過度な分割を避け、理解しやすい構造
6. **実装詳細の隠蔽**: index.tsによるエントリーポイントで内部実装を隠蔽
7. **実用性**: ファットでも関連機能をまとめることで開発効率を向上

### 命名規則

- Container Component: `[FeatureName]Container`
- Presentational Component: `[FeatureName]Presentational`
- Child Components: 具体的な機能名（例: `CardList`、`SearchForm`）
- Props型: `[ComponentName]Props`
- ファイル名: `container.tsx`、`presentational.tsx`、`components/ComponentName.tsx`、`index.ts`

### コンポーネント分割の判断基準

#### 分割すべき場合
- 異なる責務を持つ場合（データ取得 vs UI表示）
- 再利用される可能性が高い場合
- コンポーネントが100行を大幅に超える場合
- テストを独立して書きたい場合

#### 統合すべき場合  
- 密結合で常に一緒に使用される場合
- 分割してもメリットが少ない場合（50行以下程度）
- 型定義が単純で共有される必要がない場合
- 過度な抽象化になる場合

### 適用対象

- データ取得を伴う一覧表示コンポーネント
- 複雑な状態管理を含むコンポーネント
- 再利用性が求められるUIコンポーネント
- フォームやダイアログなどの複合UIコンポーネント

このパターンにより、過度な抽象化を避けつつ適切な責務分離を保った、実用的で保守性の高いコンポーネント設計を実現できます。