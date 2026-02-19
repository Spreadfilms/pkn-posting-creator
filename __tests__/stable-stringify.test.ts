import { stableStringify } from '../src/lib/stable-stringify'

describe('stableStringify', () => {
  test('identical output for same object regardless of key order', () => {
    const a = { z: 1, a: 2, m: 3 }
    const b = { m: 3, a: 2, z: 1 }
    expect(stableStringify(a)).toBe(stableStringify(b))
  })

  test('nested objects are also sorted', () => {
    const a = { z: { b: 1, a: 2 }, a: { y: 3, x: 4 } }
    const b = { a: { x: 4, y: 3 }, z: { a: 2, b: 1 } }
    expect(stableStringify(a)).toBe(stableStringify(b))
  })

  test('arrays preserve order', () => {
    const a = { arr: [1, 2, 3] }
    const b = { arr: [1, 2, 3] }
    expect(stableStringify(a)).toBe(stableStringify(b))
    expect(stableStringify({ arr: [1, 3, 2] })).not.toBe(stableStringify(a))
  })

  test('null and undefined handling', () => {
    expect(stableStringify(null)).toBe('null')
    expect(stableStringify(undefined)).toBe(undefined)
    expect(stableStringify({ a: null })).toBe('{"a":null}')
  })

  test('primitive values', () => {
    expect(stableStringify(42)).toBe('42')
    expect(stableStringify('hello')).toBe('"hello"')
    expect(stableStringify(true)).toBe('true')
  })

  test('complex PostingConfig-like object', () => {
    const config1 = {
      format: '1:1',
      postType: 'event',
      brandSettings: { primaryColor: '#01AAD5', secondaryColor: '#1D1D1B' },
      headline: 'Test',
    }
    const config2 = {
      brandSettings: { secondaryColor: '#1D1D1B', primaryColor: '#01AAD5' },
      headline: 'Test',
      postType: 'event',
      format: '1:1',
    }
    expect(stableStringify(config1)).toBe(stableStringify(config2))
  })
})
