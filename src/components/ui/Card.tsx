import type { ReactNode } from 'react'
import React from 'react'

interface Props {
  children: ReactNode
  style?: React.CSSProperties
  className?: string
}

export function Card({ children, style = {}, className }: Props) {
  return (
    <div
      className={className}
      style={{
        background: 'var(--card)',
        border: '1px solid var(--border)',
        borderRadius: '1.25rem',
        padding: '1.25rem',
        ...style,
      }}
    >
      {children}
    </div>
  )
}
