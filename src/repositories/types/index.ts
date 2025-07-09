// Pokemon Repository関連の型定義
export type RegionWithPokedexes = {
  id: number;
  nameJa: string;
  nameEn: string;
  pokedexes: {
    id: number;
    slug: string;
    nameJa: string;
    nameEn: string;
  }[];
};

export type TypeInfo = {
  id: number;
  slug: string;
  nameJa: string;
  nameEn: string;
};

export type PokemonForm = {
  id: number;
  nameJa: string;
  nameEn: string;
  types: string[];
  spriteDefault: string;
  spriteShiny: string;
};

export type PokemonFormWithOrder = PokemonForm & {
  order: number;
};

export type PokemonWithForms = {
  id: number;
  nameJa: string;
  nameEn: string;
  entryNumber: number;
  forms: PokemonForm[];
};

export type PokemonWithFormsAndOrder = {
  id: number;
  nameJa: string;
  nameEn: string;
  entryNumber: number;
  forms: PokemonFormWithOrder[];
};

export type SearchResult = {
  pokemons: PokemonWithForms[];
  total: number;
};

export type NameFilter = {
  formEntry: {
    pokemon: {
      OR: {
        name_ja?: { contains: string };
        name_kana?: { contains: string };
        name_en?: { contains: string };
      }[];
    };
  };
};

export type TypeFilter = {
  typeEntries: { some: { type: { slug: string } } };
};

export type SearchParams = {
  pokedexSlug: string;
  page: number;
  pageSize: number;
  name: string;
  type1: string;
  type2: string;
};

export type SearchFilters = {
  pokedexId: number;
  nameFilter?: NameFilter;
  typeFilters: TypeFilter[];
};

export type FormEntryWithRelations = {
  id: number;
  pokemon_id: number;
  order: number;
  sprite_default: string;
  sprite_shiny: string;
  pokemon?: {
    name_ja: string;
    name_en: string;
  } | null;
  form?: {
    name_ja: string;
    name_en: string;
  } | null;
  typeEntries?: {
    type: {
      slug: string;
    };
  }[];
};

export type PokedexEntryWithRelations = {
  entry_number: number;
  formEntry: FormEntryWithRelations | null;
};

// データベースレコード型定義
export type DatabaseRegion = {
  id: number;
  name_ja: string;
  name_en: string;
  pokedexes?: DatabasePokedex[];
};

export type DatabasePokedex = {
  id: number;
  slug: string;
  name_ja: string;
  name_en: string;
};

export type DatabaseType = {
  id: number;
  slug: string;
  name_ja: string;
  name_en: string;
};

export type DatabaseFormEntry = {
  id: number;
  pokemon_id: number;
  order: number;
  sprite_default: string;
  sprite_shiny: string;
  pokemon?: { name_ja: string; name_en: string } | null;
  form?: { name_ja: string; name_en: string } | null;
  typeEntries?: { type: { slug: string } }[];
};

export type DatabasePokedexEntry = {
  entry_number: number;
  formEntry: DatabaseFormEntry | null;
};

// Pokemon Repositoryのインターフェース
export interface IPokemonRepository {
  listRegionsWithPokedexes(): Promise<RegionWithPokedexes[]>;
  listAllTypes(): Promise<TypeInfo[]>;
  searchPokedexEntriesWithForms(params: SearchParams): Promise<SearchResult>;
  findPokedexEntries(filters: SearchFilters): Promise<PokedexEntryWithRelations[]>;
}
