import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import Icon from './Icon'

export default function SearchBar({ autoFocus = false, onSubmitted, className = '' }) {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [params] = useSearchParams()
  const current = pathname === '/shop' ? (params.get('q') ?? '') : ''
  const [value, setValue] = useState(current)

  useEffect(() => setValue(current), [current])

  function submit(event) {
    event.preventDefault()
    const query = value.trim()
    navigate(query ? `/shop?q=${encodeURIComponent(query)}` : '/shop')
    onSubmitted?.()
  }

  return (
    <form className={`search ${className}`.trim()} role="search" onSubmit={submit}>
      <input
        className="search__input"
        type="search"
        name="q"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Search products…"
        aria-label="Search products"
        autoFocus={autoFocus}
        autoComplete="off"
      />
      <button type="submit" className="search__submit" aria-label="Search">
        <Icon name="search" size={18} />
      </button>
    </form>
  )
}
