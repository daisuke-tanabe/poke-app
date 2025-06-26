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
    <div className="mb-10 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {rawPokemons.map((pokemon) => (
        <Card
          key={pokemon.id}
          className="gap-4 rounded-xl border-t border-r border-b border-l border-t-white/70 border-r-white/35 border-b-white/35 border-l-white/70 bg-white/40 py-4 shadow-none backdrop-blur-md dark:border-t-white/15 dark:border-r-white/7.5 dark:border-b-white/7.5 dark:border-l-white/15 dark:bg-white/5"
        >
          <CardHeader className="gap-1 px-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">{pokemon.nameJa}</CardTitle>
              <span className="text-muted-foreground text-sm">#{pokemon.entryNumber}</span>
            </div>
            <CardDescription className="text-xs">{pokemon.nameEn}</CardDescription>
          </CardHeader>
          <CardContent className="px-4">
            <div className="mb-4 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center">
                <Image src={pokemon.forms[0].sprite} alt={pokemon.nameEn} width={64} height={64} unoptimized />
              </div>
            </div>
            <div className="flex gap-1">
              {pokemon.forms[0].types.map((type) => {
                return (
                  <div key={type} className="flex h-5 w-5 items-center justify-center">
                    <Image src={`/type-icons/${type}.svg`} alt={type} width={20} height={20} unoptimized />
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
