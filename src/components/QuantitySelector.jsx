import Icon from './Icon'

export default function QuantitySelector({ value, onChange, min = 1, max = 99, disabled = false, label = 'Quantity' }) {
  return (
    <div className="qty" role="group" aria-label={label}>
      <button
        type="button"
        className="qty__btn"
        onClick={() => onChange(value - 1)}
        disabled={disabled || value <= min}
        aria-label="Decrease quantity"
      >
        <Icon name="minus" size={16} />
      </button>
      <output className="qty__value" aria-live="polite">
        {value}
      </output>
      <button
        type="button"
        className="qty__btn"
        onClick={() => onChange(value + 1)}
        disabled={disabled || value >= max}
        aria-label="Increase quantity"
      >
        <Icon name="plus" size={16} />
      </button>
    </div>
  )
}
