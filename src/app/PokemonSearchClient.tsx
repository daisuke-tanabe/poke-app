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

// pokedexEntriesにpokedexリレーションを含める型
export type PokedexEntryWithPokedex = PokedexEntry & { pokedex?: { name_ja: string; slug: string } };

const PAGE_SIZE = 20;

// pokedexId→pokedex情報の逆引きマップを作成
const pokedexIdMap: Record<number, { slug: string; nameJa: string }> = {};

export default function PokemonSearchClient({ pokedexOptions, typeOptions }: PokemonSearchClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialSlug = searchParams.get("pokedex") || "national";
  const initialType1 = searchParams.get("type1") || "";
  const initialType2 = searchParams.get("type2") || "";
  const initialName = searchParams.get("name") || "";
  const page = Number(searchParams.get("page")) || 1;
  const [pokemons, setPokemons] = useState<
    (Pokemon & { pokedexEntries: PokedexEntryWithPokedex[]; typeEntries: TypeEntry[] })[]
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

  // pokedexIdMapを作成
  pokedexOptions.forEach(group => {
    group.pokedexes.forEach(px => {
      const id = Number(px.slug);
      if (!isNaN(id)) {
        pokedexIdMap[id] = { slug: px.slug, nameJa: px.nameJa };
      }
    });
  });

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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {pokemons.map((p) => {
              // 全国図鑑番号（全国図鑑のエントリを優先）
              const nationalEntry = p.pokedexEntries.find(e => e.pokedex_id === 1);
              // タイプバッジ
              const typeBadges = p.typeEntries.map((te) => {
                const type = typeOptions.find(t => t.id === te.type_id);
                const colorMap: Record<string, string> = {
                  fire: 'bg-red-500', water: 'bg-blue-400', grass: 'bg-green-500', electric: 'bg-yellow-400',
                  ice: 'bg-cyan-300', fighting: 'bg-orange-700', poison: 'bg-purple-500', ground: 'bg-yellow-700',
                  flying: 'bg-indigo-300', psychic: 'bg-pink-400', bug: 'bg-lime-500', rock: 'bg-yellow-800',
                  ghost: 'bg-indigo-800', dragon: 'bg-purple-700', dark: 'bg-gray-700', steel: 'bg-gray-400', fairy: 'bg-pink-300', normal: 'bg-gray-200',
                };
                const color = type ? colorMap[type.slug] || 'bg-gray-300' : 'bg-gray-300';
                return (
                  <span key={te.type_id} className={`text-xs text-white px-2 py-1 rounded mr-1 ${color}`}>{type?.name_ja}</span>
                );
              });
              // 所属地方図鑑バッジ
              const pokedexBadges = p.pokedexEntries.filter(e => e.pokedex_id !== 1).map(e => {
                const name = e.pokedex?.name_ja || `図鑑${e.pokedex_id}`;
                return (
                  <span key={e.pokedex_id} className="text-xs border rounded px-2 py-0.5 bg-gray-100 mr-1">
                    {name} #{e.entry_number}
                  </span>
                );
              });
              return (
                <div key={p.id} className="border rounded shadow p-4 bg-white flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold">{p.name_ja}</span>
                    <span className="text-sm text-gray-500">{p.name_en}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-600">全国図鑑番号: {nationalEntry ? `#${nationalEntry.entry_number}` : '-'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {typeBadges}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {pokedexBadges.length > 0 && <span className="text-xs text-gray-500">所属地方図鑑:</span>}
                    {pokedexBadges}
                  </div>
                </div>
              );
            })}
          </div>
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
