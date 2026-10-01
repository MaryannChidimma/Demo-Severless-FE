import { Link } from 'react-router-dom'
import Button from '../components/Button'
import Icon from '../components/Icon'
import { EmptyState, ErrorState, LoadingState } from '../components/States'
import { useSession } from '../context/SessionContext'
import { useAsync } from '../hooks/useAsync'
import { usePageTitle } from '../hooks/usePageTitle'
import { getOrdersForUser } from '../services/orders'
import { formatDate, formatOrderNumber, formatPrice, orderStatusLabel, pluralise } from '../utils/format'

export default function Orders() {
  usePageTitle('My orders')
  const { user } = useSession()
  const { status, data, reload } = useAsync((signal) => getOrdersForUser(user.id, signal), [user.id])
  const orders = [...(data ?? [])].sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate))

  return (
    <section aria-labelledby="orders-title">
      <h2 id="orders-title" className="account__title">
        My orders
      </h2>

      {status === 'loading' && <LoadingState label="Loading your orders…" />}
      {status === 'error' && (
        <ErrorState title="Unable to load your orders" onRetry={reload}>
          We couldn't reach the store. Please try again.
        </ErrorState>
      )}
      {status === 'ready' && orders.length === 0 && (
        <EmptyState icon="package" title="No orders yet" action={<Button to="/shop">Start shopping</Button>}>
          When you place an order it will appear here.
        </EmptyState>
      )}
      {status === 'ready' && orders.length > 0 && (
        <ul className="rows">
          {orders.map((order) => {
            const units = order.items.reduce((sum, item) => sum + item.quantity, 0)
            return (
              <li key={order.id}>
                <Link to={`/order/${order.id}`} className="row order-row">
                  <span className="order-row__main">
                    <strong>{formatOrderNumber(order.id)}</strong>
                    <span className="muted">
                      {formatDate(order.orderDate)} · {pluralise(units, 'item')}
                    </span>
                  </span>
                  <span className="order-row__side">
                    <span className="order-row__total">{formatPrice(order.totalAmount)}</span>
                    <span className="badge">{orderStatusLabel(order.status)}</span>
                  </span>
                  <Icon name="chevronRight" size={18} className="row__chevron" />
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
