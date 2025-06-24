import { PokemonSearchContainer } from './_containers/pokemon-search';
import { PokemonPaginationContainer } from './_containers/pokemon-pagination/container';
import { PokemonGridContainer } from './_containers/pokemon-grid';
import { searchParamsSchema } from '@/lib/searchParamsSchema';

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
      <div className="container mx-auto px-6 max-w-6xl mb-2">
        <div className="flex items-center justify-end">
          <PokemonSearchContainer />
        </div>
      </div>

      <main className="container mx-auto px-6 max-w-6xl">
        <PokemonGridContainer
          currentPage={parsedParams.data.page}
          perPage={20}
          pokemonName={parsedParams.data.name}
          pokedexSlug={parsedParams.data.pokedex}
          types={[parsedParams.data.type1, parsedParams.data.type2]}
        />
        <PokemonPaginationContainer
          currentPage={parsedParams.data.page}
          perPage={20}
          pokemonName={parsedParams.data.name}
          pokedexSlug={parsedParams.data.pokedex}
          types={[parsedParams.data.type1, parsedParams.data.type2]}
        />
      </main>
    </>
  );
}
