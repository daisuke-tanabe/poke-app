import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel,
} from '@/components/select';

import type { Region } from '../types';

type PokedexSelectorProps = {
  value: string;
  onChange: (slug: string) => void;
  regions: Region[];
};

export function PokedexSelector({ value, onChange, regions }: PokedexSelectorProps) {
  return (
    <div>
      <label className="mb-3 block text-sm font-semibold">図鑑</label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="図鑑を選択" />
        </SelectTrigger>
        <SelectContent>
          {regions.map((region) => (
            <SelectGroup key={region.id}>
              <SelectLabel>{region.nameJa}</SelectLabel>
              {region.pokedexes.map((pokedex) => (
                <SelectItem key={pokedex.slug} value={pokedex.slug}>
                  {pokedex.nameJa}
                </SelectItem>
              ))}
            </SelectGroup>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
