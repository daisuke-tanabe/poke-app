import { pokemonRepository } from '@/repositories/pokemonRepository';
import HomeContainer from "./_containers/HomeContainer";

export default async function Home({ searchParams }: { searchParams?: Promise<Record<string, string | string[] | undefined>> }) {
  const params = searchParams ? await searchParams : {};
  // サーバー側で図鑑カテゴリ・リスト・タイプ一覧を取得
  const pokedexOptions = await pokemonRepository.getPokedexMasterData();
  const typeOptions = await pokemonRepository.getAllTypes();
  // クエリパラメータから初期値を取得
  const pokedexSlug = typeof params.pokedex === "string" ? params.pokedex : "national";
  const type1 = typeof params.type1 === "string" ? params.type1 : "all";
  const type2 = typeof params.type2 === "string" ? params.type2 : "all";
  const name = typeof params.name === "string" ? params.name : "";
  const page = typeof params.page === "string" ? Number(params.page) : 1;
  // サーバー側でポケモンリスト・件数を取得
  const { pokemons, total } = await pokemonRepository.getPokemonsWithTotal(
    pokedexSlug,
    page,
    20,
    name,
    type1,
    type2
  );
  return <HomeContainer
    pokedexOptions={pokedexOptions}
    typeOptions={typeOptions}
    searchParams={params}
    pokemons={pokemons}
    total={total}
  />;
}
