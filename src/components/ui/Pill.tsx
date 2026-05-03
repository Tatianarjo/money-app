import type { ReactNode } from 'react'

interface Props {
  color?: string
  children: ReactNode
}

export function Pill({ color = '#F59E0B', children }: Props) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        padding: '0.2rem 0.65rem',
        borderRadius: 999,
        fontSize: '0.7rem',
        fontWeight: 700,
        background: color + '22',
        color,
        border: `1px solid ${color}44`,
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </span>
  )
}
