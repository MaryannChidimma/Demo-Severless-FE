import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useProducts } from '../context/ProductsContext'
import { useSession } from '../context/SessionContext'
import { categoryLink, listCategories } from '../utils/catalog'
import Drawer from './Drawer'
import Icon from './Icon'

export default function NavDrawer({ open, onClose }) {
  const { user } = useSession()
  const { products } = useProducts()
  const categories = listCategories(products)
  const [showCategories, setShowCategories] = useState(true)

  return (
    <Drawer open={open} onClose={onClose} side="left" title="Menu">
      {/* Close on any link, including one that points at the current page. */}
      <nav className="drawer-nav" aria-label="Menu" onClick={(event) => event.target.closest('a') && onClose()}>
        <ul>
          <li>
            <NavLink to="/" end>
              <Icon name="home" /> Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/shop" end>
              <Icon name="bag" /> Shop
            </NavLink>
          </li>
          {categories.length > 0 && (
            <li>
              <button
                type="button"
                aria-expanded={showCategories}
                aria-controls="drawer-categories"
                onClick={() => setShowCategories((prev) => !prev)}
              >
                <Icon name="filter" /> Categories
                <Icon name="chevronDown" size={18} className="drawer-nav__chevron" />
              </button>
              {showCategories && (
                <ul className="drawer-nav__sub" id="drawer-categories">
                  {categories.map((category) => (
                    <li key={category.name}>
                      <Link to={categoryLink(category.name)}>{category.name}</Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          )}
          <li>
            <NavLink to="/favourites">
              <Icon name="heart" /> Favourites
            </NavLink>
          </li>
          <li>
            <NavLink to="/about">
              <Icon name="info" /> About
            </NavLink>
          </li>
        </ul>

        <ul className="drawer-nav__footer">
          <li>
            <NavLink to={user ? '/account' : '/signin'}>
              <Icon name="user" /> {user ? 'My account' : 'Sign in'}
            </NavLink>
          </li>
        </ul>
      </nav>
    </Drawer>
  )
}
