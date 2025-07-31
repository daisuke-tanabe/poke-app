import React from 'react';

import { searchPokedexEntriesWithForms } from '@/repositories/pokemon';

import { PokemonSearchPresentational } from './presentational';

export type PokemonPaginationContainerProps = {
  currentPage: number;
  perPage: number;
  pokemonName: string;
  pokedexSlug: string;
  types: [string, string];
};

export async function PokemonPaginationContainer({
  currentPage,
  perPage,
  pokemonName,
  pokedexSlug,
  types,
}: PokemonPaginationContainerProps) {
  const { total } = await searchPokedexEntriesWithForms({
    pokedexSlug,
    page: currentPage,
    pageSize: perPage,
    name: pokemonName,
    type1: types[0],
    type2: types[1],
  });

  return (
    <PokemonSearchPresentational
      pokedexSlug={pokedexSlug}
      pokemonName={pokemonName}
      types={types}
      currentPage={currentPage}
      perPage={perPage}
      total={total}
    />
  );
}
