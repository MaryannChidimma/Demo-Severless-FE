import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useProducts } from '../context/ProductsContext'
import { useSession } from '../context/SessionContext'
import { categoryLink, listCategories } from '../utils/catalog'
import Icon from './Icon'
import SearchBar from './SearchBar'

function CategoriesMenu({ categories }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const location = useLocation()

  useEffect(() => setOpen(false), [location])

  useEffect(() => {
    if (!open) return
    const onPointer = (event) => !ref.current?.contains(event.target) && setOpen(false)
    const onKey = (event) => event.key === 'Escape' && setOpen(false)
    document.addEventListener('pointerdown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div className="menu" ref={ref}>
      <button
        type="button"
        className="header__link menu__trigger"
        aria-expanded={open}
        aria-controls="categories-menu"
        onClick={() => setOpen((prev) => !prev)}
      >
        Categories
        <Icon name="chevronDown" size={16} />
      </button>
      {open && (
        <ul className="menu__list" id="categories-menu">
          {categories.map((category) => (
            <li key={category.name}>
              <Link to={categoryLink(category.name)}>{category.name}</Link>
            </li>
          ))}
          <li className="menu__all">
            <Link to="/shop">All products</Link>
          </li>
        </ul>
      )}
    </div>
  )
}

// Desktop header (≥1024px). Narrower screens get MobileHeader instead.
export default function Header() {
  const { user } = useSession()
  const { count } = useCart()
  const { products } = useProducts()
  const categories = listCategories(products)

  return (
    <header className="header header--desktop">
      <div className="container header__inner">
        <Link to="/" className="wordmark" aria-label="DEPOT home">
          DEPOT
        </Link>

        <nav className="header__nav" aria-label="Main">
          <NavLink to="/shop" className="header__link">
            Shop
          </NavLink>
          {categories.length > 0 && <CategoriesMenu categories={categories} />}
          <NavLink to="/about" className="header__link">
            About
          </NavLink>
        </nav>

        <SearchBar className="header__search" />

        <div className="header__actions">
          <NavLink to="/cart" className="header__link header__action">
            <Icon name="cart" />
            Cart
            {count > 0 && (
              <span className="count" aria-label={`${count} items in cart`}>
                {count}
              </span>
            )}
          </NavLink>
          <NavLink to={user ? '/account' : '/signin'} className="header__link header__action">
            <Icon name="user" />
            {user ? 'Account' : 'Sign in'}
          </NavLink>
        </div>
      </div>
    </header>
  )
}
