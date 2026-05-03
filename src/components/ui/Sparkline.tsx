interface Props {
  /** Values in display order; gaps render as breaks between segments */
  points: (number | null)[]
  color: string
  height?: number
  width?: number
}

/** Lightweight SVG sparkline (no chart library). Skips null points. */
export function Sparkline({ points, color, height = 36, width = 128 }: Props) {
  const indexed = points
    .map((v, i) => (v === null || v === undefined || Number.isNaN(v) ? null : { i, v }))
    .filter((x): x is { i: number; v: number } => x !== null)

  if (indexed.length === 0) {
    return (
      <div style={{ width, height, display: 'flex', alignItems: 'center', color: 'var(--muted)', fontSize: '0.65rem' }}>
        No data
      </div>
    )
  }

  const vals = indexed.map((x) => x.v)
  const min = Math.min(...vals)
  const max = Math.max(...vals)
  const range = max - min || 1

  const pad = 2
  const coords = indexed.map(({ v }, idx) => {
    const x = indexed.length === 1 ? width / 2 : (idx / (indexed.length - 1)) * (width - pad * 2) + pad
    const y = height - pad - ((v - min) / range) * (height - pad * 2)
    return `${x},${y}`
  })

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden style={{ display: 'block' }}>
      <polyline fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" points={coords.join(' ')} />
    </svg>
  )
}
