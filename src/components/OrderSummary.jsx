import { formatPrice, pluralise } from '../utils/format'

// order-service adds no delivery charge, so shipping is always free and the
// total is the cart total it returns.
export default function OrderSummary({ count, total, items, children }) {
  return (
    <section className="summary" aria-labelledby="summary-title">
      <h2 className="summary__title" id="summary-title">
        Order summary
      </h2>

      {items && (
        <ul className="summary__items">
          {items.map((item) => (
            <li key={item.id}>
              <span>
                {item.productName} <span className="muted">× {item.quantity}</span>
              </span>
              <span>{formatPrice(item.price * item.quantity)}</span>
            </li>
          ))}
        </ul>
      )}

      <dl className="summary__rows">
        <div>
          <dt>Subtotal ({pluralise(count, 'item')})</dt>
          <dd>{formatPrice(total)}</dd>
        </div>
        <div>
          <dt>Shipping</dt>
          <dd>Free</dd>
        </div>
        <div className="summary__total">
          <dt>Total</dt>
          <dd>{formatPrice(total)}</dd>
        </div>
      </dl>

      {children}
    </section>
  )
}
