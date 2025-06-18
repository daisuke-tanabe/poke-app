import React from 'react';

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
      <select
        className="border rounded px-2 py-1"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((group) => (
          <optgroup key={group.regionId} label={group.regionNameJa}>
            {group.pokedexes.map((item) => (
              <option key={item.slug} value={item.slug}>
                {item.nameJa}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
    </div>
  );
};
