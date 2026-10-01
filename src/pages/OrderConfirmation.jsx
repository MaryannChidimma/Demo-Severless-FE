import { Link, useLocation, useParams } from 'react-router-dom'
import Button from '../components/Button'
import Icon from '../components/Icon'
import { EmptyState, ErrorState, LoadingState } from '../components/States'
import { useSession } from '../context/SessionContext'
import { useAsync } from '../hooks/useAsync'
import { usePageTitle } from '../hooks/usePageTitle'
import { getOrder } from '../services/orders'
import { formatDate, formatOrderNumber, formatPrice, orderStatusLabel } from '../utils/format'

// Shown right after checkout ("Order placed!") and when opening a past order
// from the account page.
export default function OrderConfirmation() {
  const { id } = useParams()
  const { user } = useSession()
  const justPlaced = useLocation().state?.justPlaced === true
  const { status, data: order, error, reload } = useAsync((signal) => getOrder(id, signal), [id])
  usePageTitle(justPlaced ? 'Order placed' : `Order ${formatOrderNumber(id)}`)

  if (status === 'loading') {
    return (
      <div className="container page">
        <LoadingState label="Loading order…" />
      </div>
    )
  }
  // GET /orders/{id} is not scoped to a user, so other people's orders are
  // treated as not found here.
  if ((status === 'error' && error?.status === 404) || (order && order.userId !== user.id)) {
    return (
      <div className="container page">
        <EmptyState
          icon="package"
          title="Order not found"
          action={<Button to="/account/orders">View my orders</Button>}
        >
          We couldn't find an order with that number on your account.
        </EmptyState>
      </div>
    )
  }
  if (status === 'error') {
    return (
      <div className="container page">
        <ErrorState title="Unable to load this order" onRetry={reload}>
          We couldn't reach the store. Please try again.
        </ErrorState>
      </div>
    )
  }

  return (
    <div className="container page">
      <div className="confirmation">
        {justPlaced ? (
          <header className="confirmation__header">
            <span className="confirmation__icon">
              <Icon name="check" size={32} />
            </span>
            <h1>Order placed!</h1>
            <p className="muted">
              Thank you for your purchase, {user.name.split(' ')[0]}. Your order has been received.
            </p>
          </header>
        ) : (
          <header className="confirmation__header confirmation__header--plain">
            <Link to="/account/orders" className="back-link">
              <Icon name="arrowLeft" size={18} /> My orders
            </Link>
            <h1>Order {formatOrderNumber(order.id)}</h1>
          </header>
        )}

        <dl className="facts">
          <div>
            <dt>Order number</dt>
            <dd>{formatOrderNumber(order.id)}</dd>
          </div>
          <div>
            <dt>Date</dt>
            <dd>{formatDate(order.orderDate)}</dd>
          </div>
          <div>
            <dt>Status</dt>
            <dd>{orderStatusLabel(order.status)}</dd>
          </div>
          <div>
            <dt>Total</dt>
            <dd>{formatPrice(order.totalAmount)}</dd>
          </div>
        </dl>

        <section aria-labelledby="order-items-title">
          <h2 id="order-items-title" className="confirmation__subtitle">
            Items
          </h2>
          <ul className="order-items">
            {order.items.map((item) => (
              <li key={item.productId}>
                <span>
                  <Link to={`/product/${item.productId}`}>{item.productName}</Link>{' '}
                  <span className="muted">× {item.quantity}</span>
                </span>
                <span>{formatPrice(item.priceAtPurchase * item.quantity)}</span>
              </li>
            ))}
          </ul>
        </section>

        <div className="confirmation__actions">
          <Button to="/shop" size="lg">
            Continue shopping
          </Button>
          {justPlaced && (
            <Button to="/account/orders" variant="ghost">
              View my orders
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
