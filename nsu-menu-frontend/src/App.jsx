import { useState } from 'react'
import { useMenuItems } from './hooks/useMenuItems.js'
import SearchFilterBar from './components/SearchFilterBar.jsx'
import MenuList from './components/MenuList.jsx'
import MenuItemForm from './components/MenuItemForm.jsx'

export default function App() {
  const {
    items,
    allItemsCount,
    status,
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
  } = useMenuItems()

  const [formOpen, setFormOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)

  function openAddForm() {
    setEditingItem(null)
    setFormOpen(true)
  }

  function openEditForm(item) {
    setEditingItem(item)
    setFormOpen(true)
  }

  function closeForm() {
    setFormOpen(false)
    setEditingItem(null)
  }

  async function handleSubmit(values) {
    if (editingItem) {
      await editItem(editingItem.id, values)
    } else {
      await addItem(values)
    }
    closeForm()
  }

  async function handleDelete(id) {
    if (confirm('Remove this item from the menu?')) {
      await removeItem(id)
    }
  }

  return (
    <div className="min-h-screen bg-paper pb-16">
      <header className="border-b border-line bg-white">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
          <p className="stamp text-xs uppercase tracking-wider text-teal">
            NSU Companion · Vendor Dashboard
          </p>
          <div className="mt-1 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h1 className="font-display text-3xl font-semibold text-ink">
                Digital Menu Management
              </h1>
              <p className="mt-1 text-sm text-ink/60">
                {allItemsCount} item{allItemsCount === 1 ? '' : 's'} across
                all stalls · changes go live for students within seconds
              </p>
            </div>
            <button
              onClick={openAddForm}
              className="whitespace-nowrap rounded-lg bg-teal px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-teal-dark"
            >
              + Add menu item
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-5 px-4 py-6 sm:px-6">
        <SearchFilterBar
          search={search}
          setSearch={setSearch}
          stallFilter={stallFilter}
          setStallFilter={setStallFilter}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          stalls={stalls}
          categories={categories}
          resultCount={items.length}
        />

        <MenuList
          items={items}
          status={status}
          onEdit={openEditForm}
          onDelete={handleDelete}
          onToggle={toggleItemAvailability}
        />
      </main>

      <MenuItemForm
        open={formOpen}
        initialItem={editingItem}
        onCancel={closeForm}
        onSubmit={handleSubmit}
      />
    </div>
  )
}
