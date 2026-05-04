import type { ReactNode } from 'react'

interface Props {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
  /** When false, clicking the backdrop does not close (e.g. first-run welcome). Default true. */
  closeOnBackdrop?: boolean
  /** When false, hides the × control (use an explicit button in children to dismiss). Default true. */
  showCloseButton?: boolean
  /** Stacking order for overlay (e.g. reminders above welcome modals). Default 999. */
  zIndex?: number
}

export function Modal({
  open,
  onClose,
  title,
  children,
  closeOnBackdrop = true,
  showCloseButton = true,
  zIndex = 999,
}: Props) {
  if (!open) return null

  return (
    <div
      onClick={(e) => {
        if (closeOnBackdrop && e.target === e.currentTarget) onClose()
      }}
      style={{
        position: 'fixed', inset: 0, zIndex,
        background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(10px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 'max(1rem, env(safe-area-inset-top, 0px)) max(1rem, env(safe-area-inset-right, 0px)) max(1rem, env(safe-area-inset-bottom, 0px)) max(1rem, env(safe-area-inset-left, 0px))',
      }}
    >
      <div className="modal-panel" style={{
        background: 'var(--card)', border: '1px solid var(--border)',
        borderRadius: '1.5rem', padding: 'clamp(1.25rem, 4vw, 1.75rem)',
        maxWidth: 480,
        width: '100%',
        maxHeight: 'calc(100dvh - env(safe-area-inset-top, 0px) - env(safe-area-inset-bottom, 0px) - 2.5rem)',
        overflowY: 'auto',
        animation: 'slideUp 0.25s ease',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', gap: '0.75rem' }}>
          <h3 style={{ margin: 0, fontFamily: 'var(--serif)', fontSize: '1.2rem', color: 'var(--text)', flex: 1 }}>
            {title}
          </h3>
          {showCloseButton ? (
            <button
              type="button"
              onClick={onClose}
              style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontSize: '1.5rem', lineHeight: 1, padding: '0.25rem' }}
            >
              ×
            </button>
          ) : null}
        </div>
        {children}
      </div>
    </div>
  )
}
