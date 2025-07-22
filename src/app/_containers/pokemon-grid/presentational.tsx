'use client';

import { PokemonCardList } from './components/PokemonCardList';

import type { PokemonGridPresentationalProps } from './types';

export function PokemonGridPresentational({ pokemons }: PokemonGridPresentationalProps) {
  return (
    <div className="mb-10">
      <PokemonCardList pokemons={pokemons} />
    </div>
  );
}
