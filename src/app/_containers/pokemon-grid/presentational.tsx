'use client';

import { PokemonCardList } from './components/PokemonCardList';

import type { UIPokemon } from './types';

type PokemonGridPresentationalProps = {
  pokemons: UIPokemon[];
};

export function PokemonGridPresentational({ pokemons }: PokemonGridPresentationalProps) {
  return (
    <div className="mb-10">
      <PokemonCardList pokemons={pokemons} />
    </div>
  );
}
