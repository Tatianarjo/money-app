import { Modal } from '@/components/ui'
import { FEEDBACK_FORM_URL } from '@/constants/feedback'

interface Props {
  open: boolean
  onDismiss: () => void
}

const feedbackReady = FEEDBACK_FORM_URL.startsWith('http')

export function WelcomePrivacyModal({ open, onDismiss }: Props) {
  return (
    <Modal
      open={open}
      onClose={onDismiss}
      title="Welcome to Money HQ"
      closeOnBackdrop={false}
      showCloseButton={false}
    >
      <p
        style={{
          margin: '0 0 1rem',
          fontFamily: 'var(--sans)',
          fontSize: '0.95rem',
          lineHeight: 1.55,
          color: 'var(--text)',
        }}
      >
        <strong style={{ display: 'block', fontWeight: 800, fontSize: '1.02rem', lineHeight: 1.45, marginBottom: '0.85rem' }}>
          Your budget numbers stay on your phone. The feedback form only saves what you type there — not your balances or
          entries from this app.
        </strong>
        Money HQ keeps income, bills, debt, and soft life only in this browser on this device. Nothing is sent to our
        servers. If you use <strong>Export JSON</strong> or <strong>Import</strong>, that file is yours — share it only if
        you choose to.
      </p>

      <p style={{ margin: '0 0 1.25rem', fontSize: '0.82rem', color: 'var(--muted)', lineHeight: 1.6 }}>
        We&apos;d love quick notes from testers (what&apos;s confusing, what you&apos;d use weekly). That goes through the
        form below — separate from your budget data.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'stretch' }}>
        {feedbackReady ? (
          <a
            href={FEEDBACK_FORM_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'block',
              textAlign: 'center',
              padding: '0.65rem 1rem',
              borderRadius: '0.75rem',
              border: '1px solid var(--border)',
              background: 'var(--card2)',
              color: 'var(--accent)',
              fontWeight: 700,
              fontFamily: 'var(--sans)',
              fontSize: '0.88rem',
              textDecoration: 'none',
            }}
          >
            Send feedback (opens in new tab)
          </a>
        ) : null}
        <button
          type="button"
          onClick={onDismiss}
          style={{
            padding: '0.7rem 1rem',
            border: 'none',
            borderRadius: '0.75rem',
            background: 'var(--accent)',
            color: 'var(--on-accent)',
            fontWeight: 800,
            cursor: 'pointer',
            fontFamily: 'var(--sans)',
            fontSize: '0.9rem',
          }}
        >
          Got it — start using Money HQ
        </button>
      </div>
    </Modal>
  )
}
