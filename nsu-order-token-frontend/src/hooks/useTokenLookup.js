import { useState } from 'react'
import { findOrderByToken } from '../services/orderService.js'

export function useTokenLookup() {
  const [query, setQuery] = useState('')
  const [result, setResult] = useState(null)
  const [status, setStatus] = useState('idle') // idle | loading | found | not-found | error

  async function lookup(e) {
    e?.preventDefault()
    if (!query.trim()) return
    setStatus('loading')
    try {
      const order = await findOrderByToken(query)
      if (order) {
        setResult(order)
        setStatus('found')
      } else {
        setResult(null)
        setStatus('not-found')
      }
    } catch {
      setStatus('error')
    }
  }

  return { query, setQuery, lookup, result, status }
}
