import { memo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAddToCart } from '../hooks/useAddToCart'
import { inStock } from '../utils/catalog'
import { formatPrice } from '../utils/format'
import Button from './Button'
import FavouriteButton from './FavouriteButton'
import ProductImage from './ProductImage'

const LOW_STOCK = 5

function ProductCard({ product }) {
  const addToCart = useAddToCart()
  const [adding, setAdding] = useState(false)
  const available = inStock(product)

  async function handleAdd() {
    setAdding(true)
    await addToCart(product, 1)
    setAdding(false)
  }

  return (
    <article className="product-card">
      <div className="product-card__media">
        <Link to={`/product/${product.id}`} tabIndex={-1} aria-hidden="true">
          <ProductImage src={product.imageUrl} alt="" />
        </Link>
        <FavouriteButton product={product} className="product-card__fav" />
        {!available && <span className="badge badge--muted product-card__badge">Out of stock</span>}
      </div>

      <div className="product-card__body">
        {product.category && <p className="product-card__category">{product.category}</p>}
        <h3 className="product-card__name">
          <Link to={`/product/${product.id}`}>{product.name}</Link>
        </h3>
        <p className="product-card__price">{formatPrice(product.price)}</p>
        {available && product.stockQuantity <= LOW_STOCK && (
          <p className="product-card__stock">Only {product.stockQuantity} left</p>
        )}
      </div>

      <Button
        variant="secondary"
        size="sm"
        block
        className="product-card__add"
        onClick={handleAdd}
        loading={adding}
        disabled={!available}
        aria-label={available ? `Add ${product.name} to cart` : `${product.name} is out of stock`}
      >
        {available ? 'Add to cart' : 'Unavailable'}
      </Button>
    </article>
  )
}

export default memo(ProductCard)
