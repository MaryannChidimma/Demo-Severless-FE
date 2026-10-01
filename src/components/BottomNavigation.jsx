import { Link, useLocation } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useSession } from '../context/SessionContext'
import Icon from './Icon'

// Phone-only tab bar (<768px). The page reserves space for it in layout.css.
export default function BottomNavigation() {
  const { user } = useSession()
  const { count } = useCart()
  const { pathname } = useLocation()

  const tabs = [
    { to: '/', label: 'Home', icon: 'home', active: pathname === '/' },
    { to: '/shop', label: 'Shop', icon: 'bag', active: pathname === '/shop' || pathname.startsWith('/product/') },
    {
      to: '/cart',
      label: 'Cart',
      icon: 'cart',
      active: pathname === '/cart' || pathname === '/checkout',
      badge: count,
    },
    {
      to: user ? '/account' : '/signin',
      label: 'Account',
      icon: 'user',
      active: pathname.startsWith('/account') || pathname === '/signin' || pathname.startsWith('/order/'),
    },
  ]

  return (
    <nav className="bottom-nav" aria-label="Primary">
      {tabs.map((tab) => (
        <Link
          key={tab.label}
          to={tab.to}
          className={`bottom-nav__item${tab.active ? ' is-active' : ''}`}
          aria-current={tab.active ? 'page' : undefined}
        >
          <span className="bottom-nav__icon">
            <Icon name={tab.icon} size={22} />
            {tab.badge > 0 && (
              <span className="count count--corner" aria-label={`${tab.badge} items`}>
                {tab.badge}
              </span>
            )}
          </span>
          {tab.label}
        </Link>
      ))}
    </nav>
  )
}
