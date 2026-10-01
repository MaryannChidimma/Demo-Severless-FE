import { useState } from 'react'
import AddressForm from '../components/AddressForm'
import { ErrorState, LoadingState, Notice } from '../components/States'
import { useSession } from '../context/SessionContext'
import { useAsync } from '../hooks/useAsync'
import { usePageTitle } from '../hooks/usePageTitle'
import { getAddress, saveAddress } from '../services/users'

export default function Address() {
  usePageTitle('Delivery address')
  const { user } = useSession()
  const { status, data, reload } = useAsync((signal) => getAddress(user.id, signal), [user.id])
  const [saved, setSaved] = useState(false)

  async function handleSave(values) {
    setSaved(false)
    await saveAddress(user.id, values)
    setSaved(true)
  }

  return (
    <section aria-labelledby="address-title">
      <h2 id="address-title" className="account__title">
        Delivery address
      </h2>
      <p className="muted account__lead">Used for every order you place. You can also change it during checkout.</p>

      {status === 'loading' && <LoadingState label="Loading your address…" />}
      {status === 'error' && (
        <ErrorState title="Unable to load your address" onRetry={reload}>
          We couldn't reach the store. Please try again.
        </ErrorState>
      )}
      {status === 'ready' && (
        <div className="narrow">
          {saved && <Notice tone="success">Your address has been saved.</Notice>}
          <AddressForm initial={data} onSave={handleSave} />
        </div>
      )}
    </section>
  )
}
