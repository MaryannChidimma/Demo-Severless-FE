import { Navigate } from 'react-router-dom'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { usePageTitle } from '../hooks/usePageTitle'

// /account itself is the menu screen on phones and tablets (rendered by
// AccountLayout). On desktop the menu is always visible beside the content,
// so the index goes straight to the first section.
export default function Account() {
  usePageTitle('My account')
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  return isDesktop ? <Navigate to="/account/orders" replace /> : null
}
