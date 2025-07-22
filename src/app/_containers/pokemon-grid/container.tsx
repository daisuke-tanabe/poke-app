import { Card, CardHeader, CardTitle, CardDescription } from '@/components/card';
import { pokemonRepository } from '@/repositories/pokemonRepository';

import { PokemonCardContent } from './pokemon-card-content';

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
  const { pokemons: rawPokemons } = await pokemonRepository.searchPokedexEntriesWithForms({
    pokedexSlug,
    page: currentPage,
    pageSize: perPage,
    name: pokemonName,
    type1: types[0],
    type2: types[1],
  });

  return (
    <div className="mb-10 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {rawPokemons.map((pokemon) => (
        <Card
          key={pokemon.id}
          className="gap-2 rounded-xl border-t border-r border-b border-l border-t-white/70 border-r-white/35 border-b-white/35 border-l-white/70 bg-white/40 py-4 shadow-none backdrop-blur-md dark:border-t-white/15 dark:border-r-white/7.5 dark:border-b-white/7.5 dark:border-l-white/15 dark:bg-white/5"
        >
          <CardHeader className="gap-1 px-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">{pokemon.nameJa}</CardTitle>
              <span className="text-muted-foreground text-sm">#{pokemon.entryNumber}</span>
            </div>
            <CardDescription className="text-xs">{pokemon.nameEn}</CardDescription>
          </CardHeader>
          <PokemonCardContent pokemon={pokemon} />
        </Card>
      ))}
    </div>
  );
}
