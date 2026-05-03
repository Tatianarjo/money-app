import { useEffect, useMemo, useRef, useState } from 'react'
import { usePersistedState } from '@/hooks/usePersistedState'
import { calcScore, getLevel } from '@/utils/gamification'
import { fmt } from '@/utils/format'
import {
  seedIncome,
  INIT_EXPENSES,
  INIT_DEBTS,
  INIT_SOFT,
  DEFAULT_TOTAL_ORIG_DEBT,
} from '@/constants'
import { VinylRecord, Modal, Pill, Drawer } from '@/components/ui'
import { HelpContent } from '@/components/HelpContent'
import { PrintableReport } from '@/components/PrintableReport'
import { DashboardTab, IncomeTab, BillsTab, DebtTab, SoftLifeTab } from '@/components/tabs'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import type { IncomeEntry, Expense, Debt, SoftEntry, TabId, TabDef, DashboardData, ThemeStyle } from '@/types'
import { migrateDebts, migrateExpenses } from '@/utils/migrations'
import { shiftMonth, formatMonthLabel, monthKeyNow } from '@/utils/month'
import { buildSixMonthHistory } from '@/utils/history'
import {
  serializeBackup,
  parseBackupJson,
  applyBackupToLocalStorage,
  type BackupData,
} from '@/utils/backup'

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

const TABS: TabDef[] = [
  { id: 'dashboard', label: '🎚 Dashboard' },
  { id: 'income',    label: '💸 Income'    },
  { id: 'bills',     label: '📋 Bills'     },
  { id: 'debt',      label: '💳 Debt'      },
  { id: 'soft',      label: '✨ Soft Life' },
]

