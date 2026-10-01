import { Link } from 'react-router-dom'
import Button from '../components/Button'
import CategoryCard from '../components/CategoryCard'
import Icon from '../components/Icon'
import ProductGrid from '../components/ProductGrid'
import { EmptyState, ErrorState } from '../components/States'
import { useProducts } from '../context/ProductsContext'
import { usePageTitle } from '../hooks/usePageTitle'
import { createdAt, listCategories, sortProducts } from '../utils/catalog'

const MAX_CATEGORIES = 5
const MAX_PRODUCTS = 8

function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <picture>
        <source media="(min-width: 768px)" srcSet="/images/hero-living-room.jpg" />
        <img className="hero__image" src="/images/hero-living-room-sm.jpg" alt="" fetchPriority="high" />
      </picture>
      <div className="hero__content">
        <h1 className="hero__title" id="hero-title">
          Modern products for everyday living
        </h1>
        <p className="hero__text">Quality. Simplicity. Style.</p>
        <Button to="/shop" size="lg">
          Shop now <Icon name="arrowRight" size={18} />
        </Button>
      </div>
    </section>
  )
}

function Promises() {
  return (
    <ul className="promises">
      <li>
        <Icon name="truck" size={22} />
        <div>
          <strong>Free shipping</strong>
          <span>On every order</span>
        </div>
      </li>
      <li>
        <Icon name="returns" size={22} />
        <div>
          <strong>30-day returns</strong>
          <span>Changed your mind? Send it back</span>
        </div>
      </li>
      <li>
        <Icon name="cash" size={22} />
        <div>
          <strong>Pay on delivery</strong>
          <span>Nothing to pay until it arrives</span>
        </div>
      </li>
    </ul>
  )
}

export default function Home() {
  usePageTitle(null)
  const { status, products, reload } = useProducts()

  const categories = listCategories(products).slice(0, MAX_CATEGORIES)
  // "New arrivals" is only claimed when the ids carry a creation time.
  const dated = products.length > 0 && products.every((p) => createdAt(p) != null)
  const featured = sortProducts(products, 'newest').slice(0, MAX_PRODUCTS)

  return (
    <div className="container home">
      <Hero />

      {categories.length > 0 && (
        <section className="section" aria-labelledby="categories-title">
          <div className="section__header">
            <h2 id="categories-title">Popular categories</h2>
            <Link to="/shop" className="section__link">
              View all <Icon name="arrowRight" size={16} />
            </Link>
          </div>
          <ul className="category-row" style={{ '--count': categories.length }}>
            {categories.map((category) => (
              <li key={category.name}>
                <CategoryCard category={category} />
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="section" aria-labelledby="products-title">
        <div className="section__header">
          <h2 id="products-title">{dated ? 'New arrivals' : 'Our products'}</h2>
          {products.length > MAX_PRODUCTS && (
            <Link to="/shop" className="section__link">
              View all <Icon name="arrowRight" size={16} />
            </Link>
          )}
        </div>

        {status === 'loading' && <ProductGrid loading skeletons={MAX_PRODUCTS} />}
        {status === 'error' && (
          <ErrorState title="Unable to load products" onRetry={reload}>
            We couldn't reach the store. Please try again.
          </ErrorState>
        )}
        {status === 'ready' && products.length === 0 && (
          <EmptyState title="No products yet">New products will appear here as soon as they are added.</EmptyState>
        )}
        {status === 'ready' && products.length > 0 && <ProductGrid products={featured} />}
      </section>

      <Promises />
    </div>
  )
}
