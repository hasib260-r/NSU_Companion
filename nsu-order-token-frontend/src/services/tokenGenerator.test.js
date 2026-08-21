import { describe, it, expect } from 'vitest'
import { generateOrderToken, generateUniqueOrderToken } from './tokenGenerator.js'

describe('generateOrderToken', () => {
  it('returns a token matching the "PREFIX-1234" format', () => {
    const token = generateOrderToken('Rongin Bhaat')
    expect(token).toMatch(/^[A-Z]{2}-\d{4}$/)
  })

  it('uses the known stall prefix when available', () => {
    expect(generateOrderToken('Grill Corner')).toMatch(/^GC-\d{4}$/)
    expect(generateOrderToken('Cafe Corner')).toMatch(/^CC-\d{4}$/)
  })

  it('derives a fallback prefix from an unknown stall name', () => {
    expect(generateOrderToken('Noodle House')).toMatch(/^NH-\d{4}$/)
  })

  it('is deterministic when given an injected RNG', () => {
    const fixedRand = () => 0.5 // -> floor(0.5 * 9000) + 1000 = 5500
    expect(generateOrderToken('Rongin Bhaat', fixedRand)).toBe('RB-5500')
  })
})

describe('generateUniqueOrderToken', () => {
  it('does not return a token already in the existing list', () => {
    // Force collisions on the first calls by stubbing Math.random
    const original = Math.random
    const values = [0.5, 0.5, 0.1] // first two collide with RB-5500, third is fresh
    let i = 0
    Math.random = () => values[Math.min(i++, values.length - 1)]

    const token = generateUniqueOrderToken('Rongin Bhaat', ['RB-5500'])
    expect(token).not.toBe('RB-5500')

    Math.random = original
  })

  it('produces tokens with no duplicates across many calls', () => {
    const seen = new Set()
    for (let i = 0; i < 500; i++) {
      const token = generateUniqueOrderToken('Rongin Bhaat', [...seen])
      expect(seen.has(token)).toBe(false)
      seen.add(token)
    }
  })
})
