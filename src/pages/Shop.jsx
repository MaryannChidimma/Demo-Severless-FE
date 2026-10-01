import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Button from '../components/Button'
import Drawer from '../components/Drawer'
import FilterPanel from '../components/FilterPanel'
import Icon from '../components/Icon'
import ProductGrid from '../components/ProductGrid'
import { EmptyState, ErrorState } from '../components/States'
import { useProducts } from '../context/ProductsContext'
import { usePageTitle } from '../hooks/usePageTitle'
import { SORTS, filterProducts, listCategories, sortProducts } from '../utils/catalog'
import { pluralise } from '../utils/format'

const toNumber = (text) => (text === '' || text == null || Number.isNaN(Number(text)) ? null : Number(text))

export default function Shop() {
  const { status, products, reload } = useProducts()
  const [params, setParams] = useSearchParams()
  const [filtersOpen, setFiltersOpen] = useState(false)

  // Filters live in the URL so results can be linked to and survive a reload.
  const query = params.get('q') ?? ''
  const sort = params.get('sort') ?? 'newest'
  const selected = {
    categories: params.getAll('category'),
    min: params.get('min') ?? '',
    max: params.get('max') ?? '',
    onlyInStock: params.get('stock') === '1',
  }
  const categoryKey = selected.categories.join('|')

  const visible = useMemo(
    () =>
      sortProducts(
        filterProducts(products, {
          query,
          categories: selected.categories,
          min: toNumber(selected.min),
          max: toNumber(selected.max),
          onlyInStock: selected.onlyInStock,
        }),
        sort,
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [products, query, sort, categoryKey, selected.min, selected.max, selected.onlyInStock],
  )

  const categories = useMemo(() => listCategories(products), [products])
  const activeCount =
    selected.categories.length + (selected.min ? 1 : 0) + (selected.max ? 1 : 0) + (selected.onlyInStock ? 1 : 0)

  function update(patch) {
    const next = new URLSearchParams(params)
    if ('categories' in patch) {
      next.delete('category')
      patch.categories.forEach((name) => next.append('category', name))
    }
    for (const key of ['min', 'max', 'sort']) {
      if (key in patch) patch[key] ? next.set(key, patch[key]) : next.delete(key)
    }
    if ('onlyInStock' in patch) patch.onlyInStock ? next.set('stock', '1') : next.delete('stock')
    setParams(next, { replace: true })
  }

  function clearFilters() {
    const next = new URLSearchParams()
    if (sort !== 'newest') next.set('sort', sort)
    setParams(next, { replace: true })
  }

  const title = query
    ? `Results for “${query}”`
    : selected.categories.length === 1
      ? selected.categories[0]
      : 'Products'
  usePageTitle(title)

  const panel = (
    <FilterPanel
      categories={categories}
      value={selected}
      activeCount={activeCount + (query ? 1 : 0)}
      onChange={update}
      onClear={clearFilters}
    />
  )

  return (
    <div className="container page shop">
      <header className="shop__header">
        <div>
          <h1>{title}</h1>
          <p className="muted" aria-live="polite">
            {status === 'ready' ? pluralise(visible.length, 'item') : ' '}
          </p>
        </div>
        <div className="shop__tools">
          <Button variant="secondary" className="shop__filter-btn" onClick={() => setFiltersOpen(true)}>
            <Icon name="filter" size={18} />
            Filters{activeCount > 0 ? ` (${activeCount})` : ''}
          </Button>
          <label className="select">
            <span className="sr-only">Sort by</span>
            <select
              value={sort}
              onChange={(event) => update({ sort: event.target.value === 'newest' ? '' : event.target.value })}
            >
              {SORTS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <Icon name="chevronDown" size={16} />
          </label>
        </div>
      </header>

      <div className="shop__layout">
        <aside className="shop__sidebar" aria-label="Filters">
          {panel}
        </aside>

        <section aria-label="Products">
          {status === 'loading' && <ProductGrid loading dense />}
          {status === 'error' && (
            <ErrorState title="Unable to load products" onRetry={reload}>
              We couldn't reach the store. Please try again.
            </ErrorState>
          )}
          {status === 'ready' && products.length === 0 && (
            <EmptyState title="No products yet">New products will appear here as soon as they are added.</EmptyState>
          )}
          {status === 'ready' && products.length > 0 && visible.length === 0 && (
            <EmptyState
              icon="search"
              title="No products found"
              action={
                <Button variant="secondary" onClick={clearFilters}>
                  Clear search and filters
                </Button>
              }
            >
              Try a different search term or remove some filters.
            </EmptyState>
          )}
          {status === 'ready' && visible.length > 0 && <ProductGrid products={visible} dense />}
        </section>
      </div>

      <Drawer
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        side="bottom"
        title="Filters"
        footer={
          <Button block size="lg" onClick={() => setFiltersOpen(false)}>
            Show {pluralise(visible.length, 'item')}
          </Button>
        }
      >
        {panel}
      </Drawer>
    </div>
  )
}
