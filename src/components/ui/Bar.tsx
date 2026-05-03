interface Props {
  value: number
  max: number
  color?: string
  h?: number
}

export function Bar({ value, max, color = '#F59E0B', h = 6 }: Props) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0

  return (
    <div style={{ background: 'var(--border)', borderRadius: 999, height: h, overflow: 'hidden', width: '100%' }}>
      <div
        style={{
          width: `${pct}%`,
          height: '100%',
          background: color,
          borderRadius: 999,
          transition: 'width 0.6s cubic-bezier(.4,0,.2,1)',
        }}
      />
    </div>
  )
}
