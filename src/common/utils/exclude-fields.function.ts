export function ExcludeFieldFunction<T, Key extends keyof T>(
  any: T,
  keys: string[],
): Omit<T, Key> {
  for (const key of keys) {
    delete any[key];
  }
  return any;
}
