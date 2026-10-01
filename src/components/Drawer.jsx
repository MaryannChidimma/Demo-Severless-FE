import { useEffect, useRef } from 'react'
import Icon from './Icon'

// A modal panel built on <dialog>, which provides the focus trap, Escape to
// close and an inert page behind it. side: left | right | bottom
export default function Drawer({ open, onClose, side = 'left', title, children, footer }) {
  const ref = useRef(null)

  useEffect(() => {
    const dialog = ref.current
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog
      ref={ref}
      className={`drawer drawer--${side}`}
      aria-label={title}
      onClose={onClose}
      onClick={(event) => {
        // A click on the dialog element itself is a click on the backdrop.
        if (event.target === ref.current) onClose()
      }}
    >
      <div className="drawer__panel">
        <header className="drawer__header">
          <h2 className="drawer__title">{title}</h2>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close">
            <Icon name="close" />
          </button>
        </header>
        <div className="drawer__body">{children}</div>
        {footer && <footer className="drawer__footer">{footer}</footer>}
      </div>
    </dialog>
  )
}
