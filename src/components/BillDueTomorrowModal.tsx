import { Modal } from '@/components/ui'
import { fmt } from '@/utils/format'
import type { Expense } from '@/types'

function tomorrowDisplayLabel(): string {
  const t = new Date()
  t.setHours(12, 0, 0, 0)
  t.setDate(t.getDate() + 1)
  return t.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
}

interface Props {
  open: boolean
  bills: Expense[]
  onDismiss: () => void
  onGoToBills: () => void
}

export function BillDueTomorrowModal({ open, bills, onDismiss, onGoToBills }: Props) {
  if (!open || bills.length === 0) return null

  return (
    <Modal open={open} zIndex={1002} onClose={onDismiss} title="📅 Bill due tomorrow" closeOnBackdrop>
      <p style={{ margin: '0 0 1rem', color: 'var(--text)', fontSize: '0.92rem', lineHeight: 1.55, fontFamily: 'var(--sans)' }}>
        You have <strong>{bills.length === 1 ? 'one bill' : `${bills.length} bills`}</strong> whose due day matches{' '}
        <strong>tomorrow</strong> ({tomorrowDisplayLabel()}) on the calendar.
      </p>
      <ul style={{ margin: '0 0 1.25rem', paddingLeft: '1.2rem', color: 'var(--text)', fontSize: '0.88rem', lineHeight: 1.7 }}>
        {bills.map((b) => (
          <li key={b.id}>
            <strong>{b.name}</strong> — {fmt(b.amount)}
          </li>
        ))}
      </ul>
      <p style={{ margin: '0 0 1rem', fontSize: '0.78rem', color: 'var(--muted)', lineHeight: 1.5 }}>
        This pop-up shows at most once per calendar <strong>tomorrow</strong> after you finish the welcome screens (we
        remember in this browser when you tap Got it). It matches your bill&apos;s <strong>due day (1–31)</strong> to
        tomorrow&apos;s date — not server push alerts.
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'flex-end' }}>
        <button
          type="button"
          onClick={() => {
            onGoToBills()
            onDismiss()
          }}
          style={{
            padding: '0.6rem 1rem',
            border: '1px solid var(--border)',
            borderRadius: '0.75rem',
            background: 'var(--card2)',
            color: 'var(--text)',
            fontWeight: 700,
            cursor: 'pointer',
            fontFamily: 'var(--sans)',
            fontSize: '0.85rem',
          }}
        >
          Open Bills tab
        </button>
        <button
          type="button"
          onClick={onDismiss}
          style={{
            padding: '0.6rem 1rem',
            border: 'none',
            borderRadius: '0.75rem',
            background: 'var(--accent)',
            color: 'var(--on-accent)',
            fontWeight: 800,
            cursor: 'pointer',
            fontFamily: 'var(--sans)',
            fontSize: '0.85rem',
          }}
        >
          Got it
        </button>
      </div>
    </Modal>
  )
}
