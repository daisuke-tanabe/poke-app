"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PokedexSelect, PokedexGroup } from "@/components/PokedexSelect";
import { fetchPokemonsByPokedex } from "@/app/actions/pokemonActions";
import { Pokemon, PokedexEntry, TypeEntry } from "@/generated/prisma";

export type PokemonSearchClientProps = {
  pokedexOptions: PokedexGroup[];
};

const PAGE_SIZE = 20;

export default function PokemonSearchClient({ pokedexOptions }: PokemonSearchClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const slug = searchParams.get("pokedex") || "national";
  const page = Number(searchParams.get("page")) || 1;
  const [pokemons, setPokemons] = useState<
    (Pokemon & { pokedexEntries: PokedexEntry[]; typeEntries: TypeEntry[] })[]
  >([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (slug) {
      (async () => {
        const { pokemons: list, total: count } = await fetchPokemonsByPokedex(slug, page, PAGE_SIZE);
        setPokemons(list);
        setTotal(count);
      })();
    } else {
      setPokemons([]);
      setTotal(0);
    }
  }, [slug, page]);

  const handleChange = (newSlug: string) => {
    router.push(`?pokedex=${newSlug}&page=1`);
  };

  return (
    <main className="p-8">
      <PokedexSelect value={slug} onChange={handleChange} options={pokedexOptions} />
      {slug && (
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
                onClick={() => router.push(`?pokedex=${slug}&page=${i + 1}`)}
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
