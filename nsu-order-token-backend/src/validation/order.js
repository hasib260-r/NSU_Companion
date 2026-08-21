// Pure validation, kept dependency-free for easy unit testing.

export function validateOrderPayload(payload) {
  const errors = []

  if (!payload || typeof payload !== 'object') {
    return { valid: false, errors: ['Payload must be an object.'] }
  }

  if (!payload.stall || typeof payload.stall !== 'string') {
    errors.push('"stall" is required and must be a string.')
  }
  if (!payload.studentName || typeof payload.studentName !== 'string') {
    errors.push('"studentName" is required and must be a string.')
  }
  if (!Array.isArray(payload.items) || payload.items.length === 0) {
    errors.push('"items" is required and must be a non-empty array.')
  } else {
    payload.items.forEach((item, i) => {
      if (!item.name || typeof item.name !== 'string') {
        errors.push(`items[${i}].name is required.`)
      }
      if (!Number.isFinite(Number(item.qty)) || Number(item.qty) <= 0) {
        errors.push(`items[${i}].qty must be a positive number.`)
      }
      if (!Number.isFinite(Number(item.price)) || Number(item.price) < 0) {
        errors.push(`items[${i}].price must be a non-negative number.`)
      }
    })
  }

  return { valid: errors.length === 0, errors }
}
