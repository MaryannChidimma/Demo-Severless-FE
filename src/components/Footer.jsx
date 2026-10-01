import { Link } from 'react-router-dom'
import { useProducts } from '../context/ProductsContext'
import { useSession } from '../context/SessionContext'
import { categoryLink, listCategories } from '../utils/catalog'

export default function Footer() {
  const { user } = useSession()
  const { products } = useProducts()
  const categories = listCategories(products).slice(0, 5)

  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <Link to="/" className="wordmark" aria-label="DEPOT home">
            DEPOT
          </Link>
          <p>Modern products for everyday living.</p>
        </div>

        <nav aria-label="Shop">
          <h2 className="footer__heading">Shop</h2>
          <ul>
            <li>
              <Link to="/shop">All products</Link>
            </li>
            {categories.map((category) => (
              <li key={category.name}>
                <Link to={categoryLink(category.name)}>{category.name}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Account">
          <h2 className="footer__heading">Account</h2>
          <ul>
            <li>
              <Link to={user ? '/account' : '/signin'}>{user ? 'My account' : 'Sign in'}</Link>
            </li>
            <li>
              <Link to="/account/orders">Orders</Link>
            </li>
            <li>
              <Link to="/cart">Cart</Link>
            </li>
            <li>
              <Link to="/favourites">Favourites</Link>
            </li>
          </ul>
        </nav>

        <nav aria-label="Company">
          <h2 className="footer__heading">DEPOT</h2>
          <ul>
            <li>
              <Link to="/about">About</Link>
            </li>
            <li>
              <Link to="/about#delivery">Delivery &amp; returns</Link>
            </li>
          </ul>
        </nav>
      </div>
      <div className="container footer__legal">
        <p>© {new Date().getFullYear()} DEPOT</p>
      </div>
    </footer>
  )
}
