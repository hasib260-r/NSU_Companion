const MENU_API = 'http://localhost:4000/api'

export async function getMenuItems() {
  const res = await fetch(`${MENU_API}/menu`)

  if (!res.ok) {
    throw new Error('Failed to load menu')
  }

  return res.json()
}