/**
 * Deterministic JSON stringify with sorted keys.
 * Guarantees identical output for identical inputs, regardless of key insertion order.
 */
export function stableStringify(value: unknown): string {
  if (value === null || value === undefined) {
    return JSON.stringify(value)
  }

  if (Array.isArray(value)) {
    return '[' + value.map(stableStringify).join(',') + ']'
  }

  if (typeof value === 'object') {
    const obj = value as Record<string, unknown>
    const keys = Object.keys(obj).sort()
    const pairs = keys.map((k) => {
      return JSON.stringify(k) + ':' + stableStringify(obj[k])
    })
    return '{' + pairs.join(',') + '}'
  }

  return JSON.stringify(value)
}
