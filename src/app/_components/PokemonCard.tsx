import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/card";
import { Badge } from "@/components/badge";
import Image from "next/image";
import { Pokemon, TypeEntry, Type } from "@prisma/client";
import type { PokedexEntryWithPokedex } from "../_containers/HomeContainer";

export type PokemonCardProps = {
  pokemon: Pokemon & { pokedexEntries: PokedexEntryWithPokedex[]; typeEntries: TypeEntry[] };
  typeOptions: Type[];
};

const typeColors: { [key: string]: string } = {
  normal: "bg-gray-400",
  fire: "bg-red-500",
  water: "bg-blue-500",
  electric: "bg-yellow-400",
  grass: "bg-green-500",
  ice: "bg-blue-200",
  fighting: "bg-red-700",
  poison: "bg-purple-500",
  ground: "bg-yellow-600",
  flying: "bg-indigo-400",
  psychic: "bg-pink-500",
  bug: "bg-green-400",
  rock: "bg-yellow-800",
  ghost: "bg-purple-700",
  dragon: "bg-indigo-700",
  dark: "bg-gray-800",
  steel: "bg-gray-500",
  fairy: "bg-pink-300",
};

export function PokemonCard({ pokemon, typeOptions }: PokemonCardProps) {
  const nationalEntry = pokemon.pokedexEntries.find(e => e.pokedex_id === 1);
  const regionalEntries = pokemon.pokedexEntries.filter(e => e.pokedex_id !== 1);
  const types = pokemon.typeEntries.map(te => {
    const type = typeOptions.find(t => t.id === te.type_id);
    return type ? type.slug : "";
  }).filter(Boolean);

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{pokemon.name_ja}</CardTitle>
          {nationalEntry && (
            <span className="text-sm text-muted-foreground">
              #{nationalEntry.entry_number.toString().padStart(3, "0")}
            </span>
          )}
        </div>
        <CardDescription className="text-xs">{pokemon.name_en}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
            <Image
              src={`/placeholder.svg?height=80&width=80`}
              alt={pokemon.name_ja}
              width={80}
              height={80}
              className="rounded-full"
            />
          </div>
        </div>
        <div className="space-y-3">
          <div>
            <div className="flex gap-1 mb-3">
              {types.map((type) => (
                <Badge
                  key={type}
                  variant="secondary"
                  className={`text-white text-xs ${typeColors[type] || "bg-gray-400"}`}
                >
                  {typeOptions.find(t => t.slug === type)?.name_ja || type}
                </Badge>
              ))}
            </div>
          </div>
          {/* 地方図鑑バッジ */}
          <div className="flex flex-wrap gap-1">
            {regionalEntries.map((entry) => (
              <Badge key={entry.pokedex?.slug || entry.pokedex_id} variant="outline" className="text-xs">
                {entry.pokedex?.name_ja || `図鑑${entry.pokedex_id}`} #{entry.entry_number.toString().padStart(3, "0")}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
