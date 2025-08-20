export function assertFound<T>(value: T | undefined, errorMessage?: string): asserts value is T {
  if (value === undefined) {
    throw new Error(errorMessage ?? '値が見つかりません');
  }
}
