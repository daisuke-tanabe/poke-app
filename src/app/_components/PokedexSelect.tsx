'use client';

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel,
} from '@/components/select';

export type PokedexSelectProps = {
  onChange: (value: string) => void;
  regions: {
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
  value: string;
};

export function PokedexSelect({ onChange, regions, value }: PokedexSelectProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="図鑑を選択" />
      </SelectTrigger>
      <SelectContent>
        {regions.map((region) => (
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
  );
}
