import React from 'react'

interface Props {
  label: string
  type?: string
  value: string
  onChange: (v: string) => void
  options?: readonly string[]
  placeholder?: string
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.6rem 0.875rem',
  borderRadius: '0.75rem',
  border: '1px solid var(--border)',
  background: 'var(--input)',
  color: 'var(--text)',
  fontSize: '0.9rem',
  outline: 'none',
  fontFamily: 'var(--sans)',
  boxSizing: 'border-box',
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  marginBottom: '0.3rem',
  fontSize: '0.72rem',
  fontWeight: 700,
  color: 'var(--muted)',
  textTransform: 'uppercase',
  letterSpacing: '0.07em',
}

export function Field({ label, type = 'text', value, onChange, options, placeholder }: Props) {
  return (
    <div style={{ marginBottom: '0.875rem' }}>
      <label style={labelStyle}>{label}</label>
      {options ? (
        <select value={value} onChange={(e) => onChange(e.target.value)} style={inputStyle}>
          {options.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={inputStyle}
          placeholder={placeholder}
        />
      )}
    </div>
  )
}
