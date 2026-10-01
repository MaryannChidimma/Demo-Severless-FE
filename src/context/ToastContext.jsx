import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

const ToastContext = createContext(null)
const DURATION = 3500

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null)

  // toast: { message, tone?: 'error', action?: { label, to } }
  const notify = useCallback((next) => setToast({ ...next, key: Date.now() }), [])

  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(null), DURATION)
    return () => clearTimeout(timer)
  }, [toast])

  const value = useMemo(() => ({ notify }), [notify])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toast-region" role="status" aria-live="polite">
        {toast && (
          <div key={toast.key} className={`toast${toast.tone === 'error' ? ' toast--error' : ''}`}>
            <span>{toast.message}</span>
            {toast.action && (
              <Link to={toast.action.to} className="toast__action" onClick={() => setToast(null)}>
                {toast.action.label}
              </Link>
            )}
          </div>
        )}
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => useContext(ToastContext)
