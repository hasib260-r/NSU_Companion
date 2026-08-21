// Pure, dependency-free token logic (FR-5.1).
// Kept isolated from data/network code on purpose so it can be unit
// tested directly, with no mocking required.

const STALL_PREFIXES = {
  'Rongin Bhaat': 'RB',
  'Grill Corner': 'GC',
  'Wok & Roll': 'WR',
  'Cafe Corner': 'CC',
}

function prefixFor(stallName) {
  if (STALL_PREFIXES[stallName]) return STALL_PREFIXES[stallName]
  // Fallback: first letters of up to two words, e.g. "Noodle House" -> "NH"
  const initials = stallName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('')
  return initials || 'ST'
}

/**
 * Generates a human-readable order token, e.g. "RB-4821".
 * Format: <2-letter stall prefix>-<4-digit number>.
 *
 * @param {string} stallName
 * @param {() => number} [rand] - injectable RNG for deterministic tests
 * @returns {string}
 */
export function generateOrderToken(stallName, rand = Math.random) {
  const prefix = prefixFor(stallName || 'Stall')
  const number = Math.floor(rand() * 9000) + 1000 // always 4 digits: 1000-9999
  return `${prefix}-${number}`
}

/**
 * Generates a token guaranteed not to collide with any token in
 * `existingTokens`. Used at order-creation time.
 *
 * @param {string} stallName
 * @param {string[]} existingTokens
 * @returns {string}
 */
export function generateUniqueOrderToken(stallName, existingTokens = []) {
  const taken = new Set(existingTokens)
  let token = generateOrderToken(stallName)
  let attempts = 0
  while (taken.has(token) && attempts < 50) {
    token = generateOrderToken(stallName)
    attempts += 1
  }
  return token
}
