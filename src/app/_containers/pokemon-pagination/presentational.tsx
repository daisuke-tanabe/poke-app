'use client';

import { useRouter } from 'next/navigation';

import { Button } from '@/components/button';

type PokemonSearchPresentationalProps = {
  currentPage: number;
  perPage: number;
  pokedexSlug: string;
  pokemonName: string;
  types: [string, string];
  total: number;
};

export function PokemonSearchPresentational({
  currentPage,
  perPage,
  pokedexSlug,
  pokemonName,
  types,
  total,
}: PokemonSearchPresentationalProps) {
  const router = useRouter();

  const pageCount = Math.ceil(total / perPage);

  const handleClick = (p: number) => {
    router.push(
      `?pokedex=${pokedexSlug}&page=${p}&name=${encodeURIComponent(pokemonName)}&type1=${types[0]}&type2=${types[1]}`,
    );
  };

  if (pageCount <= 1) return null;

  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {Array.from({ length: pageCount }, (_, i) => (
        <Button
          key={i + 1}
          variant={currentPage === i + 1 ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleClick(i + 1)}
          className={currentPage === i + 1 ? 'bg-blue-500 text-white' : ''}
        >
          {i + 1}
        </Button>
      ))}
    </div>
  );
}
