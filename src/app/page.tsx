import { pokemonRepository } from '@/repositories/pokemonRepository';
import HomeContainer from './_containers/HomeContainer';

import { z } from 'zod';
import { findOrThrow } from '@/lib/utils';

const searchParamsSchema = z.object({
  pokedex: z.string().optional().default('national'),
  type1: z.string().optional().default(''),
  type2: z.string().optional().default(''),
  name: z.string().optional().default(''),
  page: z
    .string()
    .transform((v) => parseInt(v, 10))
    .refine((v) => !isNaN(v) && v > 0, {
      message: 'ページ番号は1以上の整数である必要があります',
    })
    .optional()
    .default('1'),
});

export default async function Home({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const rawParams = await searchParams;
  const parsedParams = searchParamsSchema.safeParse(rawParams);
  if (!parsedParams.success) throw new Error('Invalid query parameters');

  // public fetch
  const rawAllTypes = await pokemonRepository.getAllTypes();
  const rawAllRegionsWithPokedexes = await pokemonRepository.getAllRegionsWithPokedexes();
  const rawPokemons = await pokemonRepository.getPokemonsWithTotal(
    parsedParams.data.pokedex,
    parsedParams.data.page,
    20,
    parsedParams.data.name,
    parsedParams.data.type1,
    parsedParams.data.type2,
  );

  const mappedPokemons = rawPokemons.pokemons.map(({ pokedexEntries, ...p }) => ({
    ...p,
    pokedexEntry: findOrThrow(pokedexEntries, (e) => e.pokedex.slug === parsedParams.data.pokedex),
  }));

  return (
    <HomeContainer
      pokemons={mappedPokemons}
      total={rawPokemons.total}
      allRegionsWithPokedexes={rawAllRegionsWithPokedexes}
      allTypes={rawAllTypes}
    />
  );
}
