// UI専用型定義 - Presentationalコンポーネント用

/**
 * UIで表示するポケモンフォームの型
 * Repository層のPokemonFormから必要なプロパティのみ抽出
 */
export type UIPokemonForm = {
  types: string[];
  spriteDefault: string;
};

/**
 * UIで表示するポケモンの型
 * Repository層のPokemonWithFormsから必要なプロパティのみ抽出
 */
export type UIPokemon = {
  id: number;
  nameJa: string;
  nameEn: string;
  entryNumber: number;
  forms: UIPokemonForm[];
};

/**
 * PokemonGridPresentationalコンポーネントのProps型
 */
export type PokemonGridPresentationalProps = {
  pokemons: UIPokemon[];
};

/**
 * PokemonCardListコンポーネントのProps型
 */
export type PokemonCardListProps = {
  pokemons: UIPokemon[];
};

/**
 * PokemonCardコンポーネントのProps型
 */
export type PokemonCardProps = {
  pokemon: UIPokemon;
};
