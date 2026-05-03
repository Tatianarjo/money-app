import type { Debt, Expense, IncomeEntry, MonthlyHistorySeries, SoftEntry } from '@/types'
import { shiftMonth } from '@/utils/month'

function sumIncomeForMonth(income: IncomeEntry[], month: string): number {
  return income.filter((i) => i.date.startsWith(month)).reduce((s, i) => s + i.amount, 0)
}

function sumSoftForMonth(soft: SoftEntry[], month: string): number {
  return soft.filter((e) => e.date.startsWith(month)).reduce((s, e) => s + e.amount, 0)
}

/** Bills/expenses marked paid for that month (uses template amount if no override). */
function sumPaidExpensesForMonth(expenses: Expense[], month: string): number {
  let s = 0
  for (const e of expenses) {
    if (e.status === 'Cancelled') continue
    const rec = e.paidByMonth?.[month]
    if (rec?.paid) s += rec.actualAmount ?? e.amount
  }
  return s
}

function totalActiveDebt(debts: Debt[]): number {
  return debts.filter((d) => d.status === 'Active').reduce((s, d) => s + d.balance, 0)
}

function totalDebtSnapshotForMonth(debts: Debt[], month: string, liveTotal: number, currentMonth: string): number | null {
  const active = debts.filter((d) => d.status === 'Active')
  if (active.length === 0) return 0

  if (month === currentMonth) return liveTotal

  const parts = active.map((d) => d.balanceByMonth?.[month])
  const defined = parts.filter((v): v is number => v !== undefined && !Number.isNaN(v))
  if (defined.length === 0) return null
  return defined.reduce((a, b) => a + b, 0)
}

export function buildSixMonthHistory(
  currentMonth: string,
  income: IncomeEntry[],
  softLife: SoftEntry[],
  expenses: Expense[],
  debts: Debt[],
  savingsByMonth: Record<string, number>,
  liveDebtTotal: number,
  liveSavingsActual: number,
): MonthlyHistorySeries {
  const months = Array.from({ length: 6 }, (_, i) => shiftMonth(currentMonth, i - 5))

  const incomePts = months.map((m) => sumIncomeForMonth(income, m))
  const spendPts = months.map((m) => sumSoftForMonth(softLife, m) + sumPaidExpensesForMonth(expenses, m))

  const debtPts = months.map((m) =>
    totalDebtSnapshotForMonth(debts, m, liveDebtTotal, currentMonth),
  )

  const savingsPts = months.map((m) => {
    if (m === currentMonth) return liveSavingsActual
    const v = savingsByMonth[m]
    return v !== undefined ? v : null
  })

  return {
    months: months,
    income: incomePts,
    spend: spendPts,
    debtTotal: debtPts,
    savings: savingsPts,
  }
}
