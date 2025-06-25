import Image from 'next/image';

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/card';
import { pokemonRepository } from '@/repositories/pokemonRepository';

export type PokemonGridContainerProps = {
  currentPage: number;
  perPage: number;
  pokemonName: string;
  pokedexSlug: string;
  types: [string, string];
};

export async function PokemonGridContainer({
  currentPage,
  perPage,
  pokemonName,
  pokedexSlug,
  types,
}: PokemonGridContainerProps) {
  const { pokemons: rawPokemons } = await pokemonRepository.getPokedexEntriesWithForms(
    pokedexSlug,
    currentPage,
    perPage,
    pokemonName,
    types[0],
    types[1],
  );

  return (
    <div className="mb-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {rawPokemons.map((pokemon) => (
        <Card
          key={pokemon.id}
          className="rounded-xl border-t border-r border-b border-l border-t-white/70 border-r-white/35 border-b-white/35 border-l-white/70 bg-white/40 shadow-none backdrop-blur-md dark:border-t-white/15 dark:border-r-white/7.5 dark:border-b-white/7.5 dark:border-l-white/15 dark:bg-white/5"
        >
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{pokemon.nameJa}</CardTitle>
              <span className="text-muted-foreground text-sm">#{pokemon.entryNumber}</span>
            </div>
            <CardDescription className="text-xs">{pokemon.nameEn}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6 flex justify-center">
              <div className="flex h-24 w-24 items-center justify-center">
                <Image src={pokemon.forms[0].sprite} alt={pokemon.nameEn} width={80} height={80} unoptimized />
              </div>
            </div>
            <div className="flex gap-1">
              {pokemon.forms[0].types.map((type) => {
                return (
                  <div key={type} className="flex h-7 w-7 items-center justify-center">
                    <Image src={`/type-icons/${type}.svg`} alt={type} width={24} height={24} unoptimized />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
