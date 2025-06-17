import { pokemonRepository } from '@/features/pokemon/pokemonRepository';

export default async function Home() {
  // 全国図鑑ID=1のポケモン一覧を取得
  const pokemons = await pokemonRepository.findAllByPokedex(1);

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">全国図鑑のポケモン一覧({pokemons.length})</h1>
      <ul>
        {pokemons.map((p) => (
          <li key={p.id} className="mb-2">
            {p.name_ja} / {p.name_en} / {p.name_kana}
          </li>
        ))}
      </ul>
    </main>
  );
}
