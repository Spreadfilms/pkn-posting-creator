/**
 * Test determinism of star position generation.
 * The same count must always produce the same positions.
 */

// Inline the function to test without Next.js dependency
function generateStarPositions(count: number) {
  const stars = []
  for (let i = 0; i < count; i++) {
    const x = ((i * 2654435761) >>> 0) % 10000 / 100
    const y = ((i * 1234567891) >>> 0) % 10000 / 100
    const op = (((i * 987654321) >>> 0) % 50) / 100 + 0.2
    stars.push({ top: `${y}%`, left: `${x}%`, opacity: op })
  }
  return stars
}

describe('generateStarPositions (determinism)', () => {
  test('same count produces identical results', () => {
    const a = generateStarPositions(60)
    const b = generateStarPositions(60)
    expect(JSON.stringify(a)).toBe(JSON.stringify(b))
  })

  test('different counts produce different results', () => {
    const a = generateStarPositions(30)
    const b = generateStarPositions(60)
    expect(JSON.stringify(a)).not.toBe(JSON.stringify(b))
  })

  test('no Math.random used - results are deterministic across calls', () => {
    for (let run = 0; run < 5; run++) {
      const result = generateStarPositions(100)
      // i=0: x=0, y=0 (deterministic, based on formula)
      expect(result[0].top).toBe('0%')
      expect(result[0].left).toBe('0%')
      // i=1: deterministic value
      expect(result[1].left).toBe('57.61%')
    }
  })
})
