import { Link } from 'react-router-dom'
import { formatPrice } from '../utils/format'
import Icon from './Icon'
import ProductImage from './ProductImage'
import QuantitySelector from './QuantitySelector'

// `product` is the catalogue entry for this line (image and stock); the cart
// API itself only returns the product's id, name and current price.
export default function CartItem({ item, product, disabled, onQuantityChange, onRemove }) {
  const max = product?.stockQuantity > 0 ? Math.max(product.stockQuantity, item.quantity) : 99

  return (
    <li className="cart-item">
      <Link to={`/product/${item.productId}`} className="cart-item__image" tabIndex={-1} aria-hidden="true">
        <ProductImage src={product?.imageUrl} alt="" />
      </Link>

      <div className="cart-item__info">
        <Link to={`/product/${item.productId}`} className="cart-item__name">
          {item.productName}
        </Link>
        <p className="cart-item__price">{formatPrice(item.price)} each</p>
      </div>

      <p className="cart-item__total" aria-label={`Line total ${formatPrice(item.price * item.quantity)}`}>
        {formatPrice(item.price * item.quantity)}
      </p>

      <div className="cart-item__actions">
        <QuantitySelector
          value={item.quantity}
          max={max}
          disabled={disabled}
          onChange={(quantity) => onQuantityChange(item, quantity)}
          label={`Quantity of ${item.productName}`}
        />
        <button
          type="button"
          className="icon-btn icon-btn--danger"
          onClick={() => onRemove(item)}
          disabled={disabled}
          aria-label={`Remove ${item.productName} from cart`}
        >
          <Icon name="trash" size={18} />
        </button>
      </div>
    </li>
  )
}
