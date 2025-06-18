"use server";
import { pokemonRepository } from '@/features/pokemon/pokemonRepository';

export async function fetchPokemonsByPokedex(pokedexSlug: string, page: number, pageSize: number = 20) {
  const offset = (page - 1) * pageSize;
  const pokemons = await pokemonRepository.findAllByPokedexPaged(pokedexSlug, pageSize, offset);
  const total = await pokemonRepository.countByPokedex(pokedexSlug);
  return { pokemons, total };
}
