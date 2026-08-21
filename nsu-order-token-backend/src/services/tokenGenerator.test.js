import { describe, it, expect } from 'vitest'
import { generateOrderToken } from './tokenGenerator.js'

describe('generateOrderToken', () => {
  it('returns a token matching the "PREFIX-1234" format', () => {
    expect(generateOrderToken('Rongin Bhaat')).toMatch(/^[A-Z]{2}-\d{4}$/)
  })

  it('uses the known stall prefix when available', () => {
    expect(generateOrderToken('Grill Corner')).toMatch(/^GC-\d{4}$/)
    expect(generateOrderToken('Cafe Corner')).toMatch(/^CC-\d{4}$/)
  })

  it('derives a fallback prefix from an unknown stall name', () => {
    expect(generateOrderToken('Noodle House')).toMatch(/^NH-\d{4}$/)
  })

  it('falls back to "ST" for an empty or missing stall name', () => {
    expect(generateOrderToken('')).toMatch(/^ST-\d{4}$/)
  })

  it('is deterministic when given an injected RNG', () => {
    const fixedRand = () => 0.5 // -> floor(0.5 * 9000) + 1000 = 5500
    expect(generateOrderToken('Rongin Bhaat', fixedRand)).toBe('RB-5500')
  })

  it('always produces a 4-digit numeric suffix between 1000 and 9999', () => {
    for (let i = 0; i < 200; i++) {
      const token = generateOrderToken('Rongin Bhaat')
      const number = Number(token.split('-')[1])
      expect(number).toBeGreaterThanOrEqual(1000)
      expect(number).toBeLessThanOrEqual(9999)
    }
  })
})
