'use client';

import { Button } from '@/components/button';
import React from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { z } from 'zod';

const searchParamsSchema = z.object({
  pokedex: z.string().optional().default('national'),
  type1: z.string().optional().default(''),
  type2: z.string().optional().default(''),
  name: z.string().optional().default(''),
  page: z
    .string()
    .transform((v) => parseInt(v, 10))
    .refine((v) => !isNaN(v) && v > 0, {
      message: 'ページ番号は1以上の整数である必要があります',
    })
    .optional()
    .default('1'),
});

export function Pagination({ total, pageSize }: { total: number; pageSize: number }) {
  const searchParams = useSearchParams();
  const router = useRouter();

  console.log(total, pageSize);

  // useSearchParamsでクエリパラメータを取得し、zodでバリデーション
  const paramsObj = Object.fromEntries(searchParams.entries());
  const parsedParams = searchParamsSchema.safeParse(paramsObj);
  const params = parsedParams.success ? parsedParams.data : searchParamsSchema.parse({});

  const { page, name, pokedex, type1, type2 } = params;
  const pageCount = Math.ceil(total / pageSize);

  const handleClick = (p: number) => {
    router.push(`?pokedex=${pokedex}&page=${p}&name=${encodeURIComponent(name)}&type1=${type1}&type2=${type2}`);
  };

  if (pageCount <= 1) return null;

  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {Array.from({ length: pageCount }, (_, i) => (
        <Button
          key={i + 1}
          variant={page === i + 1 ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleClick(i + 1)}
          className={page === i + 1 ? 'bg-blue-500 text-white' : ''}
        >
          {i + 1}
        </Button>
      ))}
    </div>
  );
}
