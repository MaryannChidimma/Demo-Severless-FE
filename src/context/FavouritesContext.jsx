import { createContext, useCallback, useContext, useMemo, useState } from 'react'

// There is no favourites API; saved products are kept in this browser only.
const STORAGE_KEY = 'depot.favourites'
const FavouritesContext = createContext(null)

function readStored() {
  try {
    const ids = JSON.parse(localStorage.getItem(STORAGE_KEY))
    return Array.isArray(ids) ? ids : []
  } catch {
    return []
  }
}

export function FavouritesProvider({ children }) {
  const [ids, setIds] = useState(readStored)

  const toggle = useCallback((id) => {
    setIds((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  const value = useMemo(() => ({ ids, has: (id) => ids.includes(id), toggle }), [ids, toggle])
  return <FavouritesContext.Provider value={value}>{children}</FavouritesContext.Provider>
}

export const useFavourites = () => useContext(FavouritesContext)
