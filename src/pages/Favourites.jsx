import Button from '../components/Button'
import ProductGrid from '../components/ProductGrid'
import { EmptyState, ErrorState } from '../components/States'
import { useFavourites } from '../context/FavouritesContext'
import { useProducts } from '../context/ProductsContext'
import { usePageTitle } from '../hooks/usePageTitle'

export default function Favourites() {
  usePageTitle('Favourites')
  const { status, products, reload } = useProducts()
  const { ids } = useFavourites()
  const saved = products.filter((product) => ids.includes(product.id))

  return (
    <div className="container page">
      <h1 className="page__title">Favourites</h1>
      <p className="muted page__lead">Saved on this device.</p>

      {status === 'loading' && <ProductGrid loading skeletons={4} />}
      {status === 'error' && (
        <ErrorState title="Unable to load products" onRetry={reload}>
          We couldn't reach the store. Please try again.
        </ErrorState>
      )}
      {status === 'ready' && saved.length === 0 && (
        <EmptyState icon="heart" title="No favourites yet" action={<Button to="/shop">Browse products</Button>}>
          Tap the heart on any product to save it here.
        </EmptyState>
      )}
      {status === 'ready' && saved.length > 0 && <ProductGrid products={saved} />}
    </div>
  )
}
