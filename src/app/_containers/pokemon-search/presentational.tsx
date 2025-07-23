'use client';

import { Button } from '@/components/button';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '@/components/dialog';

import { NameInput } from './components/NameInput';
import { PokedexSelector } from './components/PokedexSelector';
import { TypeSelector } from './components/TypeSelector';
import { useSearchForm } from './hooks/useSearchForm';

import type { PokemonType, Region } from './types';

export type PokemonSearchPresentationalProps = {
  modal?: string;
  allTypes: PokemonType[];
  allRegionsWithPokedexes: Region[];
};

export function PokemonSearchPresentational({ allRegionsWithPokedexes, allTypes }: PokemonSearchPresentationalProps) {
  const { state, actions } = useSearchForm();

  return (
    <Dialog open={state.isOpen} onOpenChange={actions.setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost">Advanced Search</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Advanced Search</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-6 py-6">
          <PokedexSelector value={state.slug} onChange={actions.setPokedex} regions={allRegionsWithPokedexes} />

          <NameInput value={state.name} onChange={actions.setName} />

          <TypeSelector selectedTypes={state.selectedTypes} onToggle={actions.toggleType} allTypes={allTypes} />
        </div>

        <Button onClick={actions.handleApply}>検索</Button>
      </DialogContent>
    </Dialog>
  );
}
