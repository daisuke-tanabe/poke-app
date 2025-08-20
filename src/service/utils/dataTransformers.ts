import type { FormEntryWithRelations, PokemonFormWithOrder, PokedexEntryWithRelations, SearchResult } from '../types';

/**
 * フォームエントリをPokemonFormに変換
 */
type PokemonFormWithRegion = PokemonFormWithOrder & {
  regionId?: number;
};

export function convertToFormData(formEntry: FormEntryWithRelations): PokemonFormWithRegion {
  const types = Array.from(new Set((formEntry.typeEntries ?? []).map((te) => te.type.slug)));

  return {
    id: formEntry.id,
    nameJa: formEntry.form?.name_ja ?? '',
    nameEn: formEntry.form?.name_en ?? '',
    types,
    spriteDefault: formEntry.sprite_default,
    spriteShiny: formEntry.sprite_shiny,
    order: formEntry.order,
    regionId: formEntry.form?.region?.id,
  };
}

/**
 * 図鑑エントリをポケモンIDでグループ化
 */
type PokemonWithFormsAndRegion = {
  id: number;
  nameJa: string;
  nameEn: string;
  entryNumber: number;
  forms: PokemonFormWithRegion[];
};

export function groupEntriesByPokemon(
  entries: PokedexEntryWithRelations[],
  regionId?: number,
): Record<number, PokemonWithFormsAndRegion> {
  const grouped: Record<number, PokemonWithFormsAndRegion> = {};

  entries
    .filter((entry) => entry.formEntry !== null)
    .forEach((entry) => {
      const formEntry = entry.formEntry!;
      const pokemonId = formEntry.pokemon_id;

      if (!grouped[pokemonId]) {
        grouped[pokemonId] = {
          id: pokemonId,
          nameJa: formEntry.pokemon?.name_ja ?? '',
          nameEn: formEntry.pokemon?.name_en ?? '',
          entryNumber: entry.entry_number,
          forms: [],
        };
      }

      const formData = convertToFormData(formEntry);
      grouped[pokemonId].forms.push(formData);
    });

  // 各ポケモンのフォームをソート（地方フォーム優先）
  Object.values(grouped).forEach((pokemon) => {
    pokemon.forms.sort((a, b) => {
      // 地方IDが指定されている場合、その地方のフォームを優先
      if (regionId) {
        const aRegionId = a.regionId;
        const bRegionId = b.regionId;

        // 両方が同じ地方のフォーム、または両方が地方フォームでない場合
        if (aRegionId === bRegionId) {
          return a.order - b.order;
        }

        // aが指定地方のフォームの場合、優先
        if (aRegionId === regionId) return -1;

        // bが指定地方のフォームの場合、優先
        if (bRegionId === regionId) return 1;
      }

      // 通常のorder順
      return a.order - b.order;
    });
  });

  return grouped;
}

/**
 * ページネーション処理とレスポンス整形
 */
export function paginateAndFormatResults(
  grouped: Record<number, PokemonWithFormsAndRegion>,
  page: number,
  pageSize: number,
): SearchResult {
  const skip = (page - 1) * pageSize;
  const allPokemons = Object.values(grouped).map((pokemon) => ({
    ...pokemon,
    forms: pokemon.forms.map((form) => {
      const { order: _order, regionId: _regionId, ...rest } = form;
      return rest;
    }),
  }));
  const pagedPokemons = allPokemons.slice(skip, skip + pageSize);

  return {
    pokemons: pagedPokemons,
    total: allPokemons.length,
  };
}
