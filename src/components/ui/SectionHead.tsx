import type { ReactNode } from 'react'

interface Props {
  title: string
  sub?: ReactNode
  action?: ReactNode
}

export function SectionHead({ title, sub, action }: Props) {
  return (
    <div className="section-head">
      <div className="section-head-copy">
        <h2 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(1.25rem, 4.5vw, 1.6rem)', margin: 0, color: 'var(--text)' }}>
          {title}
        </h2>
        {sub && (
          <div style={{ fontSize: '0.8rem', color: 'var(--muted)', marginTop: '0.15rem', lineHeight: 1.45 }}>
            {sub}
          </div>
        )}
      </div>
      {action && <div className="section-head-action">{action}</div>}
    </div>
  )
}
