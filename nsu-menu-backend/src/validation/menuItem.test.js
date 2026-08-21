import { describe, it, expect } from 'vitest'
import { validateMenuItemPayload } from './menuItem.js'

const VALID_ITEM = {
  name: 'Chicken Tehari',
  stall: 'Rongin Bhaat',
  category: 'Rice & Curry',
  price: 120,
  prepTimeMinutes: 12,
}

describe('validateMenuItemPayload (create)', () => {
  it('accepts a fully valid payload', () => {
    const result = validateMenuItemPayload(VALID_ITEM)
    expect(result.valid).toBe(true)
    expect(result.errors).toEqual([])
  })

  it('rejects a payload missing required fields', () => {
    const result = validateMenuItemPayload({ name: 'Cold Coffee' })
    expect(result.valid).toBe(false)
    expect(result.errors).toEqual(
      expect.arrayContaining([
        '"stall" is required.',
        '"category" is required.',
        '"price" is required.',
        '"prepTimeMinutes" is required.',
      ]),
    )
  })

  it('rejects a negative price', () => {
    const result = validateMenuItemPayload({ ...VALID_ITEM, price: -10 })
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('"price" must be a non-negative number.')
  })

  it('rejects a non-numeric prepTimeMinutes', () => {
    const result = validateMenuItemPayload({
      ...VALID_ITEM,
      prepTimeMinutes: 'soon',
    })
    expect(result.valid).toBe(false)
    expect(result.errors).toContain(
      '"prepTimeMinutes" must be a non-negative number.',
    )
  })

  it('rejects a non-boolean available flag', () => {
    const result = validateMenuItemPayload({ ...VALID_ITEM, available: 'yes' })
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('"available" must be a boolean.')
  })

  it('rejects null or non-object payloads', () => {
    expect(validateMenuItemPayload(null).valid).toBe(false)
    expect(validateMenuItemPayload('nope').valid).toBe(false)
  })
})

describe('validateMenuItemPayload (partial update)', () => {
  it('allows a partial payload when partial: true', () => {
    const result = validateMenuItemPayload(
      { available: false },
      { partial: true },
    )
    expect(result.valid).toBe(true)
  })

  it('still validates the type of fields that are present', () => {
    const result = validateMenuItemPayload(
      { price: -5 },
      { partial: true },
    )
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('"price" must be a non-negative number.')
  })
})
