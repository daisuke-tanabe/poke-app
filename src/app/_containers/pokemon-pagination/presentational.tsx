'use client';

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/pagination';

type PokemonSearchPresentationalProps = {
  currentPage: number;
  perPage: number;
  pokedexSlug: string;
  pokemonName: string;
  types: [string, string];
  total: number;
};

export function PokemonSearchPresentational({
  currentPage,
  perPage,
  pokedexSlug,
  pokemonName,
  types,
  total,
}: PokemonSearchPresentationalProps) {
  const pageCount = Math.ceil(total / perPage);

  const createPageUrl = (page: number) => {
    return `?pokedex=${pokedexSlug}&page=${page}&name=${encodeURIComponent(pokemonName)}&type1=${types[0]}&type2=${types[1]}`;
  };

  if (pageCount <= 1) return null;

  const renderPageNumbers = () => {
    const items = [];
    const maxVisiblePages = 5;

    if (pageCount <= maxVisiblePages) {
      for (let i = 1; i <= pageCount; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink href={createPageUrl(i)} isActive={currentPage === i}>
              {i}
            </PaginationLink>
          </PaginationItem>,
        );
      }
    } else {
      items.push(
        <PaginationItem key={1}>
          <PaginationLink href={createPageUrl(1)} isActive={currentPage === 1}>
            1
          </PaginationLink>
        </PaginationItem>,
      );

      if (currentPage > 3) {
        items.push(
          <PaginationItem key="ellipsis-start">
            <PaginationEllipsis />
          </PaginationItem>,
        );
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(pageCount - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink href={createPageUrl(i)} isActive={currentPage === i}>
              {i}
            </PaginationLink>
          </PaginationItem>,
        );
      }

      if (currentPage < pageCount - 2) {
        items.push(
          <PaginationItem key="ellipsis-end">
            <PaginationEllipsis />
          </PaginationItem>,
        );
      }

      if (pageCount > 1) {
        items.push(
          <PaginationItem key={pageCount}>
            <PaginationLink href={createPageUrl(pageCount)} isActive={currentPage === pageCount}>
              {pageCount}
            </PaginationLink>
          </PaginationItem>,
        );
      }
    }

    return items;
  };

  return (
    <Pagination>
      <PaginationContent>
        {currentPage > 1 && (
          <PaginationItem>
            <PaginationPrevious href={createPageUrl(currentPage - 1)} />
          </PaginationItem>
        )}

        {renderPageNumbers()}

        {currentPage < pageCount && (
          <PaginationItem>
            <PaginationNext href={createPageUrl(currentPage + 1)} />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
}
