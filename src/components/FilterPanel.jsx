import { useId } from 'react'

// Filters offered are limited to what the product data actually contains:
// category, price and stock. `onChange` receives a partial update.
export default function FilterPanel({ categories, value, activeCount, onChange, onClear }) {
  const id = useId()

  function toggleCategory(name) {
    const selected = value.categories.includes(name)
      ? value.categories.filter((c) => c !== name)
      : [...value.categories, name]
    onChange({ categories: selected })
  }

  return (
    <div className="filters">
      {categories.length > 0 && (
        <fieldset className="filters__group">
          <legend>Category</legend>
          {categories.map((category) => (
            <label key={category.name} className="check">
              <input
                type="checkbox"
                checked={value.categories.includes(category.name)}
                onChange={() => toggleCategory(category.name)}
              />
              <span>{category.name}</span>
              <span className="check__count">{category.count}</span>
            </label>
          ))}
        </fieldset>
      )}

      <fieldset className="filters__group">
        <legend>Price</legend>
        <div className="filters__price">
          <div>
            <label htmlFor={`${id}-min`}>Min €</label>
            <input
              id={`${id}-min`}
              className="input"
              type="number"
              inputMode="decimal"
              min="0"
              placeholder="0"
              value={value.min ?? ''}
              onChange={(event) => onChange({ min: event.target.value })}
            />
          </div>
          <div>
            <label htmlFor={`${id}-max`}>Max €</label>
            <input
              id={`${id}-max`}
              className="input"
              type="number"
              inputMode="decimal"
              min="0"
              placeholder="Any"
              value={value.max ?? ''}
              onChange={(event) => onChange({ max: event.target.value })}
            />
          </div>
        </div>
      </fieldset>

      <fieldset className="filters__group">
        <legend>Availability</legend>
        <label className="check">
          <input
            type="checkbox"
            checked={value.onlyInStock}
            onChange={(event) => onChange({ onlyInStock: event.target.checked })}
          />
          <span>In stock only</span>
        </label>
      </fieldset>

      {activeCount > 0 && (
        <button type="button" className="link-btn" onClick={onClear}>
          Clear all filters
        </button>
      )}
    </div>
  )
}
