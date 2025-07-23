import Image from 'next/image';

import type { PokemonType } from '../types';

type TypeSelectorProps = {
  selectedTypes: string[];
  onToggle: (typeSlug: string) => void;
  allTypes: PokemonType[];
};

export function TypeSelector({ selectedTypes, onToggle, allTypes }: TypeSelectorProps) {
  return (
    <div>
      <label className="mb-3 block text-sm font-semibold">タイプ</label>
      <div className="flex flex-wrap gap-4">
        {allTypes.map((type) => {
          const isSelected = selectedTypes.includes(type.slug);
          return (
            <button
              key={type.id}
              type="button"
              onClick={() => onToggle(type.slug)}
              aria-pressed={isSelected}
              className={`rounded-full ${isSelected ? 'scale-110 opacity-100' : 'opacity-30'} transition hover:opacity-70`}
            >
              <Image src={`/type-icons/${type.slug}.svg`} alt={type.nameEn} width={28} height={28} unoptimized />
            </button>
          );
        })}
      </div>
    </div>
  );
}
