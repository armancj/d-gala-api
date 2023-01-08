import { isDate } from "class-validator";

export function RecursivelyStripNullValues(value: unknown): unknown {
  if (isDate(value)) return value;
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
  return value === null ? '' : value;
}
