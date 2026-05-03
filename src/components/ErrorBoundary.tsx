import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('Money HQ render error:', error, info.componentStack)
  }

  render(): ReactNode {
    if (this.state.error) {
      return (
        <div
          style={{
            margin: '2rem auto',
            maxWidth: 480,
            padding: '1.5rem',
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: '1rem',
            color: 'var(--text)',
            fontFamily: 'var(--sans)',
          }}
        >
          <h2 style={{ fontFamily: 'var(--serif)', marginBottom: '0.75rem', fontSize: '1.25rem' }}>
            Something went wrong
          </h2>
          <p style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1rem' }}>
            The app hit an unexpected error. Try reloading the page. If you recently imported data, use a valid backup file.
          </p>
          <pre
            style={{
              fontSize: '0.72rem',
              overflow: 'auto',
              padding: '0.75rem',
              background: 'var(--card2)',
              borderRadius: '0.5rem',
              color: '#FB7185',
              marginBottom: '1rem',
            }}
          >
            {this.state.error.message}
          </pre>
          <button
            type="button"
            onClick={() => window.location.reload()}
            style={{
              padding: '0.6rem 1.25rem',
              border: 'none',
              borderRadius: '0.75rem',
              background: 'var(--accent)',
              color: 'var(--on-accent)',
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: 'var(--sans)',
            }}
          >
            Reload
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
