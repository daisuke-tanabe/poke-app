import { searchParamsSchema } from '@/lib/searchParamsSchema';

import { PokemonGridContainer } from './_containers/pokemon-grid';
import { PokemonPaginationContainer } from './_containers/pokemon-pagination';
import { PokemonSearchContainer } from './_containers/pokemon-search';

export default async function Home({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const rawParams = await searchParams;
  const parsedParams = searchParamsSchema.safeParse(rawParams);
  if (!parsedParams.success) throw new Error('Invalid query parameters');

  return (
    <>
      <div className="container mx-auto mb-2 max-w-6xl px-6">
        <div className="flex items-center justify-end">
          <PokemonSearchContainer />
        </div>
      </div>

      <main className="container mx-auto max-w-6xl px-6">
        <PokemonGridContainer
          currentPage={parsedParams.data.page}
          perPage={30}
          pokemonName={parsedParams.data.name}
          pokedexSlug={parsedParams.data.pokedex}
          types={[parsedParams.data.type1, parsedParams.data.type2]}
        />
        <PokemonPaginationContainer
          currentPage={parsedParams.data.page}
          perPage={30}
          pokemonName={parsedParams.data.name}
          pokedexSlug={parsedParams.data.pokedex}
          types={[parsedParams.data.type1, parsedParams.data.type2]}
        />
      </main>
    </>
  );
}
