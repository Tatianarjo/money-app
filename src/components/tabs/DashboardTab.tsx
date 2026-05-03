import { TOTAL_ORIG_DEBT } from '@/constants'
import { LEVELS, getLevel, getNextLevel } from '@/utils/gamification'
import { fmt } from '@/utils/format'
import { VinylRecord, Card, Bar, Pill } from '@/components/ui'
import type { DashboardData, SummaryCard } from '@/types'

interface Props {
  data: DashboardData
}

export function DashboardTab({ data }: Props) {
  const {
    savingsGoal, savingsActual, setSavingsGoal, setSavingsActual,
    totalIncome, totalBills, totalSubs, totalDebtMin,
    totalSoft, remaining, totalDebt, healthScore,
  } = data

  const level     = getLevel(healthScore)
  const nextLevel = getNextLevel(healthScore)
  const savingsPct = savingsGoal > 0 ? Math.min(100, (savingsActual / savingsGoal) * 100) : 0
  const debtPaid   = Math.max(0, TOTAL_ORIG_DEBT - totalDebt)
  const debtPct    = Math.min(100, (debtPaid / TOTAL_ORIG_DEBT) * 100)

  const summaryCards: SummaryCard[] = [
    { label: 'Income',        emoji: '💰', val: totalIncome,  color: '#10B981' },
    { label: 'Fixed Bills',   emoji: '🏠', val: totalBills,   color: '#F59E0B' },
    { label: 'Subscriptions', emoji: '📡', val: totalSubs,    color: '#8B5CF6', warn: totalSubs > 150 },
    { label: 'Debt Payments', emoji: '💳', val: totalDebtMin, color: '#FB7185' },
    { label: 'Savings',       emoji: '🏦', val: savingsActual,color: '#06B6D4' },
    { label: 'Soft Life',     emoji: '✨', val: totalSoft,    color: '#F472B6' },
    {
      label: 'Remaining',
      emoji: remaining >= 0 ? '🎯' : '⚠️',
      val: remaining,
      color: remaining >= 0 ? '#10B981' : '#EF4444',
      big: true,
    },
  ]

  return (
    <div className="fade-up">
      {/* ── Hero ── */}
      <div className="dash-hero" style={{ textAlign: 'center', padding: 'clamp(1.5rem, 5vw, 2.5rem) 0 clamp(1.25rem, 4vw, 2rem)', borderBottom: '1px solid var(--border)', marginBottom: 'clamp(1.25rem, 4vw, 2rem)' }}>
        <div style={{ fontSize: '0.68rem', letterSpacing: '0.2em', color: 'var(--accent)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.5rem' }}>
          Monthly Snapshot
        </div>
        <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(1.6rem, 4vw, 2.75rem)', fontStyle: 'italic', lineHeight: 1.25, marginBottom: '1.25rem', color: 'var(--text)' }}>
          "Control the money,<br />or it controls me."
        </h1>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <Pill color="#F59E0B">🎚 Score: {healthScore}/100</Pill>
          <Pill color="#10B981">{level.icon} {level.name}</Pill>
          {nextLevel && (
            <Pill color="#8B5CF6">Next: {nextLevel.icon} {nextLevel.name} @ {nextLevel.min}pts</Pill>
          )}
          {remaining  < 0   && <Pill color="#EF4444">⚠️ In the Red</Pill>}
          {totalSubs  > 150 && <Pill color="#F59E0B">📡 Sub Overload</Pill>}
        </div>
      </div>

      {/* ── Vinyl + Progress Panels ── */}
      <Card className="dash-vinyl-card" style={{ marginBottom: '1.5rem', display: 'flex', gap: 'clamp(1.25rem, 4vw, 2rem)', flexWrap: 'wrap', alignItems: 'center' }}>
        <VinylRecord progress={savingsPct} size={132} spinning label="HQ" />

        {/* Savings panel */}
        <div style={{ flex: 1, minWidth: 180 }}>
          <div style={{ fontSize: '0.68rem', letterSpacing: '0.15em', color: 'var(--muted)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.25rem' }}>
            Savings Record
          </div>
          <div style={{ fontFamily: 'var(--serif)', fontSize: '1.6rem', color: '#F59E0B', marginBottom: '0.5rem' }}>
            {fmt(savingsActual)}{' '}
            <span style={{ fontSize: '1rem', color: 'var(--muted)' }}>/ {fmt(savingsGoal)}</span>
          </div>
          <Bar value={savingsActual} max={savingsGoal} color="#F59E0B" h={7} />
          <div style={{ fontSize: '0.72rem', color: 'var(--muted)', marginTop: '0.4rem' }}>
            {savingsPct.toFixed(0)}% pressed into the groove
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.875rem' }}>
            {(['Goal', 'Saved'] as const).map((lbl, i) => (
              <div key={lbl}>
                <div style={{ fontSize: '0.65rem', color: 'var(--muted)', marginBottom: '0.2rem' }}>{lbl}</div>
                <input
                  type="number"
                  value={i === 0 ? savingsGoal : savingsActual}
                  onChange={(e) => (i === 0 ? setSavingsGoal : setSavingsActual)(Number(e.target.value))}
                  style={{ width: 80, padding: '0.35rem 0.6rem', background: 'var(--input)', border: '1px solid var(--border)', borderRadius: '0.6rem', color: 'var(--text)', fontSize: '0.85rem', fontFamily: 'var(--sans)' }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Debt panel */}
        <div style={{ flex: 1, minWidth: 180 }}>
          <div style={{ fontSize: '0.68rem', letterSpacing: '0.15em', color: 'var(--muted)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.25rem' }}>
            Debt Kill Progress
          </div>
          <div style={{ fontFamily: 'var(--serif)', fontSize: '1.6rem', color: '#FB7185', marginBottom: '0.5rem' }}>
            {fmt(totalDebt)}{' '}
            <span style={{ fontSize: '1rem', color: 'var(--muted)' }}>left</span>
          </div>
          <Bar value={debtPaid} max={TOTAL_ORIG_DEBT} color="#FB7185" h={7} />
          <div style={{ fontSize: '0.72rem', color: 'var(--muted)', marginTop: '0.4rem' }}>
            {debtPct.toFixed(0)}% of static cleared
          </div>
          <div style={{ marginTop: '0.875rem' }}>
            <div style={{ fontSize: '0.68rem', letterSpacing: '0.15em', color: 'var(--muted)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.4rem' }}>
              Monthly Min Payments
            </div>
            <div style={{ fontFamily: 'var(--serif)', fontSize: '1.25rem', color: '#FB7185' }}>{fmt(totalDebtMin)}</div>
          </div>
        </div>
      </Card>

      {/* ── Summary Cards Grid ── */}
      <div className="dash-summary-grid">
        {summaryCards.map((c) => (
          <div
            key={c.label}
            style={{
              background: c.big ? `${c.color}18` : 'var(--card)',
              border: `1px solid ${c.big ? c.color + '55' : 'var(--border)'}`,
              borderRadius: '1.25rem',
              padding: '1.125rem',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {c.warn && <span style={{ position: 'absolute', top: 8, right: 8, fontSize: 13 }}>⚠️</span>}
            <div style={{ fontSize: 20, marginBottom: 4 }}>{c.emoji}</div>
            <div style={{ fontSize: '0.68rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700, marginBottom: 4 }}>
              {c.label}
            </div>
            <div style={{ fontFamily: 'var(--serif)', fontSize: '1.3rem', color: c.color }}>
              {fmt(c.val)}
            </div>
          </div>
        ))}
      </div>

      {/* ── DJ Career Path ── */}
      <Card>
        <div style={{ fontSize: '0.68rem', letterSpacing: '0.15em', color: 'var(--muted)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '1rem' }}>
          🎚️ DJ Career Path
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(110px, 100%), 1fr))', gap: '0.5rem', marginBottom: '1rem' }}>
          {LEVELS.map((l) => {
            const cur    = getLevel(healthScore)
            const done   = l.min < cur.min
            const active = l.min === cur.min
            return (
              <div
                key={l.name}
                style={{
                  padding: '0.75rem 0.5rem',
                  borderRadius: '1rem',
                  textAlign: 'center',
                  background: done ? '#10B98114' : active ? 'var(--accent)18' : 'var(--card2)',
                  border: `1px solid ${done ? '#10B98155' : active ? 'var(--accent)' : 'var(--border)'}`,
                  opacity: !done && !active ? 0.45 : 1,
                  transition: 'all 0.3s',
                }}
              >
                <div style={{ fontSize: 22, marginBottom: 2 }}>{l.icon}</div>
                <div style={{ fontSize: '0.68rem', fontWeight: 800, color: active ? 'var(--accent)' : done ? '#10B981' : 'var(--muted)', letterSpacing: '0.03em' }}>
                  {l.name}
                </div>
                <div style={{ fontSize: '0.6rem', color: 'var(--muted)', marginTop: 2 }}>{l.min}+ pts</div>
              </div>
            )
          })}
        </div>
        <Bar value={healthScore} max={100} color="var(--accent)" h={6} />
        <div style={{ fontSize: '0.72rem', color: 'var(--muted)', marginTop: '0.4rem' }}>
          Score: {healthScore}/100 —{' '}
          {nextLevel
            ? `${nextLevel.min - healthScore} pts until ${nextLevel.icon} ${nextLevel.name}`
            : 'Max level achieved. World tour secured. 🌍'}
        </div>
      </Card>
    </div>
  )
}
