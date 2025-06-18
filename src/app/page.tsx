import { pokemonRepository } from '@/features/pokemon/pokemonRepository';
import PokemonSearchClient from "./PokemonSearchClient";

export default async function Home() {
  // サーバー側で図鑑カテゴリ・リストのみ取得
  const pokedexOptions = await pokemonRepository.getPokedexMasterData();
  return <PokemonSearchClient pokedexOptions={pokedexOptions} />;
}
