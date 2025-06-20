import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 配列から条件に一致する要素を返し、見つからなければErrorをthrowするユーティリティ関数
 */
export function findOrThrow<T>(array: T[], predicate: (value: T) => boolean, errorMessage?: string): T {
  const result = array.find(predicate);
  if (!result) {
    throw new Error(errorMessage ?? 'No matching element found');
  }
  return result;
}

/**
 * undefinedの場合にErrorをthrowするアサーション関数
 */
export function assertFound<T>(value: T | undefined, errorMessage?: string): asserts value is T {
  if (value === undefined) {
    throw new Error(errorMessage ?? '値が見つかりません');
  }
}
