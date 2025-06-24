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
    <div className="grid gap-4 mb-10 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {rawPokemons.map((pokemon) => (
        <Card
          key={pokemon.id}
          className="bg-white/40 dark:bg-white/5 backdrop-blur-md rounded-xl shadow-none
          border-t border-t-white/70 dark:border-t-white/15
          border-l border-l-white/70 dark:border-l-white/15
          border-r border-r-white/35 dark:border-r-white/7.5
          border-b border-b-white/35 dark:border-b-white/7.5"
        >
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{pokemon.nameJa}</CardTitle>
              <span className="text-sm text-muted-foreground">#{pokemon.entryNumber}</span>
            </div>
            <CardDescription className="text-xs">{pokemon.nameEn}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 flex items-center justify-center">
                <Image src={`/pokemons/${pokemon.id}.png`} alt={pokemon.nameEn} width={80} height={80} unoptimized />
              </div>
            </div>
            <div className="flex gap-1">
              {pokemon.forms[0].types.map((type) => {
                return (
                  <div key={type} className="flex items-center justify-center w-7 h-7">
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
