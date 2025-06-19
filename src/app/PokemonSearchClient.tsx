"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PokedexSelect, PokedexGroup } from "@/components/PokedexSelect";
import { fetchPokemonsByPokedex } from "@/app/actions/pokemonActions";
import { Pokemon, PokedexEntry, TypeEntry, Type } from "@/generated/prisma";

export type PokemonSearchClientProps = {
  pokedexOptions: PokedexGroup[];
  typeOptions: Type[];
};

const PAGE_SIZE = 20;

export default function PokemonSearchClient({ pokedexOptions, typeOptions }: PokemonSearchClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialSlug = searchParams.get("pokedex") || "national";
  const initialType1 = searchParams.get("type1") || "";
  const initialType2 = searchParams.get("type2") || "";
  const initialName = searchParams.get("name") || "";
  const page = Number(searchParams.get("page")) || 1;
  const [pokemons, setPokemons] = useState<
    (Pokemon & { pokedexEntries: PokedexEntry[]; typeEntries: TypeEntry[] })[]
  >([]);
  const [total, setTotal] = useState(0);
  const [searchName, setSearchName] = useState(initialName);
  const [selectedSlug, setSelectedSlug] = useState(initialSlug);
  const [selectedType1, setSelectedType1] = useState(initialType1);
  const [selectedType2, setSelectedType2] = useState(initialType2);

  useEffect(() => {
    (async () => {
      const { pokemons: list, total: count } = await fetchPokemonsByPokedex(
        initialSlug,
        page,
        PAGE_SIZE,
        initialName,
        initialType1,
        initialType2
      );
      setPokemons(list);
      setTotal(count);
    })();
  }, [initialSlug, page, initialName, initialType1, initialType2]);

  const handleSelectChange = (newSlug: string) => setSelectedSlug(newSlug);
  const handleType1Change = (e: React.ChangeEvent<HTMLSelectElement>) => setSelectedType1(e.target.value);
  const handleType2Change = (e: React.ChangeEvent<HTMLSelectElement>) => setSelectedType2(e.target.value);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(
      `?pokedex=${selectedSlug}&page=1&name=${encodeURIComponent(searchName)}&type1=${selectedType1}&type2=${selectedType2}`
    );
  };

  return (
    <main className="p-8">
      <form onSubmit={handleSearch} className="flex flex-col gap-2 mb-4 max-w-md">
        <div>
          <label className="block mb-1 font-bold">ポケモンを検索</label>
          <PokedexSelect value={selectedSlug} onChange={handleSelectChange} options={pokedexOptions} />
        </div>
        <div>
          <label className="block mb-1 font-bold">タイプ1を選択</label>
          <select className="border rounded px-2 py-1 w-full" value={selectedType1} onChange={handleType1Change}>
            <option value="">すべて</option>
            {typeOptions.map((t) => (
              <option key={t.id} value={t.id}>{t.name_ja}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-1 font-bold">タイプ2を選択</label>
          <select className="border rounded px-2 py-1 w-full" value={selectedType2} onChange={handleType2Change}>
            <option value="">すべて</option>
            {typeOptions.map((t) => (
              <option key={t.id} value={t.id}>{t.name_ja}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-1 font-bold">名前を入力</label>
          <input
            type="text"
            value={searchName}
            onChange={e => setSearchName(e.target.value)}
            placeholder=""
            className="border px-2 py-1 rounded w-full"
          />
        </div>
        <button type="submit" className="px-3 py-1 border rounded bg-blue-500 text-white w-full">検索</button>
      </form>
      {initialSlug && (
        <>
          <h1 className="text-2xl font-bold mb-4 mt-4">ポケモン一覧({total})</h1>
          <ul>
            {pokemons.map((p) => (
              <li key={p.id} className="mb-2">
                {p.name_ja} / {p.name_en} / {p.name_kana}
              </li>
            ))}
          </ul>
          {/* ページャー */}
          <div className="mt-4 flex gap-2">
            {Array.from({ length: Math.ceil(total / PAGE_SIZE) }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => router.push(`?pokedex=${initialSlug}&page=${i + 1}&name=${encodeURIComponent(initialName)}&type1=${initialType1}&type2=${initialType2}`)}
                className={`px-3 py-1 border rounded ${page === i + 1 ? 'bg-blue-500 text-white' : ''}`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </>
      )}
    </main>
  );
}
