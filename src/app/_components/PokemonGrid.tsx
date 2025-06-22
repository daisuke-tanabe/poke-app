import { PokemonCard, PokemonCardProps } from './PokemonCard';

export type PokemonGridProps = {
  pokemons: PokemonCardProps[];
};

export async function PokemonGrid({ pokemons }: PokemonGridProps) {
  return (
    <div className="grid gap-4 mb-10 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {pokemons.map((pokemon) => (
        <PokemonCard key={pokemon.id} {...pokemon} />
      ))}
    </div>
  );
}
