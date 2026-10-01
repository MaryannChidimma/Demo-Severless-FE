import { Link } from 'react-router-dom'

// variant: primary | secondary | ghost | danger    size: sm | md | lg
// Renders a router link when `to` is given, otherwise a <button>.
export default function Button({
  variant = 'primary',
  size = 'md',
  block = false,
  loading = false,
  to,
  className = '',
  children,
  ...rest
}) {
  const classes = `btn btn--${variant} btn--${size}${block ? ' btn--block' : ''} ${className}`.trim()

  if (to) {
    return (
      <Link to={to} className={classes} {...rest}>
        {children}
      </Link>
    )
  }
  return (
    <button
      type="button"
      className={classes}
      aria-busy={loading || undefined}
      {...rest}
      disabled={rest.disabled || loading}
    >
      {children}
    </button>
  )
}
