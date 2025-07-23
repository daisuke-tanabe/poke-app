import type { DatabaseFormEntry, PokedexEntryWithRelations } from '../types';

// 型ガード関数群
export function isNumber(value: unknown): value is number {
  return typeof value === 'number';
}

export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

/**
 * FormEntryデータの型安全変換
 */
export function transformFormEntryData(formEntryData: unknown): DatabaseFormEntry | null {
  if (!isObject(formEntryData)) return null;

  const {
    id,
    pokemon_id: pokemonId,
    order,
    sprite_default: spriteDefault,
    sprite_shiny: spriteShiny,
    pokemon,
    form,
    typeEntries,
  } = formEntryData;

  if (!isNumber(id) || !isNumber(pokemonId) || !isNumber(order) || !isString(spriteDefault) || !isString(spriteShiny)) {
    return null;
  }

  const pokemonData = isObject(pokemon)
    ? {
        name_ja: isString(pokemon.name_ja) ? pokemon.name_ja : '',
        name_en: isString(pokemon.name_en) ? pokemon.name_en : '',
      }
    : null;

  const formData = isObject(form)
    ? {
        name_ja: isString(form.name_ja) ? form.name_ja : '',
        name_en: isString(form.name_en) ? form.name_en : '',
      }
    : null;

  const typeEntriesData = Array.isArray(typeEntries)
    ? typeEntries
        .filter(isObject)
        .map((te) => {
          const type = te.type;
          if (!isObject(type) || !isString(type.slug)) return null;
          return { type: { slug: type.slug } };
        })
        .filter((te): te is { type: { slug: string } } => te !== null)
    : undefined;

  return {
    id,
    pokemon_id: pokemonId,
    order,
    sprite_default: spriteDefault,
    sprite_shiny: spriteShiny,
    pokemon: pokemonData,
    form: formData,
    typeEntries: typeEntriesData,
  };
}

/**
 * ポケモンエントリのデータ変換
 */
export function transformPokedexEntry(rawEntry: unknown): PokedexEntryWithRelations | null {
  if (!isObject(rawEntry)) return null;

  const { entry_number: entryNumber, formEntry: rawFormEntry } = rawEntry;

  if (!isNumber(entryNumber) || !rawFormEntry) return null;

  const formEntry = transformFormEntryData(rawFormEntry);
  if (!formEntry) return null;

  return {
    entry_number: entryNumber,
    formEntry,
  };
}
