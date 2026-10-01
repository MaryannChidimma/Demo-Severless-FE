import Button from './Button'
import Icon from './Icon'

export function LoadingState({ label = 'Loading…' }) {
  return (
    <div className="state" role="status">
      <span className="spinner" aria-hidden="true" />
      <p className="state__text">{label}</p>
    </div>
  )
}

export function EmptyState({ icon = 'bag', title, children, action }) {
  return (
    <div className="state">
      <span className="state__icon">
        <Icon name={icon} size={24} />
      </span>
      <h2 className="state__title">{title}</h2>
      {children && <p className="state__text">{children}</p>}
      {action}
    </div>
  )
}

export function ErrorState({ title = 'Something went wrong', children, onRetry }) {
  return (
    <div className="state" role="alert">
      <span className="state__icon state__icon--error">
        <Icon name="alert" size={24} />
      </span>
      <h2 className="state__title">{title}</h2>
      <p className="state__text">{children ?? 'Please try again.'}</p>
      {onRetry && (
        <Button variant="secondary" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  )
}

// Inline message inside forms and panels. tone: error | info | success
export function Notice({ tone = 'info', children }) {
  return (
    <div className={`notice notice--${tone}`} role={tone === 'error' ? 'alert' : 'status'}>
      <Icon name={tone === 'error' ? 'alert' : tone === 'success' ? 'check' : 'info'} size={18} />
      <div>{children}</div>
    </div>
  )
}
