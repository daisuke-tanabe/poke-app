'use client';

import { useState } from 'react';
import { Button } from '@/components/button';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '@/components/dialog';
import { Input } from '@/components/input';
import { PokedexSelect, PokedexSelectProps } from './PokedexSelect';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { z } from 'zod';

export type PokemonSearchProps = {
  allRegionsWithPokedexes: PokedexSelectProps['regions'];
  allTypes: { id: number; slug: string; nameJa: string; nameEn: string }[];
};

const searchParamsSchema = z.object({
  pokedex: z.string().optional().default('national'),
  type1: z.string().optional().default(''),
  type2: z.string().optional().default(''),
  name: z.string().optional().default(''),
});

export function PokemonSearch({ allRegionsWithPokedexes, allTypes }: PokemonSearchProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const searchParams = useSearchParams();

  // useSearchParamsでクエリパラメータを取得しzodでバリデーション
  const paramsObj = Object.fromEntries(searchParams.entries());
  const parsedParams = searchParamsSchema.safeParse(paramsObj);
  const params = parsedParams.success ? parsedParams.data : searchParamsSchema.parse({});

  const [slug, setSlug] = useState(params.pokedex);
  const [name, setName] = useState(params.name);
  const [selectedTypes, setSelectedTypes] = useState<string[]>(
    [params.type1, params.type2].filter((t): t is string => typeof t === 'string' && t.length > 0),
  );

  const handleTypeToggle = (typeSlug: string) => {
    setSelectedTypes((prev) => {
      if (prev.includes(typeSlug)) return prev.filter((t) => t !== typeSlug);
      if (prev.length < 2) return [...prev, typeSlug];
      return [typeSlug, ...prev.slice(0, 1)];
    });
  };

  const handleApply = () => {
    const [type1 = '', type2 = ''] = selectedTypes;
    router.push(`?pokedex=${slug}&page=1&name=${encodeURIComponent(name)}&type1=${type1}&type2=${type2}`);
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
            <PokedexSelect onChange={setSlug} regions={allRegionsWithPokedexes} value={slug} />
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
              {allTypes.map((type) => {
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
                    <Image src={`/type-icons/${type.slug}.svg`} alt={type.nameEn} width={28} height={28} unoptimized />
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
