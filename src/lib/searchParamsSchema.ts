import { z } from 'zod';

export const searchParamsSchema = z.object({
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
