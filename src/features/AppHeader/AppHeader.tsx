import Link from 'next/link';

import { ThemeToggleButton } from './_components/ThemeToggleButton';
import packageJson from '../../../package.json';

export function AppHeader() {
  return (
    <header className="mb-6 shadow-[0_1px_0_0_rgba(0,0,0,0.15)] dark:shadow-[0_1px_0_0_rgba(0,0,0,0.4)]">
      <div className="container mx-auto max-w-6xl px-6">
        <div className="flex items-center justify-between py-3">
          <h1 className="flex items-baseline gap-3 text-xl">
            <Link href="/">Pokédex</Link>
            <span className="text-xs">v&thinsp;{packageJson.version}</span>
          </h1>
          <div className="flex items-center justify-between">
            <ThemeToggleButton />
          </div>
        </div>
      </div>
    </header>
  );
}
