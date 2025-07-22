'use client';

import { PokemonCardList } from './components/PokemonCardList';

import type { PokemonWithForms } from '@/repositories/types';

type PokemonGridPresentationalProps = {
  pokemons: PokemonWithForms[];
};

export function PokemonGridPresentational({ pokemons }: PokemonGridPresentationalProps) {
  return (
    <div className="mb-10">
      <PokemonCardList pokemons={pokemons} />
    </div>
  );
}
