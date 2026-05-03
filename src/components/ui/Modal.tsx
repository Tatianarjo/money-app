import type { ReactNode } from 'react'

interface Props {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
}

export function Modal({ open, onClose, title, children }: Props) {
  if (!open) return null

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      style={{
        position: 'fixed', inset: 0, zIndex: 999,
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ margin: 0, fontFamily: 'var(--serif)', fontSize: '1.2rem', color: 'var(--text)' }}>
            {title}
          </h3>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontSize: '1.5rem', lineHeight: 1, padding: '0.25rem' }}
          >
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
