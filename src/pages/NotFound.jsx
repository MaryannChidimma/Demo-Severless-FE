import Button from '../components/Button'
import { EmptyState } from '../components/States'
import { usePageTitle } from '../hooks/usePageTitle'

export default function NotFound() {
  usePageTitle('Page not found')

  return (
    <div className="container page">
      <EmptyState icon="search" title="Page not found" action={<Button to="/">Back to home</Button>}>
        The page you're looking for doesn't exist or has moved.
      </EmptyState>
    </div>
  )
}
