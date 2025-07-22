'use client';

import Image from 'next/image';
import { useState } from 'react';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/card';

import type { PokemonWithForms } from '@/repositories/types';

type PokemonCardListProps = {
  pokemons: PokemonWithForms[];
};

type PokemonCardProps = {
  pokemon: PokemonWithForms;
};

function PokemonCard({ pokemon }: PokemonCardProps) {
  const [currentFormIndex, setCurrentFormIndex] = useState(0);
  const currentForm = pokemon.forms[currentFormIndex];
  const hasMultipleForms = pokemon.forms.length > 1;

  return (
    <Card className="gap-2 rounded-xl border-t border-r border-b border-l border-t-white/70 border-r-white/35 border-b-white/35 border-l-white/70 bg-white/40 py-4 shadow-none backdrop-blur-md dark:border-t-white/15 dark:border-r-white/7.5 dark:border-b-white/7.5 dark:border-l-white/15 dark:bg-white/5">
      <CardHeader className="flex items-center justify-between gap-1 px-4">
        <CardTitle className="text-sm">{pokemon.nameJa}</CardTitle>
        <span className="text-muted-foreground text-sm">#{pokemon.entryNumber}</span>
      </CardHeader>
      <CardContent className="px-4">
        <div className="flex mb-4">
          <div className="flex gap-1">
            {currentForm.types.map((type) => {
              return (
                <div key={type} className="flex h-5 w-5 items-center justify-center">
                  <Image src={`/type-icons/${type}.svg`} alt={type} width={20} height={20} unoptimized />
                </div>
              );
            })}
          </div>
        </div>
        <div className="mb-4 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center">
            <Image
              src={`http://127.0.0.1:54321/storage/v1/object/public${currentForm.spriteDefault}`}
              alt={pokemon.nameEn}
              width={64}
              height={64}
              unoptimized
            />
          </div>
        </div>
        {hasMultipleForms && (
          <div className="flex justify-center gap-1">
            {pokemon.forms.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentFormIndex(index)}
                className={`h-2.5 w-2.5 rounded-full transition-colors ${
                  index === currentFormIndex ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
                }`}
                type="button"
                aria-label={`フォーム ${index + 1}`}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function PokemonCardList({ pokemons }: PokemonCardListProps) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {pokemons.map((pokemon) => (
        <PokemonCard key={pokemon.id} pokemon={pokemon} />
      ))}
    </div>
  );
}
