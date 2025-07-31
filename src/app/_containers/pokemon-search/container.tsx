import { listAllTypes, listRegionsWithPokedexes } from '@/repositories/pokemon';

import { PokemonSearchPresentational } from './presentational';

export async function PokemonSearchContainer() {
  const rawAllTypes = await listAllTypes();
  const rawAllRegionsWithPokedexes = await listRegionsWithPokedexes();

  return <PokemonSearchPresentational allTypes={rawAllTypes} allRegionsWithPokedexes={rawAllRegionsWithPokedexes} />;
}
