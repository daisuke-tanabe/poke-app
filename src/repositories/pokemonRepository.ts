import { prisma } from '@/lib/prisma';

import { createPokemonRepository } from './pokemonRepositoryFactory';

// Prismaクライアントの型互換性のため、unknownを経由して安全な型変換を実行
export const pokemonRepository = createPokemonRepository(
  prisma as unknown as Parameters<typeof createPokemonRepository>[0],
);
