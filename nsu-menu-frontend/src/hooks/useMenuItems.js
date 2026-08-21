import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  getMenuItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  toggleAvailability,
} from '../services/menuService.js'
import { filterMenuItems, getFilterOptions } from '../utils/filterMenuItems.js'

export function useMenuItems() {
  const [items, setItems] = useState([])
  const [status, setStatus] = useState('idle') // idle | loading | ready | error
  const [error, setError] = useState(null)

  const [search, setSearch] = useState('')
  const [stallFilter, setStallFilter] = useState('All')
  const [categoryFilter, setCategoryFilter] = useState('All')

  const load = useCallback(async () => {
    setStatus('loading')
    try {
      const data = await getMenuItems()
      setItems(data)
      setStatus('ready')
    } catch (err) {
      setError(err.message)
      setStatus('error')
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const addItem = useCallback(async (item) => {
    const created = await createMenuItem(item)
    setItems((prev) => [...prev, created])
  }, [])

  const editItem = useCallback(async (id, patch) => {
    const updated = await updateMenuItem(id, patch)
    setItems((prev) => prev.map((it) => (it.id === id ? updated : it)))
  }, [])

  const removeItem = useCallback(async (id) => {
    await deleteMenuItem(id)
    setItems((prev) => prev.filter((it) => it.id !== id))
  }, [])

  const toggleItemAvailability = useCallback(async (id, available) => {
    const updated = await toggleAvailability(id, available)
    setItems((prev) => prev.map((it) => (it.id === id ? updated : it)))
  }, [])

  const stalls = useMemo(() => getFilterOptions(items, 'stall'), [items])
  const categories = useMemo(
    () => getFilterOptions(items, 'category'),
    [items],
  )

  const filteredItems = useMemo(
    () => filterMenuItems(items, { search, stallFilter, categoryFilter }),
    [items, search, stallFilter, categoryFilter],
  )

  return {
    items: filteredItems,
    allItemsCount: items.length,
    status,
    error,
    reload: load,
    addItem,
    editItem,
    removeItem,
    toggleItemAvailability,
    search,
    setSearch,
    stallFilter,
    setStallFilter,
    categoryFilter,
    setCategoryFilter,
    stalls,
    categories,
  }
}
