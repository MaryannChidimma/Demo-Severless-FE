import { useState } from 'react'
import Button from '../components/Button'
import Input from '../components/Input'
import { Notice } from '../components/States'
import { useSession } from '../context/SessionContext'
import { usePageTitle } from '../hooks/usePageTitle'

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function Settings() {
  usePageTitle('Account settings')
  const { user, updateProfile } = useSession()
  const [name, setName] = useState(user.name ?? '')
  const [email, setEmail] = useState(user.email ?? '')
  const [errors, setErrors] = useState({})
  const [result, setResult] = useState(null) // 'saved' | 'failed'
  const [saving, setSaving] = useState(false)

  async function submit(event) {
    event.preventDefault()
    const nextErrors = {}
    if (!name.trim()) nextErrors.name = 'Enter your name'
    if (!EMAIL.test(email.trim())) nextErrors.email = 'Enter a valid email address'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return

    setSaving(true)
    setResult(null)
    try {
      await updateProfile({ name: name.trim(), email: email.trim() })
      setResult('saved')
    } catch {
      setResult('failed')
    } finally {
      setSaving(false)
    }
  }

  return (
    <section aria-labelledby="settings-title">
      <h2 id="settings-title" className="account__title">
        Account settings
      </h2>
      <form className="form narrow" onSubmit={submit} noValidate>
        {result === 'saved' && <Notice tone="success">Your details have been updated.</Notice>}
        {result === 'failed' && <Notice tone="error">We couldn't save your details. Please try again.</Notice>}
        <Input
          label="Full name"
          name="name"
          autoComplete="name"
          value={name}
          error={errors.name}
          onChange={(event) => setName(event.target.value)}
        />
        <Input
          label="Email"
          type="email"
          name="email"
          autoComplete="email"
          value={email}
          error={errors.email}
          hint="You sign in with this email."
          onChange={(event) => setEmail(event.target.value)}
        />
        <div className="form__actions">
          <Button type="submit" size="lg" loading={saving}>
            Save changes
          </Button>
        </div>
      </form>
    </section>
  )
}
