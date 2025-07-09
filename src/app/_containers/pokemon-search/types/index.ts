// 共通の型定義

export type PokemonType = {
  id: number;
  slug: string;
  nameJa: string;
  nameEn: string;
};

export type Pokedex = {
  id: number;
  slug: string;
  nameJa: string;
  nameEn: string;
};

export type Region = {
  id: number;
  nameJa: string;
  nameEn: string;
  pokedexes: Pokedex[];
};
