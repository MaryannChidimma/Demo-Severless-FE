import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import Icon from '../components/Icon'
import { useSession } from '../context/SessionContext'
import { initials } from '../utils/format'

const LINKS = [
  { to: '/account/orders', label: 'My orders', icon: 'package' },
  { to: '/account/address', label: 'Delivery address', icon: 'pin' },
  { to: '/account/settings', label: 'Account settings', icon: 'settings' },
  { to: '/favourites', label: 'Favourites', icon: 'heart' },
]

// Desktop: profile and menu on the left, the selected section on the right.
// Phones and tablets: /account shows the menu, each section is its own screen.
export default function AccountLayout() {
  const { user, signOut } = useSession()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const atMenu = pathname === '/account' || pathname === '/account/'

  function handleSignOut() {
    signOut()
    navigate('/', { replace: true })
  }

  return (
    <div className={`container page account${atMenu ? ' account--menu' : ' account--section'}`}>
      <aside className="account__sidebar">
        <h1 className="page__title">My account</h1>
        <div className="profile">
          <span className="avatar" aria-hidden="true">
            {initials(user.name)}
          </span>
          <div className="profile__text">
            <p className="profile__name">{user.name}</p>
            <p className="muted">{user.email}</p>
          </div>
        </div>

        <nav aria-label="Account">
          <ul className="rows">
            {LINKS.map((link) => (
              <li key={link.to}>
                <NavLink to={link.to} className="row">
                  <Icon name={link.icon} />
                  <span>{link.label}</span>
                  <Icon name="chevronRight" size={18} className="row__chevron" />
                </NavLink>
              </li>
            ))}
            <li>
              <button type="button" className="row row--danger" onClick={handleSignOut}>
                <Icon name="logout" />
                <span>Log out</span>
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      <div className="account__content">
        <Link to="/account" className="back-link account__back">
          <Icon name="arrowLeft" size={18} /> My account
        </Link>
        <Outlet />
      </div>
    </div>
  )
}
