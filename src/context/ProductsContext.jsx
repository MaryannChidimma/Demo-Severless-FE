import { createContext, useContext, useMemo } from 'react'
import { useAsync } from '../hooks/useAsync'
import { getProducts } from '../services/products'

// The catalogue is small and has no server-side paging, so it is loaded once
// and shared by the home page, shop, search, cart and favourites.
const ProductsContext = createContext(null)

export function ProductsProvider({ children }) {
  const { status, data, reload } = useAsync(getProducts, [])

  const value = useMemo(() => {
    const products = data ?? []
    const byId = new Map(products.map((p) => [p.id, p]))
    return { status, products, byId, reload }
  }, [status, data, reload])

  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>
}

export const useProducts = () => useContext(ProductsContext)
