"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pokemon, PokedexEntry, TypeEntry, Type } from "@prisma/client";
import { PokemonFilterDialog } from "../_components/PokemonFilterDialog";
import { PokemonCard } from "../_components/PokemonCard";
import { Pagination } from "../_components/Pagination";
import type { PokedexGroup } from "../_components/PokedexSelect";

export type PokemonSearchClientProps = {
  pokedexOptions: PokedexGroup[];
  typeOptions: Type[];
  searchParams?: { [key: string]: string | string[] | undefined };
  pokemons: (Pokemon & { pokedexEntries: PokedexEntryWithPokedex[]; typeEntries: TypeEntry[] })[];
  total: number;
};

// pokedexEntriesにpokedexリレーションを含める型
export type PokedexEntryWithPokedex = PokedexEntry & { pokedex?: { name_ja: string; slug: string } };

const PAGE_SIZE = 20;

// pokedexId→pokedex情報の逆引きマップを作成
const pokedexIdMap: Record<number, { slug: string; nameJa: string }> = {};

function AntiCorruptionPokemonSearchClient({ pokedexOptions, typeOptions, searchParams = {}, pokemons, total }: PokemonSearchClientProps) {
  const router = useRouter();
  const initialSlug = typeof searchParams.pokedex === "string" ? searchParams.pokedex : "national";
  const initialType1 = typeof searchParams.type1 === "string" ? searchParams.type1 : "all";
  const initialType2 = typeof searchParams.type2 === "string" ? searchParams.type2 : "all";
  const initialName = typeof searchParams.name === "string" ? searchParams.name : "";
  const page = typeof searchParams.page === "string" ? Number(searchParams.page) : 1;
  const [searchName, setSearchName] = useState(initialName);
  const [selectedSlug, setSelectedSlug] = useState(initialSlug);
  const [selectedType1, setSelectedType1] = useState(initialType1);
  const [selectedType2, setSelectedType2] = useState(initialType2);

  const handleFilterApply = (slug: string, type1: string, type2: string, name: string) => {
    setSelectedSlug(slug);
    setSelectedType1(type1);
    setSelectedType2(type2);
    setSearchName(name);
    router.push(
      `?pokedex=${slug}&page=1&name=${encodeURIComponent(name)}&type1=${type1 === "all" ? "" : type1}&type2=${type2 === "all" ? "" : type2}`
    );
  };

  // pokedexIdMapを作成
  pokedexOptions.forEach(group => {
    group.pokedexes.forEach((px: { slug: string; nameJa: string }) => {
      const id = Number(px.slug);
      if (!isNaN(id)) {
        pokedexIdMap[id] = { slug: px.slug, nameJa: px.nameJa };
      }
    });
  });

  return (
    <main>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">ポケモン図鑑検索</h1>
          <p className="text-muted-foreground">図鑑を選択してポケモンを検索できます</p>
        </div>

        <PokemonFilterDialog
          pokedexOptions={pokedexOptions}
          typeOptions={typeOptions}
          initialSlug={selectedSlug}
          initialType1={selectedType1}
          initialType2={selectedType2}
          initialName={searchName}
          onApply={handleFilterApply}
        />
      </div>
      
      {initialSlug && (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {pokemons.map((p) => (
              <PokemonCard key={p.id} pokemon={p} typeOptions={typeOptions} />
            ))}
          </div>
          <Pagination
            total={total}
            page={page}
            pageSize={PAGE_SIZE}
            onPageChange={(p) => router.push(`?pokedex=${initialSlug}&page=${p}&name=${encodeURIComponent(initialName)}&type1=${initialType1}&type2=${initialType2}`)}
            className="mt-6"
          />
        </>
      )}
    </main>
  );
}

export default AntiCorruptionPokemonSearchClient;
