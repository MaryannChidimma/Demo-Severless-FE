import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import Input from '../components/Input'
import { Notice } from '../components/States'
import { useSession } from '../context/SessionContext'
import { usePageTitle } from '../hooks/usePageTitle'
import { addItem } from '../services/cart'
import { createUser, findUserByEmail } from '../services/users'

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Demo sign-in. user-service has no passwords or tokens, so a shopper is
// identified by email alone: an existing user is matched, a new one created.
export default function SignIn() {
  usePageTitle('Sign in')
  const { user, signIn } = useSession()
  const navigate = useNavigate()
  const { state } = useLocation()
  const from = state?.from ?? '/account'
  const pendingAdd = state?.pendingAdd

  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [isNew, setIsNew] = useState(false)
  const [errors, setErrors] = useState({})
  const [working, setWorking] = useState(false)
  const [failed, setFailed] = useState(false)
  const [done, setDone] = useState(false)

  if (user && !done) return <Navigate to={from} replace />

  async function finish(account) {
    setDone(true)
    // Add the product the shopper was trying to buy before the session
    // starts, so the cart is already correct when it first loads.
    if (pendingAdd) await addItem(account.id, pendingAdd.productId, pendingAdd.quantity).catch(() => {})
    signIn(account)
    navigate(pendingAdd ? '/cart' : from, { replace: true })
  }

  async function submit(event) {
    event.preventDefault()
    const nextErrors = {}
    if (!EMAIL.test(email.trim())) nextErrors.email = 'Enter a valid email address'
    if (isNew && !name.trim()) nextErrors.name = 'Enter your name'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return

    setWorking(true)
    setFailed(false)
    try {
      if (isNew) {
        await finish(await createUser({ name: name.trim(), email: email.trim() }))
        return
      }
      const existing = await findUserByEmail(email)
      if (existing) await finish(existing)
      else setIsNew(true)
    } catch {
      setFailed(true)
      setDone(false)
    } finally {
      setWorking(false)
    }
  }

  return (
    <div className="container page">
      <div className="auth">
        <h1>{isNew ? 'Create your account' : 'Sign in'}</h1>
        <p className="muted">
          {isNew
            ? "We don't have an account for that email yet. Add your name to create one."
            : pendingAdd
              ? 'Sign in to add this to your cart.'
              : 'Enter your email to continue.'}
        </p>

        <form className="form" onSubmit={submit} noValidate>
          {failed && <Notice tone="error">We couldn't sign you in. Please try again.</Notice>}
          <Input
            label="Email"
            type="email"
            name="email"
            autoComplete="email"
            inputMode="email"
            value={email}
            error={errors.email}
            onChange={(event) => {
              setEmail(event.target.value)
              setIsNew(false)
            }}
          />
          {isNew && (
            <Input
              label="Full name"
              name="name"
              autoComplete="name"
              autoFocus
              value={name}
              error={errors.name}
              onChange={(event) => setName(event.target.value)}
            />
          )}
          <Button type="submit" size="lg" block loading={working}>
            {isNew ? 'Create account' : 'Continue'}
          </Button>
        </form>

        <Notice tone="info">
          Demo sign-in: this store has no passwords yet, so accounts are identified by email only.
        </Notice>
      </div>
    </div>
  )
}
