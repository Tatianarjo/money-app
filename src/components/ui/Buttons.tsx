interface IconBtnProps {
  onClick: () => void
}

export function EditBtn({ onClick }: IconBtnProps) {
  return (
    <button
      onClick={onClick}
      style={{
        background: 'var(--card2)',
        border: '1px solid var(--border)',
        borderRadius: '0.5rem',
        padding: '0.3rem 0.55rem',
        color: 'var(--muted)',
        fontSize: '0.75rem',
        cursor: 'pointer',
      }}
    >
      ✏️
    </button>
  )
}

export function DelBtn({ onClick }: IconBtnProps) {
  return (
    <button
      onClick={onClick}
      style={{
        background: '#EF444411',
        border: '1px solid #EF444433',
        borderRadius: '0.5rem',
        padding: '0.3rem 0.55rem',
        color: '#EF4444',
        fontSize: '0.75rem',
        cursor: 'pointer',
      }}
    >
      🗑
    </button>
  )
}

interface AddBtnProps {
  label: string
  onClick: () => void
}

export function AddBtn({ label, onClick }: AddBtnProps) {
  return (
    <button
      onClick={onClick}
      style={{
        background: 'var(--accent)',
        color: 'var(--on-accent)',
        border: 'none',
        borderRadius: '0.875rem',
        padding: '0.55rem 1.25rem',
        fontWeight: 700,
        fontSize: '0.85rem',
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        fontFamily: 'var(--sans)',
      }}
    >
      {label}
    </button>
  )
}

interface SaveCancelProps {
  onSave: () => void
  onCancel: () => void
  saveLabel?: string
}

export function SaveCancel({ onSave, onCancel, saveLabel = 'Save' }: SaveCancelProps) {
  return (
    <div className="save-cancel-row" style={{ display: 'flex', gap: '0.625rem', justifyContent: 'flex-end', marginTop: '1.25rem', flexWrap: 'wrap' }}>
      <button
        onClick={onCancel}
        style={{
          padding: '0.6rem 1.25rem',
          border: '1px solid var(--border)',
          borderRadius: '0.75rem',
          background: 'none',
          color: 'var(--text)',
          cursor: 'pointer',
          fontFamily: 'var(--sans)',
        }}
      >
        Cancel
      </button>
      <button
        onClick={onSave}
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
        {saveLabel}
      </button>
    </div>
  )
}
