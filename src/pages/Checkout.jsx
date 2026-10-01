import { useEffect, useRef, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import AddressForm from '../components/AddressForm'
import Button from '../components/Button'
import CheckoutSteps from '../components/CheckoutSteps'
import Icon from '../components/Icon'
import OrderSummary from '../components/OrderSummary'
import { ErrorState, LoadingState, Notice } from '../components/States'
import { useCart } from '../context/CartContext'
import { useSession } from '../context/SessionContext'
import { useAsync } from '../hooks/useAsync'
import { usePageTitle } from '../hooks/usePageTitle'
import { placeOrder } from '../services/orders'
import { getAddress, saveAddress } from '../services/users'
import { formatPrice } from '../utils/format'

const STEPS = ['Shipping', 'Payment', 'Review']

function AddressLines({ address }) {
  return (
    <address className="address">
      {address.street}
      <br />
      {[address.zipCode, address.city].filter(Boolean).join(' ')}
      {address.state ? `, ${address.state}` : ''}
      <br />
      {address.country}
    </address>
  )
}

export default function Checkout() {
  usePageTitle('Checkout')
  const { user } = useSession()
  const cart = useCart()
  const navigate = useNavigate()
  const saved = useAsync((signal) => getAddress(user.id, signal), [user.id])

  const [step, setStep] = useState(0)
  const [address, setAddress] = useState(null)
  const [placing, setPlacing] = useState(false)
  const [orderFailed, setOrderFailed] = useState(false)
  const heading = useRef(null)

  // Move focus to the new step's heading so keyboard and screen-reader
  // users land on it rather than on a button that no longer exists.
  const firstRender = useRef(true)
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    heading.current?.focus()
  }, [step])

  if (cart.status === 'loading' || cart.status === 'idle' || saved.status === 'loading') {
    return (
      <div className="container page">
        <LoadingState label="Preparing checkout…" />
      </div>
    )
  }
  if (cart.status === 'error' || saved.status === 'error') {
    return (
      <div className="container page">
        <ErrorState
          title="Unable to start checkout"
          onRetry={() => {
            cart.refresh()
            saved.reload()
          }}
        >
          We couldn't reach the store. Please try again.
        </ErrorState>
      </div>
    )
  }
  if (cart.items.length === 0 && !placing) return <Navigate to="/cart" replace />

  async function handleSaveAddress(values) {
    setAddress(await saveAddress(user.id, values))
    setStep(1)
  }

  async function handlePlaceOrder() {
    setPlacing(true)
    setOrderFailed(false)
    try {
      const order = await placeOrder(user.id)
      navigate(`/order/${order.id}`, { replace: true, state: { justPlaced: true } })
      cart.refresh()
    } catch {
      setOrderFailed(true)
      setPlacing(false)
    }
  }

  const shippingAddress = address ?? saved.data

  return (
    <div className="container page">
      <h1 className="page__title">Checkout</h1>
      <CheckoutSteps steps={STEPS} current={step} />

      <div className="split">
        <div className="checkout">
          {step === 0 && (
            <section aria-labelledby="step-title">
              <h2 id="step-title" ref={heading} tabIndex={-1}>
                Shipping information
              </h2>
              <p className="muted checkout__lead">
                Delivering to <strong>{user.name}</strong>. This address is saved to your account.
              </p>
              <AddressForm initial={shippingAddress} submitLabel="Continue to payment" onSave={handleSaveAddress} />
            </section>
          )}

          {step === 1 && (
            <section aria-labelledby="step-title">
              <h2 id="step-title" ref={heading} tabIndex={-1}>
                Payment
              </h2>
              <fieldset className="options">
                <legend className="sr-only">Payment method</legend>
                <label className="option">
                  <input type="radio" name="payment" defaultChecked />
                  <Icon name="cash" size={22} />
                  <span>
                    <strong>Pay on delivery</strong>
                    <span className="muted">Pay by cash or card when your order arrives.</span>
                  </span>
                </label>
              </fieldset>
              <Notice tone="info">No payment is taken now. Online card payment isn't available yet.</Notice>
              <div className="form__actions">
                <Button variant="ghost" onClick={() => setStep(0)}>
                  <Icon name="arrowLeft" size={18} /> Back
                </Button>
                <Button size="lg" onClick={() => setStep(2)}>
                  Continue to review
                </Button>
              </div>
            </section>
          )}

          {step === 2 && (
            <section aria-labelledby="step-title">
              <h2 id="step-title" ref={heading} tabIndex={-1}>
                Review your order
              </h2>
              {orderFailed && (
                <Notice tone="error">We couldn't place your order. Nothing has been charged — please try again.</Notice>
              )}

              <dl className="review">
                <div>
                  <dt>Ship to</dt>
                  <dd>
                    {user.name}
                    <AddressLines address={shippingAddress} />
                  </dd>
                  <button type="button" className="link-btn" onClick={() => setStep(0)}>
                    Edit<span className="sr-only"> shipping address</span>
                  </button>
                </div>
                <div>
                  <dt>Payment</dt>
                  <dd>Pay on delivery</dd>
                  <button type="button" className="link-btn" onClick={() => setStep(1)}>
                    Edit<span className="sr-only"> payment method</span>
                  </button>
                </div>
              </dl>

              <div className="form__actions">
                <Button variant="ghost" onClick={() => setStep(1)}>
                  <Icon name="arrowLeft" size={18} /> Back
                </Button>
                <Button size="lg" onClick={handlePlaceOrder} loading={placing}>
                  {placing ? 'Placing order…' : `Place order · ${formatPrice(cart.total)}`}
                </Button>
              </div>
            </section>
          )}
        </div>

        <aside className="split__aside">
          <OrderSummary count={cart.count} total={cart.total} items={cart.items} />
        </aside>
      </div>
    </div>
  )
}
