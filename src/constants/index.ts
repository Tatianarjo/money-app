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

// ─── Numeric Constants ────────────────────────────────────────────────────────

export const TOTAL_ORIG_DEBT = 7_900

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

// ─── Seed Data ────────────────────────────────────────────────────────────────

export const INIT_INCOME: IncomeEntry[] = [
  { id: uid(), source: 'Salary', amount: 6_000, date: '2026-05-01', type: 'Salary' },
]

export const INIT_EXPENSES: Expense[] = [
  { id: uid(), name: 'Rent',          amount: 1_950, category: 'Rent',      type: 'Fixed', billingDate: '1',  status: 'Active' },
  { id: uid(), name: 'Phone',         amount: 128,   category: 'Phone',     type: 'Fixed', billingDate: '15', status: 'Active' },
  { id: uid(), name: 'Car Insurance', amount: 160,   category: 'Insurance', type: 'Fixed', billingDate: '20', status: 'Active' },
]

export const INIT_DEBTS: Debt[] = [
  { id: uid(), cardName: 'Card 1', balance: 2_000, creditLimit: 3_000, minPayment: 40, priority: 'High',   status: 'Active' },
  { id: uid(), cardName: 'Card 2', balance: 2_000, creditLimit: 3_000, minPayment: 40, priority: 'High',   status: 'Active' },
  { id: uid(), cardName: 'Card 3', balance: 600,   creditLimit: 1_000, minPayment: 25, priority: 'Low',    status: 'Active' },
  { id: uid(), cardName: 'Card 4', balance: 1_800, creditLimit: 2_500, minPayment: 36, priority: 'Medium', status: 'Active' },
  { id: uid(), cardName: 'Card 5', balance: 1_500, creditLimit: 2_000, minPayment: 30, priority: 'Medium', status: 'Active' },
]

export const INIT_SOFT: SoftEntry[] = []
