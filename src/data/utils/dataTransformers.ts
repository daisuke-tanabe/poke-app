import type {
  FormEntryWithRelations,
  PokemonFormWithOrder,
  PokedexEntryWithRelations,
  PokemonWithFormsAndOrder,
  SearchResult,
} from '../types';

/**
 * フォームエントリをPokemonFormに変換
 */
export function convertToFormData(formEntry: FormEntryWithRelations): PokemonFormWithOrder {
  const types = Array.from(new Set((formEntry.typeEntries ?? []).map((te) => te.type.slug)));

  return {
    id: formEntry.id,
    nameJa: formEntry.form?.name_ja ?? '',
    nameEn: formEntry.form?.name_en ?? '',
    types,
    spriteDefault: formEntry.sprite_default,
    spriteShiny: formEntry.sprite_shiny,
    order: formEntry.order,
  };
}

/**
 * 図鑑エントリをポケモンIDでグループ化
 */
export function groupEntriesByPokemon(entries: PokedexEntryWithRelations[]): Record<number, PokemonWithFormsAndOrder> {
  const grouped: Record<number, PokemonWithFormsAndOrder> = {};

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

  // 各ポケモンのフォームを順序でソート
  Object.values(grouped).forEach((pokemon) => {
    pokemon.forms.sort((a, b) => a.order - b.order);
  });

  return grouped;
}

/**
 * ページネーション処理とレスポンス整形
 */
export function paginateAndFormatResults(
  grouped: Record<number, PokemonWithFormsAndOrder>,
  page: number,
  pageSize: number,
): SearchResult {
  const skip = (page - 1) * pageSize;
  const allPokemons = Object.values(grouped).map((pokemon) => ({
    ...pokemon,
    forms: pokemon.forms.map(({ order: _order, ...rest }) => rest),
  }));
  const pagedPokemons = allPokemons.slice(skip, skip + pageSize);

  return {
    pokemons: pagedPokemons,
    total: allPokemons.length,
  };
}
