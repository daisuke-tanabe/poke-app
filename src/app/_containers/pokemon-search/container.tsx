import { pokemonRepository } from '@/repositories/pokemonRepository';

import { PokemonSearchPresentational } from './presentational';

export async function PokemonSearchContainer() {
  const rawAllTypes = await pokemonRepository.listAllTypes();
  const rawAllRegionsWithPokedexes = await pokemonRepository.listRegionsWithPokedexes();

  return <PokemonSearchPresentational allTypes={rawAllTypes} allRegionsWithPokedexes={rawAllRegionsWithPokedexes} />;
}
