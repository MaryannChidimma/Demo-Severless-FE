import { Component } from 'react'
import { ErrorState } from './States'

// Catches rendering errors below it and shows a fallback instead of a blank
// page. Clears itself when `resetKey` changes (e.g. on navigation).
export default class ErrorBoundary extends Component {
  state = { error: null }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    console.error(error, info.componentStack)
  }

  componentDidUpdate(prevProps) {
    if (this.state.error && prevProps.resetKey !== this.props.resetKey) this.setState({ error: null })
  }

  render() {
    if (!this.state.error) return this.props.children
    return (
      <div className="container page">
        <ErrorState title="This page hit a problem" onRetry={() => this.setState({ error: null })}>
          Your cart and account are safe. Please try again.
        </ErrorState>
      </div>
    )
  }
}
