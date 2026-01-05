/**
 * Safe way to retrieve a value from an array with circular indexing
 * Handles negative indices and wraps around array bounds
 * @param values - Array to retrieve value from
 * @returns Function that takes an index and returns the value at that position
 */
export const getValueAt =
  <T>(values: T[]) =>
  (index: number): T | undefined => {
    if (values.length === 0) return undefined

    const len = values.length
    // It ensures the result is always between: 0 and len - 1
    const normalizedIndex = ((index % len) + len) % len

    return values[normalizedIndex]
  }
