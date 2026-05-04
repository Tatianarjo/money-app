import { useCallback, useRef, useState } from 'react'
import { toPng } from 'html-to-image'
import { Modal, VinylRecord } from '@/components/ui'
import { fmt } from '@/utils/format'
import type { Level } from '@/types'

interface Props {
  open: boolean
  onClose: () => void
  healthScore: number
  level: Level
  monthLabel: string
  totalIncome: number
  remaining: number
  dark: boolean
  hqShowcasePoints: number
}

export function TourPosterModal({
  open,
  onClose,
  healthScore,
  level,
  monthLabel,
  totalIncome,
  remaining,
  dark,
  hqShowcasePoints,
}: Props) {
  const posterRef = useRef<HTMLDivElement>(null)
  const [includeMoney, setIncludeMoney] = useState(false)
  const [busy, setBusy] = useState(false)

  const bg = dark ? '#080808' : '#faf7f3'
  const card = dark ? '#141414' : '#ffffff'
  const text = dark ? '#f4ede4' : '#1a1510'
  const muted = dark ? '#9a9490' : '#6a5d50'
  const accent = dark ? '#F59E0B' : '#C17B1E'

  const downloadPng = useCallback(async () => {
    const node = posterRef.current
    if (!node) return
    setBusy(true)
    try {
      const dataUrl = await toPng(node, {
        pixelRatio: 2,
        cacheBust: true,
        backgroundColor: bg,
      })
      const a = document.createElement('a')
      a.href = dataUrl
      a.download = `money-hq-tour-${monthLabel.replace(/\s+/g, '-')}.png`
      a.click()
    } catch {
      alert('Could not create the image. Try again or take a screenshot of the poster.')
    } finally {
      setBusy(false)
    }
  }, [bg, monthLabel])

  const sharePoster = async () => {
    const node = posterRef.current
    if (!node || !navigator.share) return
    setBusy(true)
    try {
      const dataUrl = await toPng(node, { pixelRatio: 2, cacheBust: true, backgroundColor: bg })
      const res = await fetch(dataUrl)
      const blob = await res.blob()
      const file = new File([blob], 'money-hq-tour.png', { type: 'image/png' })
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'Money HQ tour poster',
          text: `${level.name} — ${healthScore}/100 on Money HQ`,
        })
      } else {
        await downloadPng()
      }
    } catch {
      try {
        await downloadPng()
      } catch {
        /* ignore */
      }
    } finally {
      setBusy(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="🎪 Tour poster">
      <p style={{ color: 'var(--muted)', marginBottom: '0.75rem', lineHeight: 1.65, fontSize: '0.88rem' }}>
        Shareable graphic: <strong>DJ level</strong>, <strong>health score</strong>, <strong>showcase points</strong>, and
        month. The poster always says <strong style={{ color: '#EC4899' }}>Powered by eyeCODEGlitter</strong> at the
        bottom.
      </p>

      <div
        style={{
          marginBottom: '1rem',
          padding: '0.75rem 1rem',
          borderRadius: '0.75rem',
          border: '2px dashed var(--accent)',
          background: 'var(--card2)',
          fontSize: '0.82rem',
          color: 'var(--text)',
          lineHeight: 1.5,
          fontFamily: 'var(--sans)',
        }}
      >
        <strong style={{ color: 'var(--accent)' }}>Privacy opt-in:</strong> dollar amounts only appear if you check the
        box — default is <strong>score &amp; level only</strong>, safe to share.
      </div>

      <label
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '0.65rem',
          marginBottom: '1rem',
          padding: '0.85rem 1rem',
          borderRadius: '0.75rem',
          border: '2px solid var(--accent)',
          background: 'linear-gradient(135deg, var(--accent)12, #EC489912)',
          cursor: 'pointer',
          fontSize: '0.85rem',
          color: 'var(--text)',
          fontFamily: 'var(--sans)',
        }}
      >
        <input type="checkbox" checked={includeMoney} onChange={(e) => setIncludeMoney(e.target.checked)} style={{ marginTop: 3 }} />
        <span>
          <strong>Show money on the poster</strong> — month income &amp; remaining (optional; off by default).
        </span>
      </label>

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem', overflow: 'auto' }}>
        <div
          ref={posterRef}
          style={{
            width: 320,
            minHeight: 420,
            boxSizing: 'border-box',
            padding: '1.75rem 1.5rem',
            borderRadius: '1.25rem',
            background: `linear-gradient(165deg, ${card} 0%, ${dark ? '#0c0c0c' : '#f0ebe4'} 100%)`,
            border: `2px solid ${accent}`,
            boxShadow: `0 12px 40px rgba(0,0,0,${dark ? 0.45 : 0.12})`,
            color: text,
            fontFamily: 'var(--sans)',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '0.58rem', letterSpacing: '0.28em', color: accent, fontWeight: 800, marginBottom: '0.35rem' }}>
            MONEY HQ
          </div>
          <div style={{ fontSize: '0.68rem', color: muted, fontWeight: 600, marginBottom: '1rem' }}>Your Budget Assistant</div>

          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.75rem' }}>
            <VinylRecord progress={Math.min(100, healthScore)} size={100} label="HQ" />
          </div>

          <div style={{ fontSize: '2.5rem', lineHeight: 1, marginBottom: '0.25rem' }}>{level.icon}</div>
          <div style={{ fontFamily: 'var(--serif)', fontSize: '1.45rem', fontWeight: 700, color: accent, marginBottom: '0.2rem' }}>
            {level.name}
          </div>
          <div style={{ fontSize: '0.78rem', color: muted, lineHeight: 1.4, marginBottom: '1rem', padding: '0 0.25rem' }}>
            {level.desc}
          </div>

          <div
            style={{
              display: 'inline-block',
              padding: '0.4rem 1rem',
              borderRadius: '2rem',
              background: `${accent}22`,
              border: `1px solid ${accent}66`,
              color: accent,
              fontWeight: 800,
              fontSize: '0.85rem',
              marginBottom: '0.75rem',
            }}
          >
            Health score {healthScore}/100
          </div>

          <div style={{ fontSize: '0.72rem', color: muted, letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 700 }}>
            {monthLabel}
          </div>

          <div
            style={{
              marginTop: '0.85rem',
              display: 'inline-block',
              padding: '0.35rem 0.85rem',
              borderRadius: '0.5rem',
              background: '#EC489922',
              border: '1px solid #EC489955',
              color: '#EC4899',
              fontWeight: 800,
              fontSize: '0.72rem',
            }}
          >
            Showcase points · {hqShowcasePoints}
          </div>

          {includeMoney ? (
            <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: `1px solid ${dark ? '#2a2a2a' : '#e8ddd0'}`, fontSize: '0.8rem', color: text, lineHeight: 1.6 }}>
              <div>
                <span style={{ color: muted }}>Month income</span> — {fmt(totalIncome)}
              </div>
              <div>
                <span style={{ color: muted }}>Remaining</span> — {fmt(remaining)}
              </div>
            </div>
          ) : null}

          <div style={{ marginTop: '1.1rem', paddingTop: '0.85rem', borderTop: `1px solid ${dark ? '#2a2a2a' : '#e8ddd0'}` }}>
            <a
              href="https://eyecodeglitter.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                color: '#EC4899',
                textDecoration: 'none',
                letterSpacing: '0.06em',
              }}
            >
              Powered by eyeCODEGlitter
            </a>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'flex-end' }}>
        <button
          type="button"
          onClick={onClose}
          style={{
            padding: '0.6rem 1rem',
            border: '1px solid var(--border)',
            borderRadius: '0.75rem',
            background: 'none',
            color: 'var(--text)',
            cursor: 'pointer',
            fontFamily: 'var(--sans)',
          }}
        >
          Close
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={() => void downloadPng()}
          style={{
            padding: '0.6rem 1rem',
            border: 'none',
            borderRadius: '0.75rem',
            background: 'var(--accent)',
            color: 'var(--on-accent)',
            fontWeight: 700,
            cursor: busy ? 'wait' : 'pointer',
            fontFamily: 'var(--sans)',
          }}
        >
          {busy ? 'Working…' : 'Download PNG'}
        </button>
        {typeof navigator !== 'undefined' && typeof navigator.share === 'function' ? (
          <button
            type="button"
            disabled={busy}
            onClick={() => void sharePoster()}
            style={{
              padding: '0.6rem 1rem',
              border: '1px solid var(--accent)',
              borderRadius: '0.75rem',
              background: 'var(--card2)',
              color: 'var(--accent)',
              fontWeight: 700,
              cursor: busy ? 'wait' : 'pointer',
              fontFamily: 'var(--sans)',
            }}
          >
            Share…
          </button>
        ) : null}
      </div>
    </Modal>
  )
}
