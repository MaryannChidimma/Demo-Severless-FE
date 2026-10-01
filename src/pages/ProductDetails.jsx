import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Button from '../components/Button'
import FavouriteButton from '../components/FavouriteButton'
import Icon from '../components/Icon'
import ProductGrid from '../components/ProductGrid'
import ProductImage from '../components/ProductImage'
import QuantitySelector from '../components/QuantitySelector'
import { EmptyState, ErrorState, LoadingState } from '../components/States'
import { useProducts } from '../context/ProductsContext'
import { useAddToCart } from '../hooks/useAddToCart'
import { useAsync } from '../hooks/useAsync'
import { usePageTitle } from '../hooks/usePageTitle'
import { getProduct } from '../services/products'
import { categoryLink, inStock } from '../utils/catalog'
import { formatPrice } from '../utils/format'

const LOW_STOCK = 5
const RELATED = 4

function StockStatus({ product }) {
  if (!inStock(product)) return <p className="stock stock--out">Out of stock</p>
  if (product.stockQuantity <= LOW_STOCK) return <p className="stock stock--low">Only {product.stockQuantity} left</p>
  return (
    <p className="stock stock--in">
      <Icon name="check" size={16} /> In stock
    </p>
  )
}

export default function ProductDetails() {
  const { id } = useParams()
  const { products, byId } = useProducts()
  const { status, data, error, reload } = useAsync((signal) => getProduct(id, signal), [id])
  const addToCart = useAddToCart()
  const [quantity, setQuantity] = useState(1)
  const [adding, setAdding] = useState(false)

  // Show the catalogue copy straight away while the fresh one loads.
  const product = data ?? byId.get(id)
  usePageTitle(product?.name ?? 'Product')

  useEffect(() => setQuantity(1), [id])

  if (!product) {
    if (status === 'error' && error?.status === 404) {
      return (
        <div className="container page">
          <EmptyState icon="search" title="Product not found" action={<Button to="/shop">Browse all products</Button>}>
            This product may have been removed.
          </EmptyState>
        </div>
      )
    }
    if (status === 'error') {
      return (
        <div className="container page">
          <ErrorState title="Unable to load this product" onRetry={reload}>
            We couldn't reach the store. Please try again.
          </ErrorState>
        </div>
      )
    }
    return (
      <div className="container page">
        <LoadingState label="Loading product…" />
      </div>
    )
  }

  const available = inStock(product)
  const related = product.category
    ? products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, RELATED)
    : []

  async function handleAdd() {
    setAdding(true)
    await addToCart(product, quantity)
    setAdding(false)
  }

  return (
    <div className="container page">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <ol>
          <li>
            <Link to="/shop">Shop</Link>
          </li>
          {product.category && (
            <li>
              <Link to={categoryLink(product.category)}>{product.category}</Link>
            </li>
          )}
          <li aria-current="page">{product.name}</li>
        </ol>
      </nav>

      <article className="pdp">
        <ProductImage src={product.imageUrl} alt={product.name} eager className="pdp__image" />

        <div className="pdp__info">
          <div className="pdp__heading">
            <h1>{product.name}</h1>
            <FavouriteButton product={product} className="fav-btn--bordered" />
          </div>
          <p className="pdp__price">{formatPrice(product.price)}</p>
          <StockStatus product={product} />

          {product.description && <p className="pdp__description">{product.description}</p>}

          <div className="pdp__buy">
            <div className="pdp__quantity">
              <span className="field__label">Quantity</span>
              <QuantitySelector
                value={quantity}
                onChange={setQuantity}
                max={available ? product.stockQuantity : 1}
                disabled={!available}
              />
            </div>
            <Button size="lg" className="pdp__add" onClick={handleAdd} loading={adding} disabled={!available}>
              <Icon name="cart" size={20} />
              {available ? 'Add to cart' : 'Out of stock'}
            </Button>
          </div>

          <ul className="pdp__perks">
            <li>
              <Icon name="truck" /> Free shipping on every order
            </li>
            <li>
              <Icon name="returns" /> 30-day return policy
            </li>
          </ul>
        </div>
      </article>

      {related.length > 0 && (
        <section className="section" aria-labelledby="related-title">
          <div className="section__header">
            <h2 id="related-title">More in {product.category}</h2>
          </div>
          <ProductGrid products={related} />
        </section>
      )}
    </div>
  )
}
