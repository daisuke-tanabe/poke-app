'use client';
import { useState } from 'react';
import { Button } from '@/components/button';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '@/components/dialog';
import { Input } from '@/components/input';
import { PokedexSelect } from './PokedexSelect';
import type { PokedexGroup } from './PokedexSelect';
import { Type } from '@prisma/client';
import Image from 'next/image';

export type PokemonFilterDialogProps = {
  pokedexOptions: PokedexGroup[];
  typeOptions: Type[];
  initialSlug: string;
  initialType1: string;
  initialType2: string;
  initialName: string;
  onApply: (slug: string, type1: string, type2: string, name: string) => void;
};

export function PokemonSearch({
  pokedexOptions,
  typeOptions,
  initialSlug,
  initialType1,
  initialType2,
  initialName,
  onApply,
}: PokemonFilterDialogProps) {
  const [slug, setSlug] = useState(initialSlug);
  const [selectedTypes, setSelectedTypes] = useState<string[]>(
    [initialType1, initialType2].filter((t) => t && t !== 'all'),
  );
  const [name, setName] = useState(initialName);
  const [open, setOpen] = useState(false);

  const handleTypeToggle = (typeSlug: string) => {
    setSelectedTypes((prev) =>
      prev.includes(typeSlug)
        ? prev.filter((t) => t !== typeSlug)
        : prev.length < 2
          ? [...prev, typeSlug]
          : [typeSlug, ...prev.slice(0, 1)],
    );
  };

  const handleApply = () => {
    // typeOptionsからslug→id変換（slugがなければ'all'）
    const type1 = selectedTypes[0] ? String(typeOptions.find((t) => t.slug === selectedTypes[0])?.id ?? 'all') : 'all';
    const type2 = selectedTypes[1] ? String(typeOptions.find((t) => t.slug === selectedTypes[1])?.id ?? 'all') : 'all';
    onApply(slug, type1, type2, name);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost">Advanced Search</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Advanced Search</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-6 py-6">
          {/* 図鑑 */}
          <div>
            <label className="block mb-3 font-semibold text-sm">図鑑</label>
            <PokedexSelect value={slug} onChange={setSlug} options={pokedexOptions} />
          </div>

          {/* 名前 */}
          <div>
            <label className="block mb-3 font-semibold text-sm">名前</label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="例: ピカチュウ"
              className="w-full"
            />
          </div>

          {/* タイプ、2つまで複数選択可能（アイコン形式） */}
          <div>
            <label className="block mb-3 font-semibold text-sm">タイプ</label>
            <div className="flex flex-wrap gap-4">
              {typeOptions.map((type) => {
                const selected = selectedTypes.includes(type.slug);
                return (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => handleTypeToggle(type.slug)}
                    aria-pressed={selected}
                    className={`
                      rounded-full
                      ${selected ? 'opacty-100 scale-120' : 'opacity-30'}
                      transition
                    `}
                  >
                    <Image src={`/type-icons/${type.slug}.svg`} alt={type.name_ja} width={28} height={28} unoptimized />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <Button onClick={handleApply}>検索</Button>
      </DialogContent>
    </Dialog>
  );
}
