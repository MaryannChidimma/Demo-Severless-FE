import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { ApiError } from '../services/http'
import { getUser, updateUser } from '../services/users'

// The backend has no authentication. A "session" is just the user record the
// shopper identified with, remembered in this browser.
const STORAGE_KEY = 'depot.user'
const SessionContext = createContext(null)

function readStoredUser() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY))
  } catch {
    return null
  }
}

export function SessionProvider({ children }) {
  const [user, setUser] = useState(readStoredUser)

  const signIn = useCallback((nextUser) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser))
    setUser(nextUser)
  }, [])

  const signOut = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setUser(null)
  }, [])

  const updateProfile = useCallback(
    async (changes) => {
      const saved = await updateUser(user.id, changes)
      signIn(saved)
      return saved
    },
    [user?.id, signIn],
  )

  // Drop a remembered user that no longer exists (e.g. the database was reset).
  const userId = user?.id
  useEffect(() => {
    if (userId == null) return
    const controller = new AbortController()
    getUser(userId, controller.signal)
      .then(signIn)
      .catch((err) => {
        if (err instanceof ApiError && err.status === 404) signOut()
      })
    return () => controller.abort()
  }, [userId, signIn, signOut])

  const value = useMemo(() => ({ user, signIn, signOut, updateProfile }), [user, signIn, signOut, updateProfile])
  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
}

export const useSession = () => useContext(SessionContext)
