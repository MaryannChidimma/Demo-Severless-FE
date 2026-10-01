import Icon from './Icon'

export default function CheckoutSteps({ steps, current }) {
  return (
    <ol className="steps" aria-label="Checkout progress">
      {steps.map((label, index) => {
        const state = index < current ? 'done' : index === current ? 'current' : 'upcoming'
        return (
          <li key={label} className={`steps__item is-${state}`} aria-current={state === 'current' ? 'step' : undefined}>
            <span className="steps__marker">{state === 'done' ? <Icon name="check" size={14} /> : index + 1}</span>
            <span className="steps__label">
              {label}
              {state === 'done' && <span className="sr-only"> (completed)</span>}
            </span>
          </li>
        )
      })}
    </ol>
  )
}
