import { useMemo } from 'react'
import type { Debt, Expense, ExpensePaidMonth, IncomeEntry, SoftEntry } from '@/types'
import { fmt } from '@/utils/format'
import { getLevel } from '@/utils/gamification'
import { formatMonthLabel } from '@/utils/month'

export interface PrintableReportProps {
  generatedAt: Date
  currentMonth: string
  income: IncomeEntry[]
  expenses: Expense[]
  debts: Debt[]
  softLife: SoftEntry[]
  savingsGoal: number
  savingsActual: number
  savingsByMonth: Record<string, number>
  totalOrigDebt: number
  healthScore: number
}

interface PaidRow {
  month: string
  bill: string
  amount: number
}

interface DebtHistRow {
  month: string
  card: string
  balance: number
}

export function PrintableReport({
  generatedAt,
  currentMonth,
  income,
  expenses,
  debts,
  softLife,
  savingsGoal,
  savingsActual,
  savingsByMonth,
  totalOrigDebt,
  healthScore,
}: PrintableReportProps) {
  const level = getLevel(healthScore)

  const activeExp = useMemo(() => expenses.filter((e) => e.status !== 'Cancelled'), [expenses])
  const activeDebts = useMemo(() => debts.filter((d) => d.status === 'Active'), [debts])
  const paidOffDebts = useMemo(() => debts.filter((d) => d.status === 'Paid Off'), [debts])

  const totals = useMemo(() => {
    const totalIncomeAll = income.reduce((s, i) => s + i.amount, 0)
    const totalFixed = activeExp.filter((e) => e.type === 'Fixed').reduce((s, e) => s + e.amount, 0)
    const totalSubs = activeExp.filter((e) => e.type === 'Subscription').reduce((s, e) => s + e.amount, 0)
    const totalVar = activeExp.filter((e) => e.type === 'Variable').reduce((s, e) => s + e.amount, 0)
    const totalActiveDebt = activeDebts.reduce((s, d) => s + d.balance, 0)
    const totalSoftAll = softLife.reduce((s, e) => s + e.amount, 0)
    const debtPaidVsBaseline = Math.max(0, totalOrigDebt - totalActiveDebt)
    return {
      totalIncomeAll,
      totalFixed,
      totalSubs,
      totalVar,
      totalActiveDebt,
      totalSoftAll,
      debtPaidVsBaseline,
    }
  }, [income, activeExp, activeDebts, softLife, totalOrigDebt])

  const incomeRows = useMemo(
    () => [...income].sort((a, b) => b.date.localeCompare(a.date) || a.source.localeCompare(b.source)),
    [income],
  )

  const paidRows = useMemo(() => {
    const rows: PaidRow[] = []
    for (const e of expenses) {
      const pm = e.paidByMonth ?? {}
      for (const [month, rec] of Object.entries(pm) as [string, ExpensePaidMonth][]) {
        if (rec.paid) rows.push({ month, bill: e.name, amount: rec.actualAmount ?? e.amount })
      }
    }
    rows.sort((a, b) => b.month.localeCompare(a.month) || a.bill.localeCompare(b.bill))
    return rows
  }, [expenses])

  const debtHistRows = useMemo(() => {
    const rows: DebtHistRow[] = []
    for (const d of debts) {
      for (const [month, bal] of Object.entries(d.balanceByMonth ?? {}) as [string, number][]) {
        rows.push({ month, card: d.cardName, balance: bal })
      }
    }
    rows.sort((a, b) => b.month.localeCompare(a.month) || a.card.localeCompare(b.card))
    return rows
  }, [debts])

  const savingsRows = useMemo(() => {
    return Object.entries(savingsByMonth)
      .map(([month, saved]) => ({ month, saved }))
      .sort((a, b) => b.month.localeCompare(a.month))
  }, [savingsByMonth])

  const softRows = useMemo(
    () => [...softLife].sort((a, b) => b.date.localeCompare(a.date)),
    [softLife],
  )

  return (
    <div className="print-root">
      <h1>Money HQ — Full statement</h1>
      <p style={{ marginBottom: '12pt', fontSize: '10pt' }}>
        Generated {generatedAt.toLocaleString()} · Viewing month: <strong>{formatMonthLabel(currentMonth)}</strong>
        {' · '}
        Health score: <strong>{healthScore}</strong> / 100 ({level.icon} {level.name})
      </p>

      <h2>Summary</h2>
      <table>
        <thead>
          <tr>
            <th>Item</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Total income (all entries)</td>
            <td>{fmt(totals.totalIncomeAll)}</td>
          </tr>
          <tr>
            <td>Fixed bills (active templates)</td>
            <td>{fmt(totals.totalFixed)}</td>
          </tr>
          <tr>
            <td>Subscriptions (active templates)</td>
            <td>{fmt(totals.totalSubs)}</td>
          </tr>
          <tr>
            <td>Variable expenses (active templates)</td>
            <td>{fmt(totals.totalVar)}</td>
          </tr>
          <tr>
            <td>Soft life spending (all entries)</td>
            <td>{fmt(totals.totalSoftAll)}</td>
          </tr>
          <tr>
            <td>Active debt (total balances)</td>
            <td>{fmt(totals.totalActiveDebt)}</td>
          </tr>
          <tr>
            <td>Debt cleared vs baseline ({fmt(totalOrigDebt)} baseline)</td>
            <td>{fmt(totals.debtPaidVsBaseline)}</td>
          </tr>
          <tr>
            <td>Savings goal / saved (current)</td>
            <td>
              {fmt(savingsGoal)} / {fmt(savingsActual)}
            </td>
          </tr>
        </tbody>
      </table>

      <h2>Income (all)</h2>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Source</th>
            <th>Type</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {incomeRows.map((r) => (
            <tr key={r.id}>
              <td>{r.date}</td>
              <td>{r.source}</td>
              <td>{r.type}</td>
              <td>{fmt(r.amount)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={3}>Total</td>
            <td>{fmt(totals.totalIncomeAll)}</td>
          </tr>
        </tfoot>
      </table>

      <h2>Bills (templates)</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Type</th>
            <th>Status</th>
            <th>Billing day</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((e) => (
            <tr key={e.id}>
              <td>{e.name}</td>
              <td>{e.category}</td>
              <td>{e.type}</td>
              <td>{e.status}</td>
              <td>{e.billingDate || '—'}</td>
              <td>{fmt(e.amount)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={5}>Active non-cancelled total (all types)</td>
            <td>{fmt(activeExp.reduce((s, e) => s + e.amount, 0))}</td>
          </tr>
        </tfoot>
      </table>

      <h2>Bills paid (by month)</h2>
      <table>
        <thead>
          <tr>
            <th>Month</th>
            <th>Bill</th>
            <th>Amount paid</th>
          </tr>
        </thead>
        <tbody>
          {paidRows.length === 0 ? (
            <tr>
              <td colSpan={3}>No paid records</td>
            </tr>
          ) : (
            paidRows.map((r, i) => (
              <tr key={`${r.month}-${r.bill}-${i}`}>
                <td>{r.month}</td>
                <td>{r.bill}</td>
                <td>{fmt(r.amount)}</td>
              </tr>
            ))
          )}
        </tbody>
        {paidRows.length > 0 && (
          <tfoot>
            <tr>
              <td colSpan={2}>Total paid (all months)</td>
              <td>{fmt(paidRows.reduce((s, r) => s + r.amount, 0))}</td>
            </tr>
          </tfoot>
        )}
      </table>

      <h2>Debt — active</h2>
      <table>
        <thead>
          <tr>
            <th>Card</th>
            <th>Priority</th>
            <th>Balance</th>
            <th>Min payment</th>
            <th>Limit</th>
            <th>Utilization</th>
          </tr>
        </thead>
        <tbody>
          {activeDebts.length === 0 ? (
            <tr>
              <td colSpan={6}>No active debt</td>
            </tr>
          ) : (
            activeDebts.map((d) => (
              <tr key={d.id}>
                <td>{d.cardName}</td>
                <td>{d.priority}</td>
                <td>{fmt(d.balance)}</td>
                <td>{fmt(d.minPayment)}</td>
                <td>{d.creditLimit ? fmt(d.creditLimit) : '—'}</td>
                <td>
                  {d.creditLimit > 0 ? `${((d.balance / d.creditLimit) * 100).toFixed(0)}%` : '—'}
                </td>
              </tr>
            ))
          )}
        </tbody>
        {activeDebts.length > 0 && (
          <tfoot>
            <tr>
              <td colSpan={2}>Totals</td>
              <td>{fmt(totals.totalActiveDebt)}</td>
              <td>{fmt(activeDebts.reduce((s, d) => s + d.minPayment, 0))}</td>
              <td colSpan={2} />
            </tr>
          </tfoot>
        )}
      </table>

      <h2>Debt — paid off</h2>
      <table>
        <thead>
          <tr>
            <th>Card</th>
            <th>Credit limit</th>
            <th>Min payment (at payoff)</th>
          </tr>
        </thead>
        <tbody>
          {paidOffDebts.length === 0 ? (
            <tr>
              <td colSpan={3}>None</td>
            </tr>
          ) : (
            paidOffDebts.map((d) => (
              <tr key={d.id}>
                <td>{d.cardName}</td>
                <td>{d.creditLimit ? fmt(d.creditLimit) : '—'}</td>
                <td>{fmt(d.minPayment)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <h2>Debt balance history (snapshots)</h2>
      <table>
        <thead>
          <tr>
            <th>Month</th>
            <th>Card</th>
            <th>Balance</th>
          </tr>
        </thead>
        <tbody>
          {debtHistRows.length === 0 ? (
            <tr>
              <td colSpan={3}>No snapshots yet (use Close month to record)</td>
            </tr>
          ) : (
            debtHistRows.map((r, i) => (
              <tr key={`${r.month}-${r.card}-${i}`}>
                <td>{r.month}</td>
                <td>{r.card}</td>
                <td>{fmt(r.balance)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <h2>Soft life (all)</h2>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Category</th>
            <th>Amount</th>
            <th>Note</th>
          </tr>
        </thead>
        <tbody>
          {softRows.map((r) => (
            <tr key={r.id}>
              <td>{r.date}</td>
              <td>{r.category}</td>
              <td>{fmt(r.amount)}</td>
              <td>{r.note || '—'}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={2}>Total</td>
            <td>{fmt(totals.totalSoftAll)}</td>
            <td />
          </tr>
        </tfoot>
      </table>

      <h2>Savings by month (snapshots)</h2>
      <table>
        <thead>
          <tr>
            <th>Month</th>
            <th>Saved</th>
          </tr>
        </thead>
        <tbody>
          {savingsRows.length === 0 ? (
            <tr>
              <td colSpan={2}>No snapshots yet</td>
            </tr>
          ) : (
            savingsRows.map((r) => (
              <tr key={r.month}>
                <td>{r.month}</td>
                <td>{fmt(r.saved)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
