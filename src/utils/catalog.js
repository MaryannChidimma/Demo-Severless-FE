// product-service has no search, filter, sort or category endpoints, so all of
// that is derived here from the full GET /products list.

export const UNCATEGORISED = 'Other'

export const categoryOf = (product) => product.category?.trim() || UNCATEGORISED
export const inStock = (product) => (product.stockQuantity ?? 0) > 0

// MongoDB ObjectIds start with their creation time, which is the only
// "date added" information the API exposes.
export function createdAt(product) {
  const id = String(product.id ?? '')
  return /^[0-9a-f]{24}$/i.test(id) ? parseInt(id.slice(0, 8), 16) * 1000 : null
}

export function listCategories(products) {
  const byName = new Map()
  for (const product of products) {
    if (!product.category?.trim()) continue
    const name = categoryOf(product)
    const entry = byName.get(name) ?? { name, count: 0, imageUrl: null }
    entry.count += 1
    entry.imageUrl ??= product.imageUrl || null
    byName.set(name, entry)
  }
  return [...byName.values()]
}

export const categoryLink = (name) => `/shop?category=${encodeURIComponent(name)}`

export const SORTS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
  { value: 'name', label: 'Name: A to Z' },
]

const comparators = {
  newest: (a, b) => (createdAt(b) ?? 0) - (createdAt(a) ?? 0),
  'price-asc': (a, b) => a.price - b.price,
  'price-desc': (a, b) => b.price - a.price,
  name: (a, b) => a.name.localeCompare(b.name),
}

export function sortProducts(products, sort = 'newest') {
  return [...products].sort(comparators[sort] ?? comparators.newest)
}

export function filterProducts(products, { query = '', categories = [], min = null, max = null, onlyInStock = false }) {
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean)
  return products.filter((product) => {
    if (categories.length && !categories.includes(categoryOf(product))) return false
    if (min != null && product.price < min) return false
    if (max != null && product.price > max) return false
    if (onlyInStock && !inStock(product)) return false
    if (terms.length) {
      const haystack = `${product.name} ${product.description ?? ''} ${product.category ?? ''}`.toLowerCase()
      if (!terms.every((term) => haystack.includes(term))) return false
    }
    return true
  })
}
