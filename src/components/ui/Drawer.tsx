import { useEffect, type ReactNode } from 'react'

interface Props {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
  /** Optional id for the panel (e.g. for aria-controls). */
  panelId?: string
}

export function Drawer({ open, onClose, title, children, panelId }: Props) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="drawer-title"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        background: 'rgba(0,0,0,0.55)',
        backdropFilter: 'blur(6px)',
        paddingTop: 'max(0px, env(safe-area-inset-top, 0px))',
        paddingRight: 0,
        paddingBottom: 'max(0px, env(safe-area-inset-bottom, 0px))',
        paddingLeft: 'max(0px, env(safe-area-inset-left, 0px))',
      }}
    >
      <div
        id={panelId}
        className="drawer-panel"
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          height: '100dvh',
          width: 'min(420px, 100vw)',
          maxWidth: '100%',
          paddingTop: 'max(0.75rem, env(safe-area-inset-top, 0px))',
          paddingRight: 'max(0.75rem, env(safe-area-inset-right, 0px))',
          paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom, 0px))',
          paddingLeft: 'max(0.75rem, env(safe-area-inset-left, 0px))',
          background: 'var(--card)',
          borderLeft: '1px solid var(--border)',
          boxShadow: '-12px 0 40px rgba(0,0,0,0.35)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'slideInRight 0.28s ease',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0, marginBottom: '1rem', gap: '0.75rem' }}>
          <h2 id="drawer-title" style={{ margin: 0, fontFamily: 'var(--serif)', fontSize: '1.15rem', color: 'var(--text)' }}>
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close help"
            style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontSize: '1.5rem', lineHeight: 1, padding: '0.25rem' }}
          >
            ×
          </button>
        </div>
        <div style={{ overflowY: 'auto', flex: 1, minHeight: 0, paddingRight: 2 }}>
          {children}
        </div>
      </div>
    </div>
  )
}
