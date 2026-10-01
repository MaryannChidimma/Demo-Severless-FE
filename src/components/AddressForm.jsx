import { useState } from 'react'
import Button from './Button'
import Input from './Input'
import { Notice } from './States'

const EMPTY = { street: '', city: '', state: '', zipCode: '', country: '' }
const REQUIRED = {
  street: 'Enter your street address',
  city: 'Enter your city',
  zipCode: 'Enter your postal code',
  country: 'Enter your country',
}

// Edits the one delivery address user-service stores per user.
// `onSave(address)` should persist it and may throw to show an error.
export default function AddressForm({ initial, submitLabel = 'Save address', onSave }) {
  const [values, setValues] = useState({ ...EMPTY, ...initial })
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [failed, setFailed] = useState(false)

  const bind = (name) => ({
    name,
    value: values[name] ?? '',
    error: errors[name],
    onChange: (event) => setValues((prev) => ({ ...prev, [name]: event.target.value })),
  })

  async function submit(event) {
    event.preventDefault()
    const nextErrors = {}
    for (const [name, message] of Object.entries(REQUIRED)) {
      if (!values[name]?.trim()) nextErrors[name] = message
    }
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return

    setSaving(true)
    setFailed(false)
    try {
      const { street, city, state, zipCode, country } = values
      await onSave({
        street: street.trim(),
        city: city.trim(),
        state: state?.trim() ?? '',
        zipCode: zipCode.trim(),
        country: country.trim(),
      })
    } catch {
      setFailed(true)
    } finally {
      setSaving(false)
    }
  }

  return (
    <form className="form" onSubmit={submit} noValidate>
      {failed && <Notice tone="error">We couldn't save your address. Please try again.</Notice>}
      <Input label="Street address" autoComplete="street-address" {...bind('street')} />
      <div className="form__row">
        <Input label="City" autoComplete="address-level2" {...bind('city')} />
        <Input label="Postal code" autoComplete="postal-code" {...bind('zipCode')} />
      </div>
      <div className="form__row">
        <Input label="State / region" optional autoComplete="address-level1" {...bind('state')} />
        <Input label="Country" autoComplete="country-name" {...bind('country')} />
      </div>
      <div className="form__actions">
        <Button type="submit" size="lg" loading={saving}>
          {submitLabel}
        </Button>
      </div>
    </form>
  )
}
