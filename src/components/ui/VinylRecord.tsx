import { useRef } from 'react'
import { uid } from '@/constants'

interface Props {
  progress?: number
  size?: number
  label?: string
  spinning?: boolean
}

export function VinylRecord({ progress = 0, size = 120, label = 'HQ', spinning = false }: Props) {
  const r = 46
  const circ = 2 * Math.PI * r
  const dashLen = (Math.min(100, progress) / 100) * circ
  const gradId = useRef<string>('vg_' + uid()).current

  return (
    <div style={{ width: size, height: size, flexShrink: 0 }}>
      <svg
        viewBox="0 0 120 120"
        style={{
          width: '100%',
          height: '100%',
          animation: spinning && progress > 0 ? 'vinylSpin 4s linear infinite' : 'none',
          filter: 'drop-shadow(0 4px 16px rgba(245,158,11,0.25))',
        }}
      >
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%"   stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#FB7185" />
          </linearGradient>
        </defs>

        {/* Record body */}
        <circle cx="60" cy="60" r="58" fill="#111" />
        {/* Grooves */}
        <circle cx="60" cy="60" r="52" fill="none" stroke="#1e1e1e" strokeWidth="1" />
        <circle cx="60" cy="60" r="44" fill="none" stroke="#1e1e1e" strokeWidth="1" />
        <circle cx="60" cy="60" r="36" fill="none" stroke="#1e1e1e" strokeWidth="1" />

        {/* Progress arc */}
        <circle
          cx="60" cy="60" r={r}
          fill="none"
          stroke={`url(#${gradId})`}
          strokeWidth="5"
          strokeDasharray={`${dashLen} ${circ}`}
          strokeLinecap="round"
          transform="rotate(-90 60 60)"
        />

        {/* Label center */}
        <circle cx="60" cy="60" r="22" fill="#C97706" />
        <circle cx="60" cy="60" r="18" fill="#A45E04" />
        <circle cx="60" cy="60" r="4"  fill="#050505" />
        <text x="60" y="56" textAnchor="middle" fill="#FEF3C7" fontSize="5.5" fontWeight="700" fontFamily="sans-serif" letterSpacing="0.5">MONEY</text>
        <text x="60" y="65" textAnchor="middle" fill="#FEF3C7" fontSize="5.5" fontWeight="700" fontFamily="sans-serif" letterSpacing="1">{label}</text>
      </svg>
    </div>
  )
}
