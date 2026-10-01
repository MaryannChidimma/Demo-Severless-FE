import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useSession } from '../context/SessionContext'

export default function RequireAuth() {
  const { user } = useSession()
  const location = useLocation()

  if (!user) return <Navigate to="/signin" replace state={{ from: location.pathname + location.search }} />
  return <Outlet />
}
