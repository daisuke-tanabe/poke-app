"use server";
import { pokemonRepository } from '@/features/pokemon/pokemonRepository';

export async function fetchPokemonsByPokedex(
  pokedexSlug: string,
  page: number,
  pageSize: number = 20,
  name: string = "",
  type1: string = "",
  type2: string = ""
) {
  const offset = (page - 1) * pageSize;
  let pokemons, total;
  if (name || type1 || type2) {
    pokemons = await pokemonRepository.findByPokedexAndNameAndTypes(
      pokedexSlug, name, type1, type2, pageSize, offset
    );
    total = await pokemonRepository.countByPokedexAndNameAndTypes(
      pokedexSlug, name, type1, type2
    );
  } else {
    pokemons = await pokemonRepository.findAllByPokedexPaged(pokedexSlug, pageSize, offset);
    total = await pokemonRepository.countByPokedex(pokedexSlug);
  }
  return { pokemons, total };
}
