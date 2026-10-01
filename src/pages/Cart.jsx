import Button from '../components/Button'
import CartItem from '../components/CartItem'
import Icon from '../components/Icon'
import OrderSummary from '../components/OrderSummary'
import { EmptyState, ErrorState, LoadingState } from '../components/States'
import { useCart } from '../context/CartContext'
import { useProducts } from '../context/ProductsContext'
import { useSession } from '../context/SessionContext'
import { useToast } from '../context/ToastContext'
import { usePageTitle } from '../hooks/usePageTitle'

export default function Cart() {
  usePageTitle('Cart')
  const { user } = useSession()
  const { items, count, total, status, busy, setQuantity, remove, refresh } = useCart()
  const { byId } = useProducts()
  const { notify } = useToast()

  const failed = () => notify({ message: 'Could not update your cart. Please try again.', tone: 'error' })
  const changeQuantity = (item, quantity) => setQuantity(item, quantity).catch(failed)
  const removeItem = (item) => remove(item.id).catch(failed)

  let content
  if (!user) {
    content = (
      <EmptyState
        icon="cart"
        title="Sign in to see your cart"
        action={
          <Button to="/signin" state={{ from: '/cart' }}>
            Sign in
          </Button>
        }
      >
        Your cart is saved to your account, so it's there on any device.
      </EmptyState>
    )
  } else if (status === 'loading' || status === 'idle') {
    content = <LoadingState label="Loading your cart…" />
  } else if (status === 'error') {
    content = (
      <ErrorState title="Unable to load your cart" onRetry={refresh}>
        We couldn't reach the store. Please try again.
      </ErrorState>
    )
  } else if (items.length === 0) {
    content = (
      <EmptyState icon="cart" title="Your cart is empty" action={<Button to="/shop">Start shopping</Button>}>
        Products you add will show up here.
      </EmptyState>
    )
  } else {
    content = (
      <div className="split">
        <ul className="cart-list" aria-busy={busy}>
          {items.map((item) => (
            <CartItem
              key={item.productId}
              item={item}
              product={byId.get(item.productId)}
              disabled={busy}
              onQuantityChange={changeQuantity}
              onRemove={removeItem}
            />
          ))}
        </ul>

        <aside className="split__aside">
          <OrderSummary count={count} total={total}>
            <Button to="/checkout" size="lg" block>
              Checkout <Icon name="arrowRight" size={18} />
            </Button>
            <Button to="/shop" variant="ghost" block>
              Continue shopping
            </Button>
          </OrderSummary>
        </aside>
      </div>
    )
  }

  return (
    <div className="container page">
      <h1 className="page__title">Cart{user && status === 'ready' && count > 0 ? ` (${count})` : ''}</h1>
      {content}
    </div>
  )
}
