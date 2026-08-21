// Pure filtering logic for FR-2.4 (search + filter by stall/category).
// Deliberately kept free of React so it can be unit tested directly,
// with no rendering or mocking required. useMenuItems.js calls this
// inside a useMemo — the hook owns state, this owns the logic.

/**
 * Filters menu items by name search, stall, and category.
 * @param {Array<{name: string, stall: string, category: string}>} items
 * @param {{ search?: string, stallFilter?: string, categoryFilter?: string }} filters
 * @returns {Array} the filtered items
 */
export function filterMenuItems(items, { search = '', stallFilter = 'All', categoryFilter = 'All' } = {}) {
  const normalizedSearch = search.trim().toLowerCase()

  return items.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(normalizedSearch)
    const matchesStall = stallFilter === 'All' || item.stall === stallFilter
    const matchesCategory =
      categoryFilter === 'All' || item.category === categoryFilter
    return matchesSearch && matchesStall && matchesCategory
  })
}

/**
 * Derives the "All" + unique-value dropdown options for a given field
 * (used for the stall and category filter dropdowns).
 * @param {Array<object>} items
 * @param {string} field
 * @returns {string[]}
 */
export function getFilterOptions(items, field) {
  return ['All', ...new Set(items.map((item) => item[field]))]
}
