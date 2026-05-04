import { useState } from 'react'
import { LEVELS, getLevel, getNextLevel } from '@/utils/gamification'
import { fmt } from '@/utils/format'
import { TourPosterModal } from '@/components/TourPosterModal'
import { VinylRecord, Card, Bar, Pill, Sparkline } from '@/components/ui'
import type { DashboardData, SummaryCard } from '@/types'

interface Props {
  data: DashboardData
}

export function DashboardTab({ data }: Props) {
  const {
    savingsGoal, savingsActual, setSavingsGoal, setSavingsActual,
    totalIncome, totalBills, totalSubs, totalDebtMin,
    totalSoft, remaining, totalDebt, healthScore,
    totalOrigDebt, currentMonthLabel, history,
    hasIncomeDrop,
    dark,
    hqShowcasePoints,
    hqLoginPointClaimed,
    hqFirstIncomePointClaimed,
    hqShowcaseIntroDone,
    dueSoon,
    goToBillsTab,
  } = data

  const [showTourPoster, setShowTourPoster] = useState(false)

  const level     = getLevel(healthScore)
  const nextLevel = getNextLevel(healthScore)
  const savingsPct = savingsGoal > 0 ? Math.min(100, (savingsActual / savingsGoal) * 100) : 0
  const debtPaid   = Math.max(0, totalOrigDebt - totalDebt)
  const debtPct    = Math.min(100, (debtPaid / totalOrigDebt) * 100)

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

  const maxShowcase = 2

  return (
    <div className="fade-up">
      {hqShowcaseIntroDone ? (
        <Card
          className="hq-showcase-game"
          style={{
            marginBottom: 'clamp(1rem, 3vw, 1.5rem)',
            padding: 'clamp(1rem, 3vw, 1.35rem)',
            border: '2px solid var(--accent)',
            boxShadow: '0 0 0 1px rgba(245, 158, 11, 0.25), 0 10px 36px rgba(245, 158, 11, 0.12)',
            background: 'linear-gradient(145deg, var(--card) 0%, var(--card2) 100%)',
          }}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', marginBottom: '0.65rem' }}>
            <div>
              <div style={{ fontSize: '0.62rem', letterSpacing: '0.2em', color: '#EC4899', fontWeight: 800, textTransform: 'uppercase' }}>
                🎮 HQ Showcase
              </div>
              <div style={{ fontFamily: 'var(--serif)', fontSize: '1.15rem', color: 'var(--text)', marginTop: 2 }}>
                Earn points · unlock tour poster
              </div>
            </div>
            <div
              style={{
                padding: '0.4rem 0.9rem',
                borderRadius: '2rem',
                background: 'var(--accent)',
                color: 'var(--on-accent)',
                fontWeight: 900,
                fontSize: '0.95rem',
                fontFamily: 'var(--sans)',
                boxShadow: '0 4px 16px rgba(245, 158, 11, 0.35)',
              }}
            >
              {hqShowcasePoints}/{maxShowcase} pts
            </div>
          </div>
          <Bar value={hqShowcasePoints} max={maxShowcase} color="#EC4899" h={8} />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.65rem', fontSize: '0.72rem', color: 'var(--muted)' }}>
            <span style={{ color: hqLoginPointClaimed ? '#10B981' : 'var(--muted)', fontWeight: 700 }}>
              {hqLoginPointClaimed ? '✓' : '○'} Login (+1)
            </span>
            <span style={{ color: 'var(--border)', fontWeight: 300 }}>|</span>
            <span style={{ color: hqFirstIncomePointClaimed ? '#10B981' : 'var(--muted)', fontWeight: 700 }}>
              {hqFirstIncomePointClaimed ? '✓' : '○'} First income drop (+1)
            </span>
          </div>
        </Card>
      ) : null}

      {/* ── Hero ── */}
      <div className="dash-hero" style={{ textAlign: 'center', padding: 'clamp(1.5rem, 5vw, 2.5rem) 0 clamp(1.25rem, 4vw, 2rem)', borderBottom: '1px solid var(--border)', marginBottom: 'clamp(1.25rem, 4vw, 2rem)' }}>
        <div style={{ fontSize: '0.68rem', letterSpacing: '0.2em', color: 'var(--accent)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.5rem' }}>
          Monthly Snapshot · {currentMonthLabel}
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

        {hasIncomeDrop ? (
          <div style={{ marginTop: '1.1rem' }}>
            <button
              type="button"
              onClick={() => setShowTourPoster(true)}
              style={{
                padding: '0.75rem 1.5rem',
                borderRadius: '1rem',
                border: 'none',
                background: 'linear-gradient(135deg, var(--accent) 0%, #EC4899 100%)',
                color: 'var(--on-accent)',
                fontWeight: 900,
                fontSize: '0.95rem',
                cursor: 'pointer',
                fontFamily: 'var(--sans)',
                letterSpacing: '0.04em',
                boxShadow: '0 8px 28px rgba(236, 72, 153, 0.35), 0 0 0 2px rgba(245, 158, 11, 0.4)',
              }}
            >
              🎪 OPEN TOUR POSTER — share your DJ level
            </button>
          </div>
        ) : (
          <p style={{ margin: '0.85rem auto 0', maxWidth: 440, fontSize: '0.82rem', color: 'var(--muted)', lineHeight: 1.55 }}>
            Add <strong>one income drop</strong> on the Income tab (+1 showcase point) to unlock the big{' '}
            <strong>tour poster</strong> — score, level, points, and <strong style={{ color: '#EC4899' }}>Powered by eyeCODEGlitter</strong>{' '}
            (money only if you opt in).
          </p>
        )}
      </div>

      {/* ── Due soon (bills with a due day) ── */}
      <Card
        style={{
          marginBottom: 'clamp(1rem, 3vw, 1.5rem)',
          padding: 'clamp(1rem, 3vw, 1.25rem)',
          border: '2px solid #F59E0B55',
          boxShadow: '0 8px 28px rgba(245, 158, 11, 0.12)',
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', marginBottom: '0.75rem' }}>
          <div>
            <div style={{ fontSize: '0.62rem', letterSpacing: '0.18em', color: '#F59E0B', fontWeight: 800, textTransform: 'uppercase' }}>
              Due soon
            </div>
            <div style={{ fontFamily: 'var(--serif)', fontSize: '1.05rem', color: 'var(--text)', marginTop: 2 }}>
              Bills for {currentMonthLabel}
            </div>
          </div>
          <button
            type="button"
            onClick={goToBillsTab}
            style={{
              padding: '0.45rem 0.85rem',
              borderRadius: '2rem',
              border: '1px solid var(--accent)',
              background: 'var(--card2)',
              color: 'var(--accent)',
              fontWeight: 800,
              fontSize: '0.72rem',
              cursor: 'pointer',
              fontFamily: 'var(--sans)',
            }}
          >
            📋 Edit bills
          </button>
        </div>
        <p style={{ margin: '0 0 0.85rem', fontSize: '0.78rem', color: 'var(--muted)', lineHeight: 1.5 }}>
          Each bill uses a <strong>due day (1–31)</strong> on the Bills tab. When this header month matches today&apos;s
          calendar month, you&apos;ll see <strong>today / overdue / days until due</strong> here.
        </p>
        {dueSoon.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '1.25rem 0.75rem',
              borderRadius: '0.75rem',
              background: 'var(--card2)',
              border: '1px dashed var(--border)',
              color: 'var(--muted)',
              fontSize: '0.82rem',
              lineHeight: 1.55,
            }}
          >
            No bills with a valid due day yet. Open <strong>Bills</strong>, add a bill, and set <strong>Due day (1–31)</strong>.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {dueSoon.map((row) => (
              <div
                key={row.id}
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '0.5rem',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '0.75rem',
                  background: row.overdue ? '#EF444414' : 'var(--card2)',
                  border: `1px solid ${row.overdue ? '#EF444455' : 'var(--border)'}`,
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, color: 'var(--text)', fontSize: '0.88rem' }}>{row.name}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--muted)', marginTop: 2 }}>
                    {row.dueLine}
                    {row.relativeLabel ? (
                      <span style={{ marginLeft: 6, fontWeight: 700, color: row.overdue ? '#EF4444' : '#10B981' }}>
                        · {row.relativeLabel}
                      </span>
                    ) : null}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
                  {row.paidThisMonth ? (
                    <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#10B981' }}>Paid ✓</span>
                  ) : row.overdue ? (
                    <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#EF4444' }}>Unpaid</span>
                  ) : (
                    <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--muted)' }}>Unpaid</span>
                  )}
                  <span style={{ fontFamily: 'var(--serif)', fontSize: '1.05rem', fontWeight: 700, color: 'var(--text)' }}>
                    {fmt(row.amount)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

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
          <Bar value={debtPaid} max={totalOrigDebt} color="#FB7185" h={7} />
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

      {/* ── Last 6 months ── */}
      <Card style={{ marginBottom: '1.5rem' }}>
        <div style={{ fontSize: '0.68rem', letterSpacing: '0.15em', color: 'var(--muted)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '1rem' }}>
          Last 6 months
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '1rem' }}>
          {[
            { label: 'Income', color: '#10B981', pts: history.income },
            { label: 'Paid spend', color: '#F59E0B', pts: history.spend },
            { label: 'Debt left', color: '#FB7185', pts: history.debtTotal },
            { label: 'Savings', color: '#06B6D4', pts: history.savings },
          ].map((row) => (
            <div key={row.label}>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--muted)', marginBottom: '0.35rem' }}>{row.label}</div>
              <Sparkline points={row.pts} color={row.color} width={140} height={40} />
              <div style={{ fontSize: '0.58rem', color: 'var(--muted)', marginTop: '0.25rem' }}>
                Oldest ← → Newest ({history.months.length} mo.)
              </div>
            </div>
          ))}
        </div>
      </Card>

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

      <TourPosterModal
        open={showTourPoster}
        onClose={() => setShowTourPoster(false)}
        healthScore={healthScore}
        level={level}
        monthLabel={currentMonthLabel}
        totalIncome={totalIncome}
        remaining={remaining}
        dark={dark}
        hqShowcasePoints={hqShowcasePoints}
      />
    </div>
  )
}
