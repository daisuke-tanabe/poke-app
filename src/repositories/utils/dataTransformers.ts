import type {
  FormEntryWithRelations,
  PokemonFormWithOrder,
  PokedexEntryWithRelations,
  PokemonWithFormsAndOrder,
  PokemonWithForms,
  SearchResult,
} from '../types';

/**
 * スプライト情報を安全に取得
 */
export function extractSpriteInfo(formEntry: FormEntryWithRelations): {
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
export function convertToFormData(formEntry: FormEntryWithRelations): PokemonFormWithOrder {
  const { spriteDefault, spriteShiny } = extractSpriteInfo(formEntry);

  // タイプの重複を除去
  const uniqueTypes = Array.from(
    new Set((formEntry.typeEntries ?? []).map((te: { type: { slug: string } }) => te.type.slug)),
  );

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
export function groupEntriesByPokemon(entries: PokedexEntryWithRelations[]): Record<number, PokemonWithFormsAndOrder> {
  const grouped: Record<number, PokemonWithFormsAndOrder> = {};

  for (const entry of entries) {
    const formEntry = entry.formEntry;
    if (!formEntry) continue;

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
    grouped[pokemonId].forms.sort((a: PokemonFormWithOrder, b: PokemonFormWithOrder) => a.order - b.order);
  }

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

  const allPokemons: PokemonWithForms[] = Object.values(grouped).map((pokemon) => ({
    ...pokemon,
    forms: pokemon.forms.map(({ order: _order, ...rest }) => rest),
  }));

  const pagedPokemons = allPokemons.slice(skip, skip + pageSize);
  return { pokemons: pagedPokemons, total: allPokemons.length };
}
