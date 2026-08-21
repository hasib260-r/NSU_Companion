import { describe, it, expect } from 'vitest'
import { filterMenuItems, getFilterOptions } from './filterMenuItems.js'

const ITEMS = [
  { name: 'Chicken Tehari', stall: 'Rongin Bhaat', category: 'Rice & Curry' },
  { name: 'Beef Kala Bhuna', stall: 'Rongin Bhaat', category: 'Rice & Curry' },
  { name: 'Chicken Shawarma Roll', stall: 'Grill Corner', category: 'Fast Food' },
  { name: 'Cold Coffee', stall: 'Cafe Corner', category: 'Beverages' },
]

describe('filterMenuItems', () => {
  it('returns all items when no filters are applied', () => {
    expect(filterMenuItems(ITEMS)).toHaveLength(4)
  })

  it('filters by search term, case-insensitively', () => {
    const result = filterMenuItems(ITEMS, { search: 'chicken' })
    expect(result.map((i) => i.name)).toEqual([
      'Chicken Tehari',
      'Chicken Shawarma Roll',
    ])
  })

  it('trims whitespace from the search term', () => {
    const result = filterMenuItems(ITEMS, { search: '  cold  ' })
    expect(result).toHaveLength(1)
    expect(result[0].name).toBe('Cold Coffee')
  })

  it('filters by stall', () => {
    const result = filterMenuItems(ITEMS, { stallFilter: 'Rongin Bhaat' })
    expect(result).toHaveLength(2)
    expect(result.every((i) => i.stall === 'Rongin Bhaat')).toBe(true)
  })

  it('filters by category', () => {
    const result = filterMenuItems(ITEMS, { categoryFilter: 'Fast Food' })
    expect(result).toHaveLength(1)
    expect(result[0].name).toBe('Chicken Shawarma Roll')
  })

  it('combines search, stall, and category filters together', () => {
    const result = filterMenuItems(ITEMS, {
      search: 'chicken',
      stallFilter: 'Rongin Bhaat',
      categoryFilter: 'Rice & Curry',
    })
    expect(result).toHaveLength(1)
    expect(result[0].name).toBe('Chicken Tehari')
  })

  it('returns an empty array when nothing matches', () => {
    const result = filterMenuItems(ITEMS, { search: 'pizza' })
    expect(result).toEqual([])
  })

  it('treats "All" as a no-op filter for stall and category', () => {
    const result = filterMenuItems(ITEMS, {
      stallFilter: 'All',
      categoryFilter: 'All',
    })
    expect(result).toHaveLength(4)
  })
})

describe('getFilterOptions', () => {
  it('includes "All" plus each unique value for the given field', () => {
    expect(getFilterOptions(ITEMS, 'stall')).toEqual([
      'All',
      'Rongin Bhaat',
      'Grill Corner',
      'Cafe Corner',
    ])
  })

  it('does not repeat values that appear on multiple items', () => {
    const options = getFilterOptions(ITEMS, 'category')
    const riceCount = options.filter((o) => o === 'Rice & Curry').length
    expect(riceCount).toBe(1)
  })

  it('returns just ["All"] for an empty item list', () => {
    expect(getFilterOptions([], 'stall')).toEqual(['All'])
  })
})
