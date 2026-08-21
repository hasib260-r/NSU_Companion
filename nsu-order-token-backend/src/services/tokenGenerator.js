// Authoritative token generation (FR-5.1). This is the source of truth
// for uniqueness — the frontend's copy of this logic is only a demo
// stand-in; real tokens must be guaranteed unique here, at the
// database level, since two students could otherwise be assigned the
// same token in a race condition.

const STALL_PREFIXES = {
  'Rongin Bhaat': 'RB',
  'Grill Corner': 'GC',
  'Wok & Roll': 'WR',
  'Cafe Corner': 'CC',
}

function prefixFor(stallName) {
  if (STALL_PREFIXES[stallName]) return STALL_PREFIXES[stallName]
  const initials = (stallName || '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('')
  return initials || 'ST'
}

/**
 * Generates one candidate token, e.g. "RB-4821".
 * @param {string} stallName
 * @param {() => number} [rand] - injectable RNG for deterministic tests
 */
export function generateOrderToken(stallName, rand = Math.random) {
  const prefix = prefixFor(stallName)
  const number = Math.floor(rand() * 9000) + 1000 // always 4 digits: 1000-9999
  return `${prefix}-${number}`
}
