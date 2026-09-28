export const defaultSlotCapacity = 1;
export const maxSlotCapacity = 99;

export function normalizeSlotCapacity(
  value: number | string | undefined,
): number {
  const parsed = typeof value === "string" ? Number.parseInt(value, 10) : value;

  if (parsed === undefined || !Number.isFinite(parsed)) {
    return defaultSlotCapacity;
  }

  const integer = Math.trunc(parsed);
  if (integer < 1) {
    return defaultSlotCapacity;
  }

  return Math.min(integer, maxSlotCapacity);
}