export default function App() {
  const [dark,           setDark]           = usePersistedState<boolean>('dark', true)
  const [income,         setIncome]         = usePersistedState<IncomeEntry[]>('income', seedIncome())
  const [expenses,       setExpenses]       = usePersistedState<Expense[]>('expenses', INIT_EXPENSES)
  const [debts,          setDebts]          = usePersistedState<Debt[]>('debts', INIT_DEBTS)
  const [softLife,       setSoftLife]       = usePersistedState<SoftEntry[]>('soft', INIT_SOFT)
  const [savingsGoal,    setSavingsGoal]    = usePersistedState<number>('savingsGoal', 1_000)
  const [savingsActual, setSavingsActual] = usePersistedState<number>('savingsActual', 0)
  const [currentMonth,   setCurrentMonth]   = usePersistedState<string>('currentMonth', monthKeyNow())
  const [savingsByMonth, setSavingsByMonth] = usePersistedState<Record<string, number>>('savingsByMonth', {})
  const [totalOrigDebt,  setTotalOrigDebt]  = usePersistedState<number>('totalOrigDebt', DEFAULT_TOTAL_ORIG_DEBT)
  const [helpSeen,       setHelpSeen]       = usePersistedState<boolean>('helpSeen', false)

  const [tab, setTab] = useState<TabId>('dashboard')
  const [showDataModal, setShowDataModal] = useState(false)
  const [showHelp, setShowHelp] = useState(false)
  const [reportGeneratedAt, setReportGeneratedAt] = useState(() => new Date())
  const [origDebtDraft, setOrigDebtDraft] = useState(String(totalOrigDebt))
  const importRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setOrigDebtDraft(String(totalOrigDebt))
  }, [totalOrigDebt])

  useEffect(() => {
    setExpenses((prev) => migrateExpenses(prev))
    setDebts((prev) => migrateDebts(prev))
  }, [setExpenses, setDebts])

  const incomeMonth = useMemo(
    () => income.filter((i) => i.date.startsWith(currentMonth)),
    [income, currentMonth],
  )
  const softMonth = useMemo(
    () => softLife.filter((s) => s.date.startsWith(currentMonth)),
    [softLife, currentMonth],
  )

  const totalIncome   = incomeMonth.reduce((s, i) => s + i.amount, 0)
  const activeExp     = expenses.filter((e) => e.status !== 'Cancelled')
  const totalBills    = activeExp.filter((e) => e.type === 'Fixed').reduce((s, e) => s + e.amount, 0)
  const totalSubs     = activeExp.filter((e) => e.type === 'Subscription').reduce((s, e) => s + e.amount, 0)
  const activeDebts   = debts.filter((d) => d.status === 'Active')
  const totalDebtMin  = activeDebts.reduce((s, d) => s + d.minPayment, 0)
  const totalDebt     = activeDebts.reduce((s, d) => s + d.balance, 0)
  const totalSoft     = softMonth.reduce((s, e) => s + e.amount, 0)
  const remaining     = totalIncome - (totalBills + totalSubs + totalDebtMin + savingsActual + totalSoft)
  const savingsPct    = savingsGoal > 0 ? Math.min(100, (savingsActual / savingsGoal) * 100) : 0
  const debtPct       = totalOrigDebt > 0
    ? Math.min(100, (Math.max(0, totalOrigDebt - totalDebt) / totalOrigDebt) * 100)
    : 0
  const healthScore   = calcScore({ remaining, savingsPct, debtPct, totalSubs })
  const level         = getLevel(healthScore)

  const history = useMemo(
    () =>
      buildSixMonthHistory(
        currentMonth,
        income,
        softLife,
        expenses,
        debts,
        savingsByMonth,
        totalDebt,
        savingsActual,
      ),
    [currentMonth, income, softLife, expenses, debts, savingsByMonth, totalDebt, savingsActual],
  )

  const handleReset = () => {
    setIncome(seedIncome())
    setExpenses(INIT_EXPENSES)
    setDebts(INIT_DEBTS)
    setSoftLife(INIT_SOFT)
    setSavingsActual(0)
    setSavingsGoal(1_000)
    setCurrentMonth(monthKeyNow())
    setSavingsByMonth({})
    setTotalOrigDebt(DEFAULT_TOTAL_ORIG_DEBT)
    setShowDataModal(false)
  }

  const closeMonthAndAdvance = () => {
    const leaving = currentMonth
    setDebts((prev) =>
      prev.map((d) => ({
        ...d,
        balanceByMonth: {
          ...(d.balanceByMonth ?? {}),
          ...(d.status === 'Active' ? { [leaving]: d.balance } : {}),
        },
      })),
    )
    setSavingsByMonth((prev) => ({ ...prev, [leaving]: savingsActual }))
    setCurrentMonth(shiftMonth(leaving, 1))
  }

  const exportJson = () => {
    const payload: BackupData = {
      dark,
      income,
      expenses,
      debts,
      soft: softLife,
      savingsGoal,
      savingsActual,
      currentMonth,
      savingsByMonth,
      totalOrigDebt,
    }
    const blob = new Blob([serializeBackup(payload)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `money-hq-backup-${currentMonth}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const onImportPick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    try {
      const text = await file.text()
      const backup = parseBackupJson(text)
      applyBackupToLocalStorage(backup.data)
      window.location.reload()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Import failed')
    }
  }

  const saveOrigDebtSetting = () => {
    const n = Number(origDebtDraft.replace(/,/g, ''))
    if (!Number.isFinite(n) || n <= 0) {
      alert('Enter a positive number for starting debt baseline.')
      return
    }
    setTotalOrigDebt(Math.round(n))
  }

  const dashData: DashboardData = {
    savingsGoal,
    savingsActual,
    setSavingsGoal,
    setSavingsActual,
    totalIncome,
    totalBills,
    totalSubs,
    totalDebtMin,
    totalSoft,
    remaining,
    totalDebt,
    healthScore,
    totalOrigDebt,
    currentMonth,
    currentMonthLabel: formatMonthLabel(currentMonth),
    history,
  }

  const theme = dark ? DARK_THEME : LIGHT_THEME
  const headerGlass = dark ? 'rgba(8,8,8,0.92)' : 'rgba(250,247,243,0.92)'

  return (
    <div className="app-shell" style={{ ...theme, background: 'var(--bg)', minHeight: '100dvh', color: 'var(--text)', fontFamily: 'var(--sans)', transition: 'background 0.3s, color 0.3s' }}>

      <header style={{
        position: 'sticky', top: 0, zIndex: 200,
        background: headerGlass,
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border)',
      }}
      className="app-header"
      >
        <div className="app-header-brand" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <VinylRecord progress={healthScore} size={38} spinning />
          <div style={{ minWidth: 0 }}>
            <div style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(1rem, 3.5vw, 1.1rem)', color: 'var(--accent)', letterSpacing: '-0.02em' }}>
              Money HQ
            </div>
            <div style={{ fontSize: '0.62rem', color: '#EC4899', fontWeight: 600, letterSpacing: '0.04em', marginTop: 2 }}>
              Your Budget Assistant
            </div>
            <div style={{ fontSize: '0.6rem', color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 3 }}>
              {level.icon} {level.name}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginLeft: 'auto', flexWrap: 'wrap' }} className="app-month-switcher">
            <button
              type="button"
              aria-label="Previous month"
              onClick={() => setCurrentMonth((m) => shiftMonth(m, -1))}
              style={{
                background: 'var(--card2)', border: '1px solid var(--border)', borderRadius: '0.5rem',
                width: 36, height: 36, cursor: 'pointer', color: 'var(--text)', fontSize: '1rem',
              }}
            >
              ◀
            </button>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text)', minWidth: '6.5rem', textAlign: 'center' }}>
              {formatMonthLabel(currentMonth)}
            </span>
            <button
              type="button"
              aria-label="Next month"
              onClick={() => setCurrentMonth((m) => shiftMonth(m, 1))}
              style={{
                background: 'var(--card2)', border: '1px solid var(--border)', borderRadius: '0.5rem',
                width: 36, height: 36, cursor: 'pointer', color: 'var(--text)', fontSize: '1rem',
              }}
            >
              ▶
            </button>
            <button
              type="button"
              title="Snapshot balances & savings for this month, then move to next month"
              onClick={closeMonthAndAdvance}
              style={{
                background: 'var(--accent)', color: 'var(--on-accent)', border: 'none', borderRadius: '0.5rem',
                padding: '0 0.65rem', height: 36, fontSize: '0.65rem', fontWeight: 800, cursor: 'pointer', fontFamily: 'var(--sans)',
                whiteSpace: 'nowrap',
              }}
            >
              Close month →
            </button>
          </div>
        </div>

        <div className="app-header-alerts">
          {remaining  < 0   && <Pill color="#EF4444">⚠️ In the Red — {fmt(remaining)}</Pill>}
          {totalSubs  > 150 && <Pill color="#F59E0B">📡 Sub Alert</Pill>}
        </div>

        <div className="app-header-tools">
          <button
            type="button"
            onClick={() => {
              setShowHelp(true)
              setHelpSeen(true)
            }}
            className="touch-target"
            aria-expanded={showHelp}
            aria-controls="help-drawer"
            style={{ position: 'relative', background: 'none', border: '1px solid var(--border)', borderRadius: '0.6rem', padding: '0 0.75rem', color: 'var(--muted)', fontSize: '0.72rem', cursor: 'pointer', fontFamily: 'var(--sans)' }}
          >
            ? Help
            {!helpSeen && (
              <span
                aria-hidden
                style={{
                  position: 'absolute',
                  top: 4,
                  right: 6,
                  width: 7,
                  height: 7,
                  borderRadius: '50%',
                  background: 'var(--accent)',
                  boxShadow: '0 0 0 2px var(--bg)',
                }}
              />
            )}
          </button>
          <button
            type="button"
            onClick={() => setShowDataModal(true)}
            className="touch-target"
            style={{ background: 'none', border: '1px solid var(--border)', borderRadius: '0.6rem', padding: '0 0.75rem', color: 'var(--muted)', fontSize: '0.72rem', cursor: 'pointer', fontFamily: 'var(--sans)' }}
          >
            💾 Data
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

      <ErrorBoundary>
        <main className="app-main">
          {tab === 'dashboard' && <DashboardTab data={dashData} />}
          {tab === 'income'    && <IncomeTab    income={income}     setIncome={setIncome}     currentMonth={currentMonth} />}
          {tab === 'bills'     && <BillsTab     expenses={expenses} setExpenses={setExpenses} currentMonth={currentMonth} />}
          {tab === 'debt'      && <DebtTab      debts={debts}       setDebts={setDebts}       totalOrigDebt={totalOrigDebt} />}
          {tab === 'soft'      && <SoftLifeTab  softLife={softLife} setSoftLife={setSoftLife} currentMonth={currentMonth} />}
        </main>
      </ErrorBoundary>

      <footer
        className="app-footer"
        style={{
          textAlign: 'center',
          padding: '1.25rem max(1rem, env(safe-area-inset-right)) calc(1rem + env(safe-area-inset-bottom, 0px)) max(1rem, env(safe-area-inset-left))',
          borderTop: '1px solid var(--border)',
          fontSize: '0.72rem',
          fontFamily: 'var(--sans)',
        }}
      >
        <a
          href="https://eyecodeglitter.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: '#EC4899', textDecoration: 'none', fontWeight: 600 }}
        >
          Powered By eyeCODEGlitter
        </a>
      </footer>

      <div className="print-mount" aria-hidden>
        <PrintableReport
          generatedAt={reportGeneratedAt}
          currentMonth={currentMonth}
          income={income}
          expenses={expenses}
          debts={debts}
          softLife={softLife}
          savingsGoal={savingsGoal}
          savingsActual={savingsActual}
          savingsByMonth={savingsByMonth}
          totalOrigDebt={totalOrigDebt}
          healthScore={healthScore}
        />
      </div>

      <input ref={importRef} type="file" accept="application/json,.json" style={{ display: 'none' }} onChange={onImportPick} />

      <Modal open={showDataModal} onClose={() => setShowDataModal(false)} title="💾 Data & backup">
        <p style={{ color: 'var(--muted)', marginBottom: '1rem', lineHeight: 1.7, fontSize: '0.9rem' }}>
          Export a JSON file to move data between your phone and laptop. Import replaces everything in this browser and reloads the app.
        </p>

        <div style={{ marginBottom: '1.25rem', padding: '1rem', background: 'var(--card2)', borderRadius: '0.75rem', border: '1px solid var(--border)' }}>
          <div style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>
            Debt payoff baseline
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <input
              type="text"
              inputMode="decimal"
              value={origDebtDraft}
              onChange={(e) => setOrigDebtDraft(e.target.value)}
              style={{
                width: 120, padding: '0.5rem 0.65rem', borderRadius: '0.6rem', border: '1px solid var(--border)',
                background: 'var(--input)', color: 'var(--text)', fontFamily: 'var(--sans)', fontSize: '0.9rem',
              }}
            />
            <button
              type="button"
              onClick={saveOrigDebtSetting}
              style={{
                padding: '0.5rem 1rem', border: 'none', borderRadius: '0.6rem', background: 'var(--accent)', color: 'var(--on-accent)',
                fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--sans)', fontSize: '0.8rem',
              }}
            >
              Save
            </button>
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--muted)', marginTop: '0.5rem' }}>
            Used for debt progress bars (starting total to pay down).
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.25rem' }}>
          <button
            type="button"
            onClick={() => {
              setReportGeneratedAt(new Date())
              setShowDataModal(false)
              setTimeout(() => window.print(), 50)
            }}
            style={{
              padding: '0.65rem 1rem',
              border: '1px solid var(--border)',
              borderRadius: '0.75rem',
              background: 'var(--card2)',
              color: 'var(--text)',
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'var(--sans)',
              fontSize: '0.88rem',
            }}
          >
            Print / Save as PDF
          </button>
          <button
            type="button"
            onClick={exportJson}
            style={{
              padding: '0.65rem 1rem', border: '1px solid var(--accent)', borderRadius: '0.75rem', background: 'var(--accent)', color: 'var(--on-accent)',
              fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--sans)', fontSize: '0.88rem',
            }}
          >
            Export JSON
          </button>
          <button
            type="button"
            onClick={() => importRef.current?.click()}
            style={{
              padding: '0.65rem 1rem', border: '1px solid var(--border)', borderRadius: '0.75rem', background: 'var(--card2)', color: 'var(--text)',
              fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--sans)', fontSize: '0.88rem',
            }}
          >
            Import JSON…
          </button>
        </div>

        <p style={{ color: '#FB7185', marginBottom: '1rem', lineHeight: 1.6, fontSize: '0.82rem' }}>
          Reset wipes all entries and restores fresh seed data for the current calendar month. This cannot be undone.
        </p>

        <div className="save-cancel-row" style={{ display: 'flex', gap: '0.625rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
          <button type="button" onClick={() => setShowDataModal(false)} style={{ padding: '0.6rem 1.25rem', border: '1px solid var(--border)', borderRadius: '0.75rem', background: 'none', color: 'var(--text)', cursor: 'pointer', fontFamily: 'var(--sans)' }}>
            Close
          </button>
          <button type="button" onClick={handleReset} style={{ padding: '0.6rem 1.25rem', border: 'none', borderRadius: '0.75rem', background: '#EF4444', color: '#fff', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--sans)' }}>
            Reset everything
          </button>
        </div>
      </Modal>

      <Drawer open={showHelp} onClose={() => setShowHelp(false)} title="How Money HQ works" panelId="help-drawer">
        <HelpContent />
      </Drawer>
    </div>
  )
}
