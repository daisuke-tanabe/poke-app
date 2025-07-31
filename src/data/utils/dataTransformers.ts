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
 * タイプエントリから重複を除去してスラッグ配列を生成
 */
function extractUniqueTypes(typeEntries: { type: { slug: string } }[] = []): string[] {
  return Array.from(new Set(typeEntries.map((te) => te.type.slug)));
}

/**
 * フォームエントリをPokemonFormに変換
 */
export function convertToFormData(formEntry: FormEntryWithRelations): PokemonFormWithOrder {
  const { spriteDefault, spriteShiny } = extractSpriteInfo(formEntry);
  const types = extractUniqueTypes(formEntry.typeEntries);

  return {
    id: formEntry.id,
    nameJa: formEntry.form?.name_ja ?? '',
    nameEn: formEntry.form?.name_en ?? '',
    types,
    spriteDefault,
    spriteShiny,
    order: formEntry.order,
  };
}

/**
 * 単一エントリをグループに追加またはグループを新規作成
 */
function addOrCreatePokemonGroup(
  grouped: Record<number, PokemonWithFormsAndOrder>,
  entry: PokedexEntryWithRelations,
  formEntry: FormEntryWithRelations,
): void {
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
}

/**
 * フォームを順序でソート
 */
function sortFormsByOrder(pokemon: PokemonWithFormsAndOrder): PokemonWithFormsAndOrder {
  return {
    ...pokemon,
    forms: pokemon.forms.sort((a, b) => a.order - b.order),
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
      addOrCreatePokemonGroup(grouped, entry, entry.formEntry!);
    });

  // 各ポケモンのフォームを順序でソート
  Object.keys(grouped).forEach((pokemonId) => {
    grouped[Number(pokemonId)] = sortFormsByOrder(grouped[Number(pokemonId)]);
  });

  return grouped;
}

/**
 * フォームからorder属性を除去
 */
function removeOrderFromForms(pokemon: PokemonWithFormsAndOrder): PokemonWithForms {
  return {
    ...pokemon,
    forms: pokemon.forms.map(({ order: _order, ...rest }) => rest),
  };
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
  const allPokemons = Object.values(grouped).map(removeOrderFromForms);
  const pagedPokemons = allPokemons.slice(skip, skip + pageSize);

  return {
    pokemons: pagedPokemons,
    total: allPokemons.length,
  };
}
