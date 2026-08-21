// Pure validation logic, deliberately kept free of Express/Prisma so
// it can be unit tested directly with no server or DB required.

const REQUIRED_FIELDS = ['name', 'stall', 'category', 'price', 'prepTimeMinutes']

/**
 * Validates a menu item payload for create/update (FR-2.1).
 * @param {object} payload
 * @param {{ partial?: boolean }} [opts] - partial=true skips
 *   required-field checks (used for PATCH-style updates).
 * @returns {{ valid: boolean, errors: string[] }}
 */
export function validateMenuItemPayload(payload, opts = {}) {
  const errors = []

  if (!payload || typeof payload !== 'object') {
    return { valid: false, errors: ['Payload must be an object.'] }
  }

  if (!opts.partial) {
    for (const field of REQUIRED_FIELDS) {
      if (payload[field] === undefined || payload[field] === null || payload[field] === '') {
        errors.push(`"${field}" is required.`)
      }
    }
  }

  if (payload.name !== undefined && typeof payload.name !== 'string') {
    errors.push('"name" must be a string.')
  }
  if (payload.stall !== undefined && typeof payload.stall !== 'string') {
    errors.push('"stall" must be a string.')
  }
  if (payload.category !== undefined && typeof payload.category !== 'string') {
    errors.push('"category" must be a string.')
  }
  if (payload.price !== undefined) {
    const price = Number(payload.price)
    if (!Number.isFinite(price) || price < 0) {
      errors.push('"price" must be a non-negative number.')
    }
  }
  if (payload.prepTimeMinutes !== undefined) {
    const prep = Number(payload.prepTimeMinutes)
    if (!Number.isFinite(prep) || prep < 0) {
      errors.push('"prepTimeMinutes" must be a non-negative number.')
    }
  }
  if (payload.available !== undefined && typeof payload.available !== 'boolean') {
    errors.push('"available" must be a boolean.')
  }

  return { valid: errors.length === 0, errors }
}
