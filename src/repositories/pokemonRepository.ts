import { prisma } from '@/lib/prisma';

import { createPokemonRepository } from './pokemonRepositoryFactory';

export const pokemonRepository = createPokemonRepository(prisma);
