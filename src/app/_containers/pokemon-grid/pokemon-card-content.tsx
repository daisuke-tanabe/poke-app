'use client';

import Image from 'next/image';
import { useState } from 'react';

import { CardContent } from '@/components/card';

import type { PokemonWithForms } from '@/repositories/types';

type PokemonCardContentProps = {
  pokemon: PokemonWithForms;
};

export function PokemonCardContent({ pokemon }: PokemonCardContentProps) {
  const [currentFormIndex, setCurrentFormIndex] = useState(0);
  const currentForm = pokemon.forms[currentFormIndex];
  const hasMultipleForms = pokemon.forms.length > 1;

  return (
    <>
      <div className="mb-1 flex px-4">
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
      <CardContent className="px-4">
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
    </>
  );
}
