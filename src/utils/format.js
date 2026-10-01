const currency = new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR' })
const dateFormat = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })

export const formatPrice = (amount) => currency.format(Number(amount) || 0)

export const formatDate = (value) => {
  const date = value instanceof Date ? value : new Date(value)
  return Number.isNaN(date.getTime()) ? '' : dateFormat.format(date)
}

// Display form of the numeric order id returned by order-service.
export const formatOrderNumber = (id) => `ORD-${String(id).padStart(5, '0')}`

// order-service only ever sets PLACED today; unknown values are shown as-is.
const ORDER_STATUS = { PLACED: 'Placed' }
export const orderStatusLabel = (status) => ORDER_STATUS[status] ?? status

export const initials = (name = '') =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('') || '?'

export const pluralise = (count, singular, plural = `${singular}s`) => `${count} ${count === 1 ? singular : plural}`
