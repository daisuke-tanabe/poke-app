export function findOrThrow<T>(array: T[], predicate: (value: T) => boolean, errorMessage?: string): T {
  const result = array.find(predicate);
  if (!result) {
    throw new Error(errorMessage ?? 'No matching element found');
  }
  return result;
}
