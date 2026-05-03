import type { Debt, Expense, IncomeEntry, SoftEntry } from '@/types'
import { store } from '@/utils/store'

export const EXPORT_VERSION = 1 as const

export interface BackupData {
  dark: boolean
  income: IncomeEntry[]
  expenses: Expense[]
  debts: Debt[]
  soft: SoftEntry[]
  savingsGoal: number
  savingsActual: number
  currentMonth: string
  savingsByMonth: Record<string, number>
  totalOrigDebt: number
}

export interface BackupFile {
  version: typeof EXPORT_VERSION
  exportedAt: string
  data: BackupData
}

export function buildBackupPayload(state: BackupData): BackupFile {
  return {
    version: EXPORT_VERSION,
    exportedAt: new Date().toISOString(),
    data: state,
  }
}

export function serializeBackup(state: BackupData): string {
  return JSON.stringify(buildBackupPayload(state), null, 2)
}

export function parseBackupJson(raw: string): BackupFile {
  const parsed: unknown = JSON.parse(raw)
  if (!parsed || typeof parsed !== 'object') throw new Error('Invalid backup file')
  const o = parsed as Record<string, unknown>
  if (o.version !== EXPORT_VERSION) throw new Error(`Unsupported backup version: ${String(o.version)}`)
  if (!o.data || typeof o.data !== 'object') throw new Error('Missing data')

  const d = o.data as Record<string, unknown>
  const required = [
    'dark',
    'income',
    'expenses',
    'debts',
    'soft',
    'savingsGoal',
    'savingsActual',
    'currentMonth',
    'savingsByMonth',
    'totalOrigDebt',
  ] as const
  for (const k of required) {
    if (!(k in d)) throw new Error(`Missing field: ${k}`)
  }

  return {
    version: EXPORT_VERSION,
    exportedAt: typeof o.exportedAt === 'string' ? o.exportedAt : new Date().toISOString(),
    data: {
      dark: Boolean(d.dark),
      income: d.income as IncomeEntry[],
      expenses: d.expenses as Expense[],
      debts: d.debts as Debt[],
      soft: d.soft as SoftEntry[],
      savingsGoal: Number(d.savingsGoal),
      savingsActual: Number(d.savingsActual),
      currentMonth: String(d.currentMonth),
      savingsByMonth: d.savingsByMonth as Record<string, number>,
      totalOrigDebt: Number(d.totalOrigDebt),
    },
  }
}

/** Apply imported backup to localStorage using the same keys as usePersistedState. */
export function applyBackupToLocalStorage(data: BackupData): void {
  const map: [string, unknown][] = [
    ['dark', data.dark],
    ['income', data.income],
    ['expenses', data.expenses],
    ['debts', data.debts],
    ['soft', data.soft],
    ['savingsGoal', data.savingsGoal],
    ['savingsActual', data.savingsActual],
    ['currentMonth', data.currentMonth],
    ['savingsByMonth', data.savingsByMonth],
    ['totalOrigDebt', data.totalOrigDebt],
  ]
  for (const [key, value] of map) {
    store.set(key, value)
  }
}
