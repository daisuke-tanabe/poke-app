import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel,
} from '@/components/select';

export type PokedexGroup = {
  regionId: number;
  regionNameJa: string;
  pokedexes: { slug: string; nameJa: string }[];
};

type Props = {
  value: string;
  onChange: (value: string) => void;
  options: PokedexGroup[];
};

export function PokedexSelect({ value, onChange, options }: Props) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="図鑑を選択" />
      </SelectTrigger>
      <SelectContent>
        {options.map((group) => (
          <SelectGroup key={group.regionId}>
            <SelectLabel>{group.regionNameJa}</SelectLabel>
            {group.pokedexes.map((p) => (
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
