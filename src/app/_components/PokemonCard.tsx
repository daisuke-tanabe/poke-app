import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/card";
import Image from "next/image";
import { Pokemon, TypeEntry, Type } from "@prisma/client";
import type { PokedexEntryWithPokedex } from "../_containers/HomeContainer";
import { useState } from "react";

export type PokemonCardProps = {
  pokemon: Pokemon & { pokedexEntries: PokedexEntryWithPokedex[]; typeEntries: TypeEntry[] };
  typeOptions: Type[];
};

function ImageWithFallback({ nationalNo, pokedexId, alt }: { nationalNo: number; pokedexId: number; alt: string }) {
  const [error, setError] = useState(false);
  const src = `/pokemons/${nationalNo}-${pokedexId}.png`;
  return error ? (
    <Image
      src={`/placeholder.svg?height=80&width=80`}
      alt={alt}
      width={80}
      height={80}
      className="rounded-full"
    />
  ) : (
    <Image
      src={src}
      alt={alt}
      width={80}
      height={80}
      className="rounded-full"
      onError={() => setError(true)}
    />
  );
}

export function PokemonCard({ pokemon, typeOptions }: PokemonCardProps) {
  const nationalEntry = pokemon.pokedexEntries.find(e => e.pokedex_id === 1)!;
  const types = pokemon.typeEntries.map(te => {
    const type = typeOptions.find(t => t.id === te.type_id);
    return type ? type.slug : "";
  }).filter(Boolean);

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{pokemon.name_ja}</CardTitle>
          <span className="text-sm text-muted-foreground">
            #{nationalEntry.entry_number.toString().padStart(3, "0")}
          </span>
        </div>
        <CardDescription className="text-xs">{pokemon.name_en}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 flex items-center justify-center">
            <ImageWithFallback
              nationalNo={nationalEntry.entry_number}
              pokedexId={nationalEntry.pokedex_id}
              alt={pokemon.name_ja}
            />
          </div>
        </div>
        <div className="flex gap-1">
          {types.map((type) => {
            const typeObj = typeOptions.find(t => t.slug === type);
            return (
              <div key={type} className="flex items-center justify-center w-7 h-7">
                <Image
                  src={`/type-icons/${type}.svg`}
                  alt={typeObj?.name_ja || type}
                  width={24}
                  height={24}
                  className="inline-block align-middle"
                  unoptimized
                />
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
