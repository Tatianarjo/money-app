import type { Expense, DueSoonRow } from '@/types'

/** Local calendar date for tomorrow (YYYY-MM-DD), noon to reduce DST edge cases. */
export function tomorrowDateKey(): string {
  const t = new Date()
  t.setHours(12, 0, 0, 0)
  t.setDate(t.getDate() + 1)
  const y = t.getFullYear()
  const m = String(t.getMonth() + 1).padStart(2, '0')
  const d = String(t.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/**
 * Bills whose recurring due day matches **tomorrow’s** calendar day-of-month (active only).
 * E.g. tomorrow is the 5th → any bill with due day 5.
 */
export function getBillsDueTomorrow(expenses: Expense[]): Expense[] {
  const t = new Date()
  t.setHours(12, 0, 0, 0)
  t.setDate(t.getDate() + 1)
  const dom = t.getDate()
  return expenses.filter((e) => {
    if (e.status !== 'Active') return false
    const b = parseBillingDayOfMonth(e.billingDate)
    return b === dom
  })
}

/** Parse billing day of month (1–31) from stored string; invalid → null. */
export function parseBillingDayOfMonth(raw: string): number | null {
  const n = parseInt(String(raw).trim(), 10)
  if (!Number.isFinite(n) || n < 1 || n > 31) return null
  return n
}

function ordinalDay(n: number): string {
  const mod100 = n % 100
  const mod10 = n % 10
  if (mod100 >= 11 && mod100 <= 13) return `${n}th`
  if (mod10 === 1) return `${n}st`
  if (mod10 === 2) return `${n}nd`
  if (mod10 === 3) return `${n}rd`
  return `${n}th`
}

function calendarMonthKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

/**
 * Active bills with a valid due day, sorted for the dashboard: overdue first (when viewing
 * the current calendar month), then by day of month.
 */
export function buildDueSoonList(expenses: Expense[], currentMonth: string): DueSoonRow[] {
  const now = new Date()
  const todayKey = calendarMonthKey(now)
  const todayDom = now.getDate()
  const viewingIsThisCalendarMonth = currentMonth === todayKey

  const rows: DueSoonRow[] = []
  for (const e of expenses) {
    if (e.status === 'Cancelled') continue
    const day = parseBillingDayOfMonth(e.billingDate)
    if (day === null) continue

    const paidThisMonth = Boolean(e.paidByMonth?.[currentMonth]?.paid)
    let relativeLabel: string | null = null
    let overdue = false

    if (viewingIsThisCalendarMonth) {
      if (day < todayDom) {
        overdue = true
        const d = todayDom - day
        relativeLabel = d === 1 ? '1 day overdue' : `${d} days overdue`
      } else if (day === todayDom) {
        relativeLabel = 'Due today'
      } else {
        const d = day - todayDom
        relativeLabel = d === 1 ? 'Due tomorrow' : `Due in ${d} days`
      }
    }

    rows.push({
      id: e.id,
      name: e.name,
      amount: e.amount,
      day,
      dueLine: `Due on the ${ordinalDay(day)} of each month`,
      relativeLabel,
      overdue,
      paidThisMonth,
    })
  }

  rows.sort((a, b) => {
    if (viewingIsThisCalendarMonth) {
      if (a.overdue !== b.overdue) return a.overdue ? -1 : 1
    }
    return a.day - b.day
  })

  return rows
}
