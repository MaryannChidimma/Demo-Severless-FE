import { useEffect } from 'react'

export function usePageTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} · DEPOT` : 'DEPOT — Modern products for everyday living'
  }, [title])
}
