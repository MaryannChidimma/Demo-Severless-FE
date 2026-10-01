import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import * as cartApi from '../services/cart'
import { useSession } from './SessionContext'

// The cart lives in order-service and is keyed by user id, so there is no
// cart until the shopper has signed in.
const CartContext = createContext(null)

export function CartProvider({ children }) {
  const { user } = useSession()
  const userId = user?.id ?? null
  const [cart, setCart] = useState(null)
  const [status, setStatus] = useState('idle') // idle | loading | ready | error
  const [busy, setBusy] = useState(false)
  const currentUser = useRef(userId)
  currentUser.current = userId

  const refresh = useCallback(async () => {
    if (userId == null) {
      setCart(null)
      setStatus('idle')
      return
    }
    setStatus((prev) => (prev === 'ready' ? prev : 'loading'))
    try {
      const next = await cartApi.getCart(userId)
      if (currentUser.current !== userId) return
      setCart(next)
      setStatus('ready')
    } catch {
      if (currentUser.current === userId) setStatus('error')
    }
  }, [userId])

  useEffect(() => {
    setCart(null)
    setStatus(userId == null ? 'idle' : 'loading')
    refresh()
  }, [refresh, userId])

  const mutate = useCallback(
    async (action) => {
      setBusy(true)
      try {
        const next = await action()
        if (currentUser.current === userId) {
          setCart(next)
          setStatus('ready')
        }
        return next
      } finally {
        setBusy(false)
      }
    },
    [userId],
  )

  const add = useCallback(
    (productId, quantity = 1) => mutate(() => cartApi.addItem(userId, productId, quantity)),
    [mutate, userId],
  )

  const remove = useCallback((itemId) => mutate(() => cartApi.removeItem(userId, itemId)), [mutate, userId])

  // order-service can only add to a line or delete it. Raising a quantity
  // adds the difference; lowering it removes the line and adds it back.
  const setQuantity = useCallback(
    (item, quantity) =>
      mutate(async () => {
        if (quantity <= 0) return cartApi.removeItem(userId, item.id)
        if (quantity > item.quantity) return cartApi.addItem(userId, item.productId, quantity - item.quantity)
        if (quantity === item.quantity) return cartApi.getCart(userId)
        await cartApi.removeItem(userId, item.id)
        return cartApi.addItem(userId, item.productId, quantity)
      }).catch((err) => {
        refresh()
        throw err
      }),
    [mutate, refresh, userId],
  )

  const value = useMemo(() => {
    // Lowering a quantity re-creates the line, so sort for a stable order.
    const items = [...(cart?.items ?? [])].sort((a, b) => a.productName.localeCompare(b.productName))
    const count = items.reduce((sum, item) => sum + item.quantity, 0)
    return { items, count, total: cart?.totalPrice ?? 0, status, busy, add, remove, setQuantity, refresh }
  }, [cart, status, busy, add, remove, setQuantity, refresh])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export const useCart = () => useContext(CartContext)
