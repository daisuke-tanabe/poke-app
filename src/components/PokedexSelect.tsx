import * as React from "react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectLabel, SelectItem } from "@/components/ui/select";

export type PokedexGroup = {
  regionId: number;
  regionNameJa: string;
  pokedexes: { slug: string; nameJa: string }[];
};

export type PokedexSelectProps = {
  value: string;
  onChange: (value: string) => void;
  options: PokedexGroup[];
};

export const PokedexSelect: React.FC<PokedexSelectProps> = ({ value, onChange, options }) => {
  return (
    <div>
      <label className="block mb-1 font-bold">図鑑を選択</label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="図鑑を選択" />
        </SelectTrigger>
        <SelectContent>
          {options.map((group) => (
            <SelectGroup key={group.regionId}>
              <SelectLabel>{group.regionNameJa}</SelectLabel>
              {group.pokedexes.map((item) => (
                <SelectItem key={item.slug} value={item.slug}>
                  {item.nameJa}
                </SelectItem>
              ))}
            </SelectGroup>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
