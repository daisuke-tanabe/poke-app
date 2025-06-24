import { ThemeToggleButton } from '../../_components/ThemeToggleButton';

export function HeaderContainer() {
  return (
    <header className="mb-6 shadow-[0_1px_0_0_rgba(0,0,0,0.15)] dark:shadow-[0_1px_0_0_rgba(0,0,0,0.4)]">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="flex items-center justify-between py-3">
          <h1 className="text-xl">Pokédex</h1>
          <div className="flex items-center justify-between">
            <ThemeToggleButton />
          </div>
        </div>
      </div>
    </header>
  );
}
