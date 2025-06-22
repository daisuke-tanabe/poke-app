import { PokemonSearch, PokemonSearchProps } from '../_components/PokemonSearch';
import { Pagination } from '../_components/Pagination';
import { PokemonGrid, PokemonGridProps } from '../_components/PokemonGrid';
import { ThemeToggleButton } from '../_components/ThemeToggleButton';

export type PokemonSearchClientProps = {
  allRegionsWithPokedexes: PokemonSearchProps['allRegionsWithPokedexes'];
  allTypes: PokemonSearchProps['allTypes'];
  pokemons: PokemonGridProps['pokemons'];
  total: number;
};

function HomeContainer({ allRegionsWithPokedexes, pokemons, total, allTypes }: PokemonSearchClientProps) {
  return (
    <div>
      <div className="mb-6 shadow-[0_1px_0_0_rgba(0,0,0,0.15)] dark:shadow-[0_1px_0_0_rgba(0,0,0,0.4)]">
        <header className="container mx-auto px-6 max-w-6xl">
          <div className="flex items-center justify-between py-3">
            <h1 className="text-xl">Pokédex</h1>
            <div className="flex items-center justify-between">
              <ThemeToggleButton />
            </div>
          </div>
        </header>
      </div>

      <div className="container mx-auto px-6 max-w-6xl mb-2">
        <div className="flex items-center justify-end">
          <PokemonSearch allRegionsWithPokedexes={allRegionsWithPokedexes} allTypes={allTypes} />
        </div>
      </div>

      <main className="container mx-auto px-6 max-w-6xl">
        <PokemonGrid pokemons={pokemons} />
        <Pagination pageSize={20} total={total} />
      </main>
    </div>
  );
}

export default HomeContainer;
