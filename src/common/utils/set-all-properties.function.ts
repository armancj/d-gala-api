export function SetAllProperties(
  interfaceGeneric: any,
  value: boolean,
): unknown {
  const updatedGeneric: unknown = { ...interfaceGeneric };
  Object.keys(updatedGeneric).forEach((key) => {
    updatedGeneric[key] = value;
  });
  return updatedGeneric;
}
