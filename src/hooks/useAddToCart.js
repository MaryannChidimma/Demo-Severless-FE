import { useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useSession } from '../context/SessionContext'
import { useToast } from '../context/ToastContext'

// Adds to the server-side cart. A signed-out shopper is sent to sign in and
// the product is added for them once they have.
export function useAddToCart() {
  const { user } = useSession()
  const { add } = useCart()
  const { notify } = useToast()
  const navigate = useNavigate()
  const location = useLocation()

  return useCallback(
    async (product, quantity = 1) => {
      if (!user) {
        navigate('/signin', {
          state: { from: location.pathname + location.search, pendingAdd: { productId: product.id, quantity } },
        })
        return false
      }
      try {
        await add(product.id, quantity)
        notify({ message: `${product.name} added to cart`, action: { label: 'View cart', to: '/cart' } })
        return true
      } catch {
        notify({ message: 'Could not add to cart. Please try again.', tone: 'error' })
        return false
      }
    },
    [user, add, notify, navigate, location.pathname, location.search],
  )
}
