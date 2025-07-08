import { prisma } from '@/lib/prisma';

// 型定義を明確化
type RegionWithPokedexes = {
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

type TypeInfo = {
  id: number;
  slug: string;
  nameJa: string;
  nameEn: string;
};

type PokemonForm = {
  id: number;
  nameJa: string;
  nameEn: string;
  types: string[];
  spriteDefault: string;
  spriteShiny: string;
};

type PokemonFormWithOrder = PokemonForm & {
  order: number;
};

type PokemonWithForms = {
  id: number;
  nameJa: string;
  nameEn: string;
  entryNumber: number;
  forms: PokemonForm[];
};

type PokemonWithFormsAndOrder = {
  id: number;
  nameJa: string;
  nameEn: string;
  entryNumber: number;
  forms: PokemonFormWithOrder[];
};

type SearchResult = {
  pokemons: PokemonWithForms[];
  total: number;
};

type NameFilter = {
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

type TypeFilter = {
  typeEntries: { some: { type: { slug: string } } };
};

type SearchParams = {
  pokedexSlug: string;
  page: number;
  pageSize: number;
  name: string;
  type1: string;
  type2: string;
};

type SearchFilters = {
  pokedexId: number;
  nameFilter?: NameFilter;
  typeFilters: TypeFilter[];
};

type FormEntryWithRelations = {
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

type PokedexEntryWithRelations = {
  entry_number: number;
  formEntry: FormEntryWithRelations | null;
};

/**
 * 検索条件を構築
 */
function buildSearchFilters(pokedexId: number, name: string, type1: string, type2: string): SearchFilters {
  const typeFilters: TypeFilter[] = [type1, type2]
    .filter((slug): slug is string => Boolean(slug))
    .map((slug) => ({ typeEntries: { some: { type: { slug } } } }));

  let nameFilter: NameFilter | undefined;
  if (name) {
    nameFilter = {
      formEntry: {
        pokemon: {
          OR: [{ name_ja: { contains: name } }, { name_kana: { contains: name } }, { name_en: { contains: name } }],
        },
      },
    };
  }

  return {
    pokedexId,
    nameFilter,
    typeFilters,
  };
}

/**
 * スプライト情報を安全に取得
 */
function extractSpriteInfo(formEntry: FormEntryWithRelations): {
  spriteDefault: string;
  spriteShiny: string;
} {
  return {
    spriteDefault: formEntry.sprite_default ?? '',
    spriteShiny: formEntry.sprite_shiny ?? '',
  };
}

/**
 * フォームエントリをPokemonFormに変換
 */
function convertToFormData(formEntry: FormEntryWithRelations): PokemonFormWithOrder {
  const { spriteDefault, spriteShiny } = extractSpriteInfo(formEntry);

  // タイプの重複を除去
  const uniqueTypes = Array.from(new Set((formEntry.typeEntries ?? []).map((te) => te.type.slug)));

  return {
    id: formEntry.id,
    nameJa: formEntry.form?.name_ja ?? '',
    nameEn: formEntry.form?.name_en ?? '',
    types: uniqueTypes,
    spriteDefault,
    spriteShiny,
    order: formEntry.order,
  };
}

/**
 * 図鑑エントリをポケモンIDでグループ化
 */
function groupEntriesByPokemon(entries: PokedexEntryWithRelations[]): Record<number, PokemonWithFormsAndOrder> {
  const grouped: Record<number, PokemonWithFormsAndOrder> = {};

  for (const entry of entries) {
    const fe = entry.formEntry;
    if (!fe) continue;

    const pokemonId = fe.pokemon_id;
    if (!grouped[pokemonId]) {
      grouped[pokemonId] = {
        id: pokemonId,
        nameJa: fe.pokemon?.name_ja ?? '',
        nameEn: fe.pokemon?.name_en ?? '',
        entryNumber: entry.entry_number,
        forms: [],
      };
    }

    const formData = convertToFormData(fe);
    grouped[pokemonId].forms.push(formData);
    grouped[pokemonId].forms.sort((a, b) => a.order - b.order);
  }

  return grouped;
}

/**
 * ページネーション処理とレスポンス整形
 */
function paginateAndFormatResults(
  grouped: Record<number, PokemonWithFormsAndOrder>,
  page: number,
  pageSize: number,
): SearchResult {
  const skip = (page - 1) * pageSize;

  const allPokemons: PokemonWithForms[] = Object.values(grouped).map((p) => ({
    ...p,
    forms: p.forms.map(({ order, ...rest }) => rest),
  }));

  const pagedPokemons = allPokemons.slice(skip, skip + pageSize);
  return { pokemons: pagedPokemons, total: allPokemons.length };
}

export const pokemonRepository = {
  // 地方別の図鑑リスト取得
  async listRegionsWithPokedexes(): Promise<RegionWithPokedexes[]> {
    const regions = await prisma.region.findMany({
      include: {
        pokedexes: true,
      },
      orderBy: { id: 'asc' },
    });

    return regions.map((region) => ({
      id: region.id,
      nameJa: region.name_ja,
      nameEn: region.name_en,
      pokedexes: region.pokedexes.map((pokedex) => ({
        id: pokedex.id,
        slug: pokedex.slug,
        nameJa: pokedex.name_ja,
        nameEn: pokedex.name_en,
      })),
    }));
  },

  // 全タイプ一覧を取得
  async listAllTypes(): Promise<TypeInfo[]> {
    const types = await prisma.type.findMany({ orderBy: { id: 'asc' } });
    return types.map((type) => ({
      id: type.id,
      slug: type.slug,
      nameJa: type.name_ja,
      nameEn: type.name_en,
    }));
  },

  /**
   * 指定図鑑のポケモンエントリを検索（検索・ページング対応）
   */
  async searchPokedexEntriesWithForms(params: SearchParams): Promise<SearchResult> {
    // 図鑑存在チェック
    const pokedex = await prisma.pokedex.findUnique({ where: { slug: params.pokedexSlug } });
    if (!pokedex) throw new Error('Pokedex not found');

    // 検索条件を構築
    const filters = buildSearchFilters(pokedex.id, params.name, params.type1, params.type2);

    // 図鑑エントリを取得
    const entries = await this.findPokedexEntries(filters);

    // ポケモンごとにグループ化
    const grouped = groupEntriesByPokemon(entries);

    // ページネーション処理
    return paginateAndFormatResults(grouped, params.page, params.pageSize);
  },

  /**
   * 検索条件に基づいて図鑑エントリを取得
   */
  async findPokedexEntries(filters: SearchFilters): Promise<PokedexEntryWithRelations[]> {
    const whereClause: Record<string, unknown> = {
      pokedex_id: filters.pokedexId,
    };

    if (filters.nameFilter) {
      Object.assign(whereClause, filters.nameFilter);
    }

    if (filters.typeFilters.length > 0) {
      whereClause.AND = filters.typeFilters;
    }

    return await prisma.pokedexEntry.findMany({
      where: whereClause,
      orderBy: { entry_number: 'asc' },
      include: {
        formEntry: {
          include: {
            pokemon: true,
            form: true,
            typeEntries: { include: { type: true } },
          },
        },
      },
    });
  },
};
