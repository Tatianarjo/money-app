import { useState } from 'react'
import { usePersistedState } from '@/hooks/usePersistedState'
import { calcScore, getLevel } from '@/utils/gamification'
import { fmt } from '@/utils/format'
import {
  INIT_INCOME, INIT_EXPENSES, INIT_DEBTS, INIT_SOFT,
} from '@/constants'
import { VinylRecord, Modal, Pill } from '@/components/ui'
import { DashboardTab, IncomeTab, BillsTab, DebtTab, SoftLifeTab } from '@/components/tabs'
import type { IncomeEntry, Expense, Debt, SoftEntry, TabId, TabDef, DashboardData, ThemeStyle } from '@/types'

// ─── Theme Tokens ─────────────────────────────────────────────────────────────

const DARK_THEME: ThemeStyle = {
  '--bg':        '#080808',
  '--card':      '#141414',
  '--card2':     '#1c1c1c',
  '--border':    '#2a2a2a',
  '--text':      '#f4ede4',
  '--muted':     '#7a7570',
  '--input':     '#1c1c1c',
  '--accent':    '#F59E0B',
  '--on-accent': '#000',
  '--serif':     'DM Serif Display, Georgia, serif',
  '--sans':      'DM Sans, system-ui, sans-serif',
}

const LIGHT_THEME: ThemeStyle = {
  '--bg':        '#faf7f3',
  '--card':      '#ffffff',
  '--card2':     '#f4ede4',
  '--border':    '#e8ddd0',
  '--text':      '#1a1510',
  '--muted':     '#8a7d70',
  '--input':     '#f4ede4',
  '--accent':    '#C17B1E',
  '--on-accent': '#fff',
  '--serif':     'DM Serif Display, Georgia, serif',
  '--sans':      'DM Sans, system-ui, sans-serif',
}

// ─── Tab Definitions ──────────────────────────────────────────────────────────

