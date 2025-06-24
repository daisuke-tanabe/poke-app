'use client';

import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/components/button';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '@/components/dialog';
import { Input } from '@/components/input';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel,
} from '@/components/select';
import { searchParamsSchema } from '@/lib/searchParamsSchema';

export type PokemonSearchPresentationalProps = {
  modal?: string;
  allTypes: {
    id: number;
    slug: string;
    nameJa: string;
    nameEn: string;
  }[];
  allRegionsWithPokedexes: {
    id: number;
    nameJa: string;
    nameEn: string;
    pokedexes: {
      id: number;
      slug: string;
      nameJa: string;
      nameEn: string;
    }[];
  }[];
};

export function PokemonSearchPresentational({ allRegionsWithPokedexes, allTypes }: PokemonSearchPresentationalProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // useSearchParamsでクエリパラメータを取得しzodでバリデーション
  const paramsObj = Object.fromEntries(searchParams.entries());
  const parsedParams = searchParamsSchema.safeParse(paramsObj);
  const params = parsedParams.success ? parsedParams.data : searchParamsSchema.parse({});

  const [isOpen, setIsOpen] = useState(false);
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
    setIsOpen(false);
  };

  const handleOpenChange = () => {
    setIsOpen((prevState) => !prevState);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
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
            <Select value={slug} onValueChange={setSlug}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="図鑑を選択" />
              </SelectTrigger>
              <SelectContent>
                {allRegionsWithPokedexes.map((region) => (
                  <SelectGroup key={region.id}>
                    <SelectLabel>{region.nameJa}</SelectLabel>
                    {region.pokedexes.map((p) => (
                      <SelectItem key={p.slug} value={p.slug}>
                        {p.nameJa}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                ))}
              </SelectContent>
            </Select>
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
                const isSelected = selectedTypes.includes(type.slug);
                return (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => handleTypeToggle(type.slug)}
                    aria-pressed={isSelected}
                    className={`
                      rounded-full
                      ${isSelected ? 'opacty-100 scale-120' : 'opacity-30'}
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
