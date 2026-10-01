import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useSession } from '../context/SessionContext'
import Icon from './Icon'
import NavDrawer from './NavDrawer'
import SearchBar from './SearchBar'

// Header for phones and tablets (<1024px): menu, wordmark, search, cart.
export default function MobileHeader() {
  const { user } = useSession()
  const { count } = useCart()
  const location = useLocation()
  const [navOpen, setNavOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  useEffect(() => {
    setNavOpen(false)
    setSearchOpen(false)
  }, [location])

  return (
    <header className="header header--mobile">
      <div className="container header__inner">
        <button type="button" className="icon-btn" onClick={() => setNavOpen(true)} aria-label="Open menu">
          <Icon name="menu" size={22} />
        </button>

        <Link to="/" className="wordmark" aria-label="DEPOT home">
          DEPOT
        </Link>

        <div className="header__actions">
          <button
            type="button"
            className="icon-btn"
            onClick={() => setSearchOpen((prev) => !prev)}
            aria-expanded={searchOpen}
            aria-controls="mobile-search"
            aria-label="Search"
          >
            <Icon name={searchOpen ? 'close' : 'search'} size={22} />
          </button>
          <Link
            to={user ? '/account' : '/signin'}
            className="icon-btn header__account"
            aria-label={user ? 'Account' : 'Sign in'}
          >
            <Icon name="user" size={22} />
          </Link>
          <Link to="/cart" className="icon-btn" aria-label={count > 0 ? `Cart, ${count} items` : 'Cart'}>
            <Icon name="cart" size={22} />
            {count > 0 && (
              <span className="count count--corner" aria-hidden="true">
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>

      {searchOpen && (
        <div className="container header__search-row" id="mobile-search">
          <SearchBar autoFocus />
        </div>
      )}

      <NavDrawer open={navOpen} onClose={() => setNavOpen(false)} />
    </header>
  )
}
