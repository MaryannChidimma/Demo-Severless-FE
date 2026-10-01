import ProductCard from './ProductCard'

// `dense` is for pages that share the row with a sidebar (one column fewer).
export default function ProductGrid({ products, loading = false, skeletons = 8, dense = false }) {
  const className = `product-grid${dense ? ' product-grid--dense' : ''}`

  if (loading) {
    return (
      <div className={className} role="status" aria-label="Loading products">
        {Array.from({ length: skeletons }, (_, i) => (
          <div key={i} className="product-card product-card--skeleton" aria-hidden="true">
            <div className="skeleton skeleton--image" />
            <div className="skeleton skeleton--line" />
            <div className="skeleton skeleton--line skeleton--short" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <ul className={className}>
      {products.map((product) => (
        <li key={product.id}>
          <ProductCard product={product} />
        </li>
      ))}
    </ul>
  )
}
