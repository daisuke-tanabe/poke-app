"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PokedexSelect, PokedexGroup } from "@/components/PokedexSelect";
import { fetchPokemonsByPokedex } from "@/app/actions/pokemonActions";
import { Pokemon, PokedexEntry, TypeEntry, Type } from "@/generated/prisma";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
  const initialType1 = searchParams.get("type1") || "all";
  const initialType2 = searchParams.get("type2") || "all";
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
  const handleType1Change = (value: string) => setSelectedType1(value);
  const handleType2Change = (value: string) => setSelectedType2(value);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(
      `?pokedex=${selectedSlug}&page=1&name=${encodeURIComponent(searchName)}&type1=${selectedType1 === "all" ? "" : selectedType1}&type2=${selectedType2 === "all" ? "" : selectedType2}`
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
      <form onSubmit={handleSearch} className="flex flex-col gap-4 mb-6 max-w-md bg-white/80 rounded-xl p-6 shadow">
        <div>
          <label className="block mb-1 font-semibold text-sm text-muted-foreground">ポケモンを検索</label>
          <PokedexSelect value={selectedSlug} onChange={handleSelectChange} options={pokedexOptions} />
        </div>
        <div className="flex gap-2">
          <div className="flex-1">
            <label className="block mb-1 font-semibold text-sm text-muted-foreground">タイプ1</label>
            <Select value={selectedType1} onValueChange={handleType1Change}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="すべて" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">すべて</SelectItem>
                {typeOptions.map((t) => (
                  <SelectItem key={t.id} value={String(t.id)}>{t.name_ja}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1">
            <label className="block mb-1 font-semibold text-sm text-muted-foreground">タイプ2</label>
            <Select value={selectedType2} onValueChange={handleType2Change}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="すべて" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">すべて</SelectItem>
                {typeOptions.map((t) => (
                  <SelectItem key={t.id} value={String(t.id)}>{t.name_ja}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div>
          <label className="block mb-1 font-semibold text-sm text-muted-foreground">名前</label>
          <Input
            type="text"
            value={searchName}
            onChange={e => setSearchName(e.target.value)}
            placeholder="例: ピカチュウ"
            className="w-full"
          />
        </div>
        <Button type="submit" className="w-full font-semibold">検索</Button>
      </form>
      {initialSlug && (
        <>
          <h1 className="text-2xl font-bold mb-4 mt-4">ポケモン一覧({total})</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {pokemons.map((p) => {
              const nationalEntry = p.pokedexEntries.find(e => e.pokedex_id === 1);
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
                  <Badge key={te.type_id} className={`${color}`}>{type?.name_ja}</Badge>
                );
              });
              const pokedexBadges = p.pokedexEntries.filter(e => e.pokedex_id !== 1).map(e => {
                const name = e.pokedex?.name_ja || `図鑑${e.pokedex_id}`;
                return (
                  <Badge key={e.pokedex_id} variant="secondary" className="text-xs px-2 py-0.5 mr-1">
                    {name} #{e.entry_number}
                  </Badge>
                );
              });
              return (
                <Card key={p.id} className="hover:shadow-lg transition-shadow relative">
                  {/* 全国図鑑番号を右上に */}
                  <span className="absolute top-2 right-4 text-xs text-muted-foreground font-bold">{nationalEntry ? `#${nationalEntry.entry_number}` : '-'}</span>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex flex-col gap-0.5 text-xl">
                      <span className="font-bold leading-tight">{p.name_ja}</span>
                      <span className="text-sm text-muted-foreground font-normal">{p.name_en}</span>
                    </CardTitle>
                  </CardHeader>
                  {/* 画像スケルトン */}
                  <div className="flex justify-center items-center h-32 my-2">
                    <div className="w-24 h-24 bg-gray-200 rounded-lg animate-pulse flex items-center justify-center">
                      <span className="text-xs text-gray-400">No Image</span>
                    </div>
                  </div>
                  <CardContent className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      {typeBadges}
                    </div>
                    <div className="flex flex-wrap gap-1 items-center">
                      {pokedexBadges}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          {/* ページャー */}
          <div className="mt-6 flex flex-wrap gap-2 justify-center">
            {Array.from({ length: Math.ceil(total / PAGE_SIZE) }, (_, i) => (
              <Button
                key={i + 1}
                variant={page === i + 1 ? "default" : "outline"}
                size="sm"
                onClick={() => router.push(`?pokedex=${initialSlug}&page=${i + 1}&name=${encodeURIComponent(initialName)}&type1=${initialType1}&type2=${initialType2}`)}
                className={page === i + 1 ? "bg-blue-500 text-white" : ""}
              >
                {i + 1}
              </Button>
            ))}
          </div>
        </>
      )}
    </main>
  );
}
