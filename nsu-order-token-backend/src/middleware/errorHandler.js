export function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  console.error(err)

  if (err.code === 'P2025') {
    // Prisma "record not found"
    return res.status(404).json({ error: 'Resource not found.' })
  }

  res.status(500).json({ error: 'Something went wrong on the server.' })
}
