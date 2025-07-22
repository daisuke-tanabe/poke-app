import { pokemonRepository } from '@/repositories/pokemonRepository';

import { PokemonGridPresentational } from './presentational';

import type { UIPokemon } from './types';
import type { PokemonWithForms } from '@/repositories/types';

export type PokemonGridContainerProps = {
  currentPage: number;
  perPage: number;
  pokemonName: string;
  pokedexSlug: string;
  types: [string, string];
};

function mapToUIPokemon(repositoryPokemon: PokemonWithForms): UIPokemon {
  return {
    id: repositoryPokemon.id,
    nameJa: repositoryPokemon.nameJa,
    nameEn: repositoryPokemon.nameEn,
    entryNumber: repositoryPokemon.entryNumber,
    forms: repositoryPokemon.forms.map((form) => ({
      types: form.types,
      spriteDefault: form.spriteDefault,
    })),
  };
}

export async function PokemonGridContainer({
  currentPage,
  perPage,
  pokemonName,
  pokedexSlug,
  types,
}: PokemonGridContainerProps) {
  const { pokemons: rawPokemons } = await pokemonRepository.searchPokedexEntriesWithForms({
    pokedexSlug,
    page: currentPage,
    pageSize: perPage,
    name: pokemonName,
    type1: types[0],
    type2: types[1],
  });

  const uiPokemons = rawPokemons.map(mapToUIPokemon);

  return <PokemonGridPresentational pokemons={uiPokemons} />;
}
