import React from 'react';
import { pokemonRepository } from '@/repositories/pokemonRepository';
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
  const { total } = await pokemonRepository.getPokedexEntriesWithForms(
    pokedexSlug,
    currentPage,
    perPage,
    pokemonName,
    types[0],
    types[1],
  );

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
