import { useId } from 'react'

// A labelled text field. `error` and `hint` are announced with the input.
export default function Input({ label, error, hint, optional = false, className = '', ...rest }) {
  const id = useId()
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined

  return (
    <div className={`field ${className}`.trim()}>
      <label className="field__label" htmlFor={id}>
        {label}
        {optional && <span className="field__optional"> (optional)</span>}
      </label>
      <input
        id={id}
        className="input"
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        {...rest}
      />
      {error ? (
        <p className="field__error" id={`${id}-error`}>
          {error}
        </p>
      ) : (
        hint && (
          <p className="field__hint" id={`${id}-hint`}>
            {hint}
          </p>
        )
      )}
    </div>
  )
}
