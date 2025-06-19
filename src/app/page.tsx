import { pokemonRepository } from '@/features/pokemon/pokemonRepository';
import PokemonSearchClient from "./PokemonSearchClient";

export default async function Home() {
  // サーバー側で図鑑カテゴリ・リスト・タイプ一覧を取得
  const pokedexOptions = await pokemonRepository.getPokedexMasterData();
  const typeOptions = await pokemonRepository.getAllTypes();
  return <PokemonSearchClient pokedexOptions={pokedexOptions} typeOptions={typeOptions} />;
}
