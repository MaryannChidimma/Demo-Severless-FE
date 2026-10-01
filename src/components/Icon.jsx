// A small inline icon set (24×24, stroked) so no icon library is needed.
const PATHS = {
  menu: 'M4 6h16M4 12h16M4 18h16',
  close: 'M6 6l12 12M18 6L6 18',
  search: 'M11 4a7 7 0 1 0 0 14a7 7 0 0 0 0-14zM20 20l-4-4',
  cart: 'M3 4h2l2.4 11.2a1 1 0 0 0 1 .8h8.9a1 1 0 0 0 1-.8L20 8H6.2M9.5 20.5a1 1 0 1 0 0-2a1 1 0 0 0 0 2zM17 20.5a1 1 0 1 0 0-2a1 1 0 0 0 0 2z',
  user: 'M12 12a4 4 0 1 0 0-8a4 4 0 0 0 0 8zM4.5 20.5a7.5 7.5 0 0 1 15 0',
  heart: 'M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.2a4.3 4.3 0 0 1 7.5 2.6C19.5 15.4 12 20 12 20z',
  home: 'M4 11l8-7l8 7v8a1 1 0 0 1-1 1h-4v-6h-6v6H5a1 1 0 0 1-1-1z',
  bag: 'M6 8h12l1 12H5L6 8zM9 8V7a3 3 0 0 1 6 0v1',
  chevronRight: 'M9 6l6 6l-6 6',
  chevronLeft: 'M15 6l-6 6l6 6',
  chevronDown: 'M6 9l6 6l6-6',
  arrowRight: 'M5 12h14M13 6l6 6l-6 6',
  arrowLeft: 'M19 12H5M11 6l-6 6l6 6',
  plus: 'M12 5v14M5 12h14',
  minus: 'M5 12h14',
  trash: 'M4 7h16M10 11v6M14 11v6M6 7l1 12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-12M9 7V4h6v3',
  truck:
    'M3 6h11v10H3zM14 9h4l3 3.5V16h-7M7.5 19a1.5 1.5 0 1 0 0-3a1.5 1.5 0 0 0 0 3zM17.5 19a1.5 1.5 0 1 0 0-3a1.5 1.5 0 0 0 0 3z',
  returns: 'M4 12a8 8 0 1 0 2.6-5.9M4 4v5h5',
  check: 'M5 12.5l4.5 4.5L19 7.5',
  filter: 'M4 6h16M7 12h10M10 18h4',
  settings: 'M4 7h10M18 7h2M4 17h2M10 17h10M16 5v4M8 15v4',
  package: 'M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3zM4 7.5l8 4.5l8-4.5M12 12v9',
  pin: 'M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11zM12 12.5a2.5 2.5 0 1 0 0-5a2.5 2.5 0 0 0 0 5z',
  logout: 'M10 4H6a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h4M15 8l4 4l-4 4M19 12H9',
  info: 'M12 21a9 9 0 1 0 0-18a9 9 0 0 0 0 18zM12 11v5M12 8v.01',
  alert: 'M12 4l9 16H3L12 4zM12 10v4M12 17v.01',
  image: 'M4 5h16v14H4zM4 16l5-5l4 4l3-3l4 4M9 9.5a1 1 0 1 0 0-2a1 1 0 0 0 0 2z',
  cash: 'M3 7h18v10H3zM12 14.5a2.5 2.5 0 1 0 0-5a2.5 2.5 0 0 0 0 5zM6.5 10v4M17.5 10v4',
}

export default function Icon({ name, size = 20, filled = false, className }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d={PATHS[name]} />
    </svg>
  )
}
