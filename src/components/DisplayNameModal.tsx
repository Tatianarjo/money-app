import { useEffect, useState } from 'react'
import { Modal } from '@/components/ui'

const MAX = 48

interface Props {
  open: boolean
  defaultName: string
  onComplete: (trimmedName: string) => void
  onSkip: () => void
}

export function DisplayNameModal({ open, defaultName, onComplete, onSkip }: Props) {
  const [draft, setDraft] = useState(defaultName)

  useEffect(() => {
    if (open) setDraft(defaultName)
  }, [open, defaultName])

  return (
    <Modal open={open} onClose={onSkip} title="Who is this Money HQ for?" closeOnBackdrop={false} showCloseButton={false} zIndex={1005}>
      <p style={{ margin: '0 0 1rem', color: 'var(--text)', fontSize: '0.92rem', lineHeight: 1.55, fontFamily: 'var(--sans)' }}>
        Optional — add your first name or nickname. It appears in the <strong>header</strong> and <strong>footer</strong> so
        this copy of the app feels like <strong>yours only</strong> on this device (same local storage as your budget).
      </p>
      <label style={{ display: 'block', marginBottom: '0.35rem', fontSize: '0.72rem', fontWeight: 700, color: 'var(--muted)', letterSpacing: '0.06em' }}>
        DISPLAY NAME
      </label>
      <input
        type="text"
        value={draft}
        onChange={(e) => setDraft(e.target.value.slice(0, MAX))}
        autoComplete="name"
        placeholder="e.g. Alex"
        maxLength={MAX}
        style={{
          width: '100%',
          boxSizing: 'border-box',
          marginBottom: '1.25rem',
          padding: '0.65rem 0.85rem',
          borderRadius: '0.75rem',
          border: '1px solid var(--border)',
          background: 'var(--input)',
          color: 'var(--text)',
          fontSize: '1rem',
          fontFamily: 'var(--sans)',
        }}
      />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'flex-end' }}>
        <button
          type="button"
          onClick={onSkip}
          style={{
            padding: '0.65rem 1rem',
            border: '1px solid var(--border)',
            borderRadius: '0.75rem',
            background: 'none',
            color: 'var(--text)',
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: 'var(--sans)',
            fontSize: '0.88rem',
          }}
        >
          Skip
        </button>
        <button
          type="button"
          onClick={() => onComplete(draft.trim().slice(0, MAX))}
          style={{
            padding: '0.65rem 1rem',
            border: 'none',
            borderRadius: '0.75rem',
            background: 'var(--accent)',
            color: 'var(--on-accent)',
            fontWeight: 800,
            cursor: 'pointer',
            fontFamily: 'var(--sans)',
            fontSize: '0.88rem',
          }}
        >
          Save &amp; continue
        </button>
      </div>
    </Modal>
  )
}
