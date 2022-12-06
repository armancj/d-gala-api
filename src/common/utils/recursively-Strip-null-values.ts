export function RecursivelyStripNullValues(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(RecursivelyStripNullValues);
  }
  if (value !== null && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, value]) => [
        key,
        RecursivelyStripNullValues(value),
      ]),
    );
  }
  if (value !== null) {
    return value;
  }
}