const TABS: TabDef[] = [
  { id: 'dashboard', label: '🎚 Dashboard' },
  { id: 'income',    label: '💸 Income'    },
  { id: 'bills',     label: '📋 Bills'     },
  { id: 'debt',      label: '💳 Debt'      },
  { id: 'soft',      label: '✨ Soft Life' },
]

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [dark,          setDark]          = usePersistedState<boolean>('dark',         true)
  const [income,        setIncome]        = usePersistedState<IncomeEntry[]>('income',  INIT_INCOME)
  const [expenses,      setExpenses]      = usePersistedState<Expense[]>('expenses',   INIT_EXPENSES)
  const [debts,         setDebts]         = usePersistedState<Debt[]>('debts',         INIT_DEBTS)
  const [softLife,      setSoftLife]      = usePersistedState<SoftEntry[]>('soft',     INIT_SOFT)
  const [savingsGoal,   setSavingsGoal]   = usePersistedState<number>('savingsGoal',   1_000)
  const [savingsActual, setSavingsActual] = usePersistedState<number>('savingsActual', 0)
  const [tab,           setTab]           = useState<TabId>('dashboard')
  const [showReset,     setShowReset]     = useState(false)

  // ── Derived calculations ───────────────────────────────────────────────────
  const totalIncome   = income.reduce((s, i) => s + i.amount, 0)
  const activeExp     = expenses.filter((e) => e.status !== 'Cancelled')
  const totalBills    = activeExp.filter((e) => e.type === 'Fixed').reduce((s, e) => s + e.amount, 0)
  const totalSubs     = activeExp.filter((e) => e.type === 'Subscription').reduce((s, e) => s + e.amount, 0)
  const activeDebts   = debts.filter((d) => d.status === 'Active')
  const totalDebtMin  = activeDebts.reduce((s, d) => s + d.minPayment, 0)
  const totalDebt     = activeDebts.reduce((s, d) => s + d.balance, 0)
  const totalSoft     = softLife.reduce((s, e) => s + e.amount, 0)
  const remaining     = totalIncome - (totalBills + totalSubs + totalDebtMin + savingsActual + totalSoft)
  const savingsPct    = savingsGoal > 0 ? Math.min(100, (savingsActual / savingsGoal) * 100) : 0
  const debtPct       = Math.min(100, (Math.max(0, 7_900 - totalDebt) / 7_900) * 100)
  const healthScore   = calcScore({ remaining, savingsPct, debtPct, totalSubs })
  const level         = getLevel(healthScore)

  // ── Reset ─────────────────────────────────────────────────────────────────
  const handleReset = () => {
    setIncome(INIT_INCOME)
    setExpenses(INIT_EXPENSES)
    setDebts(INIT_DEBTS)
    setSoftLife(INIT_SOFT)
    setSavingsActual(0)
    setSavingsGoal(1_000)
    setShowReset(false)
  }

  // ── Dashboard data bag ────────────────────────────────────────────────────
  const dashData: DashboardData = {
    savingsGoal, savingsActual, setSavingsGoal, setSavingsActual,
    totalIncome, totalBills, totalSubs, totalDebtMin, totalSoft,
    remaining, totalDebt, healthScore,
  }

  const theme = dark ? DARK_THEME : LIGHT_THEME

  const headerGlass = dark ? 'rgba(8,8,8,0.92)' : 'rgba(250,247,243,0.92)'

  return (
    <div className="app-shell" style={{ ...theme, background: 'var(--bg)', minHeight: '100dvh', color: 'var(--text)', fontFamily: 'var(--sans)', transition: 'background 0.3s, color 0.3s' }}>

      {/* ── Sticky Header ─────────────────────────────────────────────────── */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 200,
        background: headerGlass,
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border)',
      }}
      className="app-header"
      >
        <div className="app-header-brand" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <VinylRecord progress={healthScore} size={38} spinning />
          <div style={{ minWidth: 0 }}>
            <div style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(1rem, 3.5vw, 1.1rem)', color: 'var(--accent)', letterSpacing: '-0.02em' }}>
              Money HQ
            </div>
            <div style={{ fontSize: '0.6rem', color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              {level.icon} {level.name}
            </div>
          </div>
        </div>

        <div className="app-header-alerts">
          {remaining  < 0   && <Pill color="#EF4444">⚠️ In the Red — {fmt(remaining)}</Pill>}
          {totalSubs  > 150 && <Pill color="#F59E0B">📡 Sub Alert</Pill>}
        </div>

        <div className="app-header-tools">
          <button
            type="button"
            onClick={() => setShowReset(true)}
            className="touch-target"
            style={{ background: 'none', border: '1px solid var(--border)', borderRadius: '0.6rem', padding: '0 0.75rem', color: 'var(--muted)', fontSize: '0.72rem', cursor: 'pointer', fontFamily: 'var(--sans)' }}
          >
            🔄 Reset
          </button>
          <button
            type="button"
            onClick={() => setDark((d) => !d)}
            className="touch-target"
            aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
            style={{ background: 'var(--card2)', border: '1px solid var(--border)', borderRadius: '2rem', padding: '0 0.875rem', color: 'var(--text)', fontSize: '0.875rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', fontFamily: 'var(--sans)' }}
          >
            {dark ? '☀️' : '🌙'}
          </button>
        </div>
      </header>

      {/* ── Tab Navigation ────────────────────────────────────────────────── */}
      <nav className="app-nav no-scrollbar" style={{ overflowX: 'auto', display: 'flex', gap: '0.35rem', borderBottom: '1px solid var(--border)', scrollbarWidth: 'none' }}>
        {TABS.map((t) => (
          <button
            type="button"
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              background:  tab === t.id ? 'var(--accent)' : 'transparent',
              color:       tab === t.id ? 'var(--on-accent)' : 'var(--muted)',
              border: `1px solid ${tab === t.id ? 'var(--accent)' : 'var(--border)'}`,
              borderRadius: '2rem', padding: '0.45rem 1.1rem',
              fontSize: '0.8rem', fontWeight: tab === t.id ? 700 : 500,
              cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.2s',
              fontFamily: 'var(--sans)',
            }}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {/* ── Main Content ──────────────────────────────────────────────────── */}
      <main className="app-main">
        {tab === 'dashboard' && <DashboardTab data={dashData} />}
        {tab === 'income'    && <IncomeTab    income={income}     setIncome={setIncome}     />}
        {tab === 'bills'     && <BillsTab     expenses={expenses} setExpenses={setExpenses} />}
        {tab === 'debt'      && <DebtTab      debts={debts}       setDebts={setDebts}       />}
        {tab === 'soft'      && <SoftLifeTab  softLife={softLife} setSoftLife={setSoftLife} />}
      </main>

      {/* ── Monthly Reset Modal ───────────────────────────────────────────── */}
      <Modal open={showReset} onClose={() => setShowReset(false)} title="🔄 Monthly Reset">
        <p style={{ color: 'var(--muted)', marginBottom: '1.5rem', lineHeight: 1.7, fontSize: '0.9rem' }}>
          This will wipe all entries and restore the default seed data. Savings progress and custom entries will be lost. This cannot be undone.
        </p>
        <div style={{ display: 'flex', gap: '0.625rem', justifyContent: 'flex-end' }}>
          <button onClick={() => setShowReset(false)} style={{ padding: '0.6rem 1.25rem', border: '1px solid var(--border)', borderRadius: '0.75rem', background: 'none', color: 'var(--text)', cursor: 'pointer', fontFamily: 'var(--sans)' }}>
            Cancel
          </button>
          <button onClick={handleReset} style={{ padding: '0.6rem 1.25rem', border: 'none', borderRadius: '0.75rem', background: '#EF4444', color: '#fff', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--sans)' }}>
            Reset Month
          </button>
        </div>
      </Modal>
    </div>
  )
}
