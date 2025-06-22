import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/card';
import Image from 'next/image';

export type PokemonCardProps = {
  id: number;
  nameJa: string;
  nameEn: string;
  pokedexEntry: {
    id: number;
    entryNumber: number;
    pokedex: {
      id: number;
      nameJa: string;
      nameEn: string;
      slug: string;
    };
  };
  types: string[];
};

export function PokemonCard({ id, nameJa, nameEn, pokedexEntry, types }: PokemonCardProps) {
  return (
    <Card
      className="bg-white/40 dark:bg-white/5 backdrop-blur-md rounded-xl shadow-none
      border-t border-t-white/70 dark:border-t-white/15
      border-l border-l-white/70 dark:border-l-white/15
      border-r border-r-white/35 dark:border-r-white/7.5
      border-b border-b-white/35 dark:border-b-white/7.5"
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{nameJa}</CardTitle>
          <span className="text-sm text-muted-foreground">#{pokedexEntry.entryNumber}</span>
        </div>
        <CardDescription className="text-xs">{nameEn}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 flex items-center justify-center">
            <Image src={`/pokemons/${id}.png`} alt={nameEn} width={80} height={80} unoptimized />
          </div>
        </div>
        <div className="flex gap-1">
          {types.map((type) => {
            return (
              <div key={type} className="flex items-center justify-center w-7 h-7">
                <Image src={`/type-icons/${type}.svg`} alt={type} width={24} height={24} unoptimized />
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
