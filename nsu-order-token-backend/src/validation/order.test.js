import { describe, it, expect } from 'vitest'
import { validateOrderPayload } from './order.js'

const VALID_ORDER = {
  stall: 'Rongin Bhaat',
  studentName: 'Tahmid Rahman',
  items: [{ name: 'Chicken Tehari', qty: 1, price: 120 }],
}

describe('validateOrderPayload', () => {
  it('accepts a fully valid payload', () => {
    const result = validateOrderPayload(VALID_ORDER)
    expect(result.valid).toBe(true)
    expect(result.errors).toEqual([])
  })

  it('rejects a payload missing stall or studentName', () => {
    const result = validateOrderPayload({ items: VALID_ORDER.items })
    expect(result.valid).toBe(false)
    expect(result.errors).toEqual(
      expect.arrayContaining([
        '"stall" is required and must be a string.',
        '"studentName" is required and must be a string.',
      ]),
    )
  })

  it('rejects an empty items array', () => {
    const result = validateOrderPayload({ ...VALID_ORDER, items: [] })
    expect(result.valid).toBe(false)
    expect(result.errors).toContain(
      '"items" is required and must be a non-empty array.',
    )
  })

  it('rejects an item with a non-positive quantity', () => {
    const result = validateOrderPayload({
      ...VALID_ORDER,
      items: [{ name: 'Cold Coffee', qty: 0, price: 90 }],
    })
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('items[0].qty must be a positive number.')
  })

  it('rejects an item with a negative price', () => {
    const result = validateOrderPayload({
      ...VALID_ORDER,
      items: [{ name: 'Cold Coffee', qty: 1, price: -5 }],
    })
    expect(result.valid).toBe(false)
    expect(result.errors).toContain(
      'items[0].price must be a non-negative number.',
    )
  })

  it('rejects null or non-object payloads', () => {
    expect(validateOrderPayload(null).valid).toBe(false)
    expect(validateOrderPayload('nope').valid).toBe(false)
  })
})
