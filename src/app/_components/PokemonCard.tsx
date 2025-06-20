import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/card';
import Image from 'next/image';
import { Pokemon, TypeEntry, Type } from '@prisma/client';
import type { PokedexEntryWithPokedex } from '../_containers/HomeContainer';
import { findOrThrow } from '@/lib/utils';
import { useState } from 'react';

export type PokemonCardProps = {
  pokemon: Pokemon & { pokedexEntries: PokedexEntryWithPokedex[]; typeEntries: TypeEntry[] };
  typeOptions: Type[];
  searchPokedexSlug: string;
};

export function PokemonCard({ pokemon, typeOptions, searchPokedexSlug }: PokemonCardProps) {
  // 図鑑エントリ取得
  const pokedexEntry = findOrThrow(
    pokemon.pokedexEntries,
    (e) => e.pokedex?.slug === searchPokedexSlug,
    'pokedexEntry not found for this pokemon and searchPokedexSlug',
  );

  // タイプslug配列
  const types = pokemon.typeEntries.map((te) => typeOptions.find((t) => t.id === te.type_id)?.slug).filter(Boolean);

  // 画像エラー管理
  const [imgError, setImgError] = useState(false);
  const imageSrc = imgError
    ? '/pokemons/placeholder.png'
    : `/pokemons/${pokedexEntry.entry_number}-${pokedexEntry.pokedex_id}.png`;
  const imageSize = imgError ? 32 : 80;

  return (
    <Card
      className="bg-white/40 dark:bg-white/5 backdrop-blur-md rounded-xl shadow-none
      border-t border-t-white/70 dark:border-t-white/15
      border-l border-l-white/70 dark:border-l-white/15
      border-r border-r-white/35 dark:border-r-white/7.5
      border-b border-b-white/35 dark:border-b-white/7.5"
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{pokemon.name_ja}</CardTitle>
          <span className="text-sm text-muted-foreground">#{pokedexEntry.entry_number}</span>
        </div>
        <CardDescription className="text-xs">{pokemon.name_en}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 flex items-center justify-center">
            <Image
              src={imageSrc}
              alt={pokemon.name_ja}
              width={imageSize}
              height={imageSize}
              onError={() => setImgError(true)}
              unoptimized
            />
          </div>
        </div>
        <div className="flex gap-1">
          {types.map((type) => {
            const typeObj = typeOptions.find((t) => t.slug === type);
            if (!typeObj) return null;
            return (
              <div key={type} className="flex items-center justify-center w-7 h-7">
                <Image src={`/type-icons/${type}.svg`} alt={typeObj.name_ja} width={24} height={24} unoptimized />
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
