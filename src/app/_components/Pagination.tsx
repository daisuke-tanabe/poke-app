import { Button } from "@/components/button";
import React from "react";

export type PaginationProps = {
  total: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  className?: string;
};

export function Pagination({ total, page, pageSize, onPageChange, className = "" }: PaginationProps) {
  const pageCount = Math.ceil(total / pageSize);
  if (pageCount <= 1) return null;
  return (
    <div className={`flex flex-wrap gap-2 justify-center ${className}`}>
      {Array.from({ length: pageCount }, (_, i) => (
        <Button
          key={i + 1}
          variant={page === i + 1 ? "default" : "outline"}
          size="sm"
          onClick={() => onPageChange(i + 1)}
          className={page === i + 1 ? "bg-blue-500 text-white" : ""}
        >
          {i + 1}
        </Button>
      ))}
    </div>
  );
}
