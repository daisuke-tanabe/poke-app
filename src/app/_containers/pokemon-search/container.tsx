import { pokemonRepository } from '@/repositories/pokemonRepository';

import { PokemonSearchPresentational } from './presentational';

export async function PokemonSearchContainer() {
  const rawAllTypes = await pokemonRepository.getAllTypes();
  const rawAllRegionsWithPokedexes = await pokemonRepository.getAllRegionsWithPokedexes();

  return <PokemonSearchPresentational allTypes={rawAllTypes} allRegionsWithPokedexes={rawAllRegionsWithPokedexes} />;
}
