// ─── Primitive Union Types ────────────────────────────────────────────────────

export type IncomeType =
  | 'Salary'
  | 'DJ Gig'
  | 'Contract Work'
  | 'Other'

export type ExpenseCat =
  | 'Rent'
  | 'Phone'
  | 'Insurance'
  | 'Food'
  | 'Subscriptions'
  | 'Transportation'
  | 'Leisure'
  | 'Debt'
  | 'Savings'
  | 'Other'

export type ExpenseType   = 'Fixed' | 'Variable' | 'Subscription'
export type ExpenseStatus = 'Active' | 'Cancelled' | 'Paid'
export type DebtPriority  = 'High' | 'Medium' | 'Low'
export type DebtStatus    = 'Active' | 'Paid Off'
export type SoftCat =
  | 'Eating Out'
  | 'Events'
  | 'Shopping'
  | 'Travel'
  | 'Beauty'
  | 'DJ / Music'
  | 'Miscellaneous'

export type TabId = 'dashboard' | 'income' | 'bills' | 'debt' | 'soft'

// ─── Data Models ──────────────────────────────────────────────────────────────

export interface IncomeEntry {
  id: string
  source: string
  amount: number
  date: string
  type: IncomeType
}

/** Per-calendar-month bill payment record (recurring template). */
export interface ExpensePaidMonth {
  paid: boolean
  /** Optional override when paid differs from template amount */
  actualAmount?: number
}

export interface Expense {
  id: string
  name: string
  amount: number
  category: ExpenseCat
  type: ExpenseType
  billingDate: string
  status: ExpenseStatus
  paidByMonth?: Record<string, ExpensePaidMonth>
}

export interface Debt {
  id: string
  cardName: string
  balance: number
  creditLimit: number
  minPayment: number
  priority: DebtPriority
  status: DebtStatus
  /** Snapshot of balance at month-end when closing a month */
  balanceByMonth?: Record<string, number>
}

export interface SoftEntry {
  id: string
  category: SoftCat
  amount: number
  date: string
  note: string
}

// ─── Gamification ─────────────────────────────────────────────────────────────

export interface Level {
  name: string
  icon: string
  min: number
  desc: string
}

// ─── Form Shapes (amounts as strings to match <input> values) ─────────────────

export interface IncomeForm {
  source: string
  amount: string
  date: string
  type: IncomeType
}

export interface ExpenseForm {
  name: string
  amount: string
  category: ExpenseCat
  type: ExpenseType
  billingDate: string
  status: ExpenseStatus
}

export interface DebtForm {
  cardName: string
  balance: string
  creditLimit: string
  minPayment: string
  priority: DebtPriority
  status: DebtStatus
}

export interface SoftForm {
  category: SoftCat
  amount: string
  date: string
  note: string
}

// ─── Dashboard aggregated data passed as a prop ───────────────────────────────

export interface MonthlyHistorySeries {
  /** Six month keys oldest → newest */
  months: string[]
  income: number[]
  spend: number[]
  /** Total active debt; null if no snapshot for that month */
  debtTotal: (number | null)[]
  savings: (number | null)[]
}

export interface DashboardData {
  savingsGoal: number
  savingsActual: number
  setSavingsGoal: (v: number) => void
  setSavingsActual: (v: number) => void
  totalIncome: number
  totalBills: number
  totalSubs: number
  totalDebtMin: number
  totalSoft: number
  remaining: number
  totalDebt: number
  healthScore: number
  totalOrigDebt: number
  currentMonth: string
  currentMonthLabel: string
  history: MonthlyHistorySeries
}

// ─── Misc UI ──────────────────────────────────────────────────────────────────

export interface TabDef {
  id: TabId
  label: string
}

export interface SummaryCard {
  label: string
  emoji: string
  val: number
  color: string
  warn?: boolean
  big?: boolean
}

// CSS custom properties aren't in React.CSSProperties by default
export type ThemeStyle = React.CSSProperties & {
  [key: `--${string}`]: string | number
}
