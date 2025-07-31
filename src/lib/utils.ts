import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function findOrThrow<T>(array: T[], predicate: (value: T) => boolean, errorMessage?: string): T {
  const result = array.find(predicate);
  if (!result) {
    throw new Error(errorMessage ?? 'No matching element found');
  }
  return result;
}

export function assertFound<T>(value: T | undefined, errorMessage?: string): asserts value is T {
  if (value === undefined) {
    throw new Error(errorMessage ?? '値が見つかりません');
  }
}
