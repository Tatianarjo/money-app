import type { Debt, Expense } from '@/types'

export function migrateExpense(e: Expense): Expense {
  return {
    ...e,
    paidByMonth: e.paidByMonth ?? {},
  }
}

export function migrateDebt(d: Debt): Debt {
  return {
    ...d,
    balanceByMonth: d.balanceByMonth ?? {},
  }
}

export function migrateExpenses(list: Expense[]): Expense[] {
  return list.map(migrateExpense)
}

export function migrateDebts(list: Debt[]): Debt[] {
  return list.map(migrateDebt)
}
