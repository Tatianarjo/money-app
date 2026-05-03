import type {
  IncomeEntry,
  Expense,
  Debt,
  SoftEntry,
  IncomeType,
  ExpenseCat,
  ExpenseType,
  ExpenseStatus,
  DebtPriority,
  DebtStatus,
  SoftCat,
} from '@/types'

// ─── ID Helper ────────────────────────────────────────────────────────────────

export const uid = (): string =>
  Date.now().toString(36) + Math.random().toString(36).slice(2, 6)

// ─── Defaults ─────────────────────────────────────────────────────────────────

/** Starting payoff baseline for progress bars (editable in Data settings). */
export const DEFAULT_TOTAL_ORIG_DEBT = 0

// ─── Select Options ───────────────────────────────────────────────────────────

export const INCOME_TYPES: IncomeType[] = [
  'Salary',
  'DJ Gig',
  'Contract Work',
  'Other',
]

export const EXPENSE_CATS: ExpenseCat[] = [
  'Rent',
  'Phone',
  'Insurance',
  'Food',
  'Subscriptions',
  'Transportation',
  'Leisure',
  'Debt',
  'Savings',
  'Other',
]

export const EXPENSE_TYPES: ExpenseType[] = ['Fixed', 'Variable', 'Subscription']

export const EXPENSE_STATUSES: ExpenseStatus[] = ['Active', 'Cancelled', 'Paid']

export const DEBT_PRIORITIES: DebtPriority[] = ['High', 'Medium', 'Low']

export const DEBT_STATUSES: DebtStatus[] = ['Active', 'Paid Off']

export const SOFT_CATS: SoftCat[] = [
  'Eating Out',
  'Events',
  'Shopping',
  'Travel',
  'Beauty',
  'DJ / Music',
  'Miscellaneous',
]

// ─── Fresh-install defaults (empty — user adds their own entries) ────────────

export const INIT_INCOME: IncomeEntry[] = []
export const INIT_EXPENSES: Expense[] = []
export const INIT_DEBTS: Debt[] = []
export const INIT_SOFT: SoftEntry[] = []
