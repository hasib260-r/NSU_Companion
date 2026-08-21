import { useCallback, useEffect, useState } from 'react'
import { getOrders, confirmOrderAndGenerateToken } from '../services/orderService.js'

export function useOrders() {
  const [orders, setOrders] = useState([])
  const [status, setStatus] = useState('idle')
  const [lastConfirmedOrder, setLastConfirmedOrder] = useState(null)

  const load = useCallback(async () => {
    setStatus('loading')
    try {
      const data = await getOrders()
      setOrders(data)
      setStatus('ready')
    } catch {
      setStatus('error')
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const placeOrder = useCallback(async (draft) => {
    const confirmed = await confirmOrderAndGenerateToken(draft)
    setOrders((prev) => [confirmed, ...prev])
    setLastConfirmedOrder(confirmed)
    return confirmed
  }, [])

  return { orders, status, placeOrder, lastConfirmedOrder, reload: load }
}
