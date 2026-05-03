import { useState } from 'react'
import { uid, EXPENSE_CATS, EXPENSE_TYPES, EXPENSE_STATUSES } from '@/constants'
import { fmt } from '@/utils/format'
import { Card, SectionHead, AddBtn, EditBtn, DelBtn, Modal, Field, SaveCancel } from '@/components/ui'
import type { Expense, ExpenseForm, ExpenseType, ExpenseStatus } from '@/types'
import { formatMonthLabel } from '@/utils/month'

interface Props {
  expenses: Expense[]
  setExpenses: React.Dispatch<React.SetStateAction<Expense[]>>
  currentMonth: string
}

interface FilterDef {
  label: string
  fn: (e: Expense) => boolean
}

const FILTERS: FilterDef[] = [
  { label: 'All',           fn: ()  => true },
  { label: 'Fixed',         fn: (e) => e.type === 'Fixed' },
  { label: 'Subscriptions', fn: (e) => e.type === 'Subscription' },
  { label: 'Variable',      fn: (e) => e.type === 'Variable' },
  { label: 'Debt',          fn: (e) => e.category === 'Debt' },
  { label: 'Leisure',       fn: (e) => e.category === 'Leisure' },
]

const TYPE_COLOR: Record<ExpenseType, string> = {
  Fixed: '#F59E0B', Variable: '#8B5CF6', Subscription: '#06B6D4',
}
const STATUS_COLOR: Record<ExpenseStatus, string> = {
  Active: '#10B981', Cancelled: '#94A3B8', Paid: '#3B82F6',
}

const BLANK: ExpenseForm = {
  name: '', amount: '', category: 'Rent', type: 'Fixed', billingDate: '', status: 'Active',
}

export function BillsTab({ expenses, setExpenses, currentMonth }: Props) {
  const [filter,  setFilter]  = useState('All')
  const [modal,   setModal]   = useState(false)
  const [editing, setEditing] = useState<string | null>(null)
  const [form,    setForm]    = useState<ExpenseForm>(BLANK)

  const patch = <K extends keyof ExpenseForm>(k: K) =>
    (v: string) => setForm((prev) => ({ ...prev, [k]: v }))

  const activeFn  = FILTERS.find((f) => f.label === filter)?.fn ?? (() => true)
  const visible   = expenses.filter(activeFn)
  const activeTotal = expenses.filter((e) => e.status !== 'Cancelled').reduce((s, e) => s + e.amount, 0)
  const subsTotal   = expenses.filter((e) => e.type === 'Subscription' && e.status !== 'Cancelled').reduce((s, e) => s + e.amount, 0)

  const openNew = () => { setEditing(null); setForm(BLANK); setModal(true) }
  const openEdit = (item: Expense) => {
    setEditing(item.id)
    setForm({ name: item.name, amount: String(item.amount), category: item.category, type: item.type, billingDate: item.billingDate, status: item.status })
    setModal(true)
  }

  const save = () => {
    if (!form.name.trim() || !form.amount) return
    const base = {
      name: form.name,
      amount: Number(form.amount),
      category: form.category,
      type: form.type,
      billingDate: form.billingDate,
      status: form.status,
    }
    if (editing) {
      setExpenses((prev) => prev.map((e) => (e.id === editing ? { ...e, ...base } : e)))
    } else {
      setExpenses((prev) => [...prev, { id: uid(), ...base, paidByMonth: {} }])
    }
    setModal(false)
  }

  const del = (id: string) => setExpenses((prev) => prev.filter((e) => e.id !== id))

  const toggleStatus = (id: string) =>
    setExpenses((prev) =>
      prev.map((e) =>
        e.id === id
          ? { ...e, status: e.status === 'Active' ? ('Cancelled' as ExpenseStatus) : ('Active' as ExpenseStatus) }
          : e
      )
    )

  const toggleMonthPaid = (id: string) =>
    setExpenses((prev) =>
      prev.map((e) => {
        if (e.id !== id) return e
        const pm = { ...(e.paidByMonth ?? {}) }
        const cur = pm[currentMonth]
        const nextPaid = !cur?.paid
        pm[currentMonth] = nextPaid ? { paid: true, actualAmount: e.amount } : { paid: false }
        return { ...e, paidByMonth: pm }
      }),
    )

  return (
    <div className="fade-up">
      <SectionHead
        title="📋 The Bills Set"
        sub={
          <>
            <span style={{ display: 'block', marginBottom: 4 }}>{formatMonthLabel(currentMonth)} · Mark bills paid for history</span>
            Active: <strong style={{ color: '#F59E0B' }}>{fmt(activeTotal)}</strong>
            {' · '}
            Subs: <strong style={{ color: subsTotal > 150 ? '#EF4444' : '#06B6D4' }}>{fmt(subsTotal)}</strong>
            {subsTotal > 150 ? ' ⚠️' : ''}
          </>
        }
        action={<AddBtn label="+ Bill" onClick={openNew} />}
      />

      {/* Filter strip */}
      <div style={{ display: 'flex', gap: '0.35rem', marginBottom: '1.25rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
        {FILTERS.map((f) => (
          <button
            key={f.label}
            onClick={() => setFilter(f.label)}
            style={{
              background: filter === f.label ? 'var(--accent)' : 'var(--card)',
              color:      filter === f.label ? 'var(--on-accent)' : 'var(--muted)',
              border: `1px solid ${filter === f.label ? 'var(--accent)' : 'var(--border)'}`,
              borderRadius: '2rem', padding: '0.4rem 1rem', fontSize: '0.78rem', fontWeight: 600,
              cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'var(--sans)',
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gap: '0.625rem' }}>
        {visible.length === 0 && (
          <Card>
            <div style={{ textAlign: 'center', color: 'var(--muted)', padding: '2rem', fontSize: '0.9rem' }}>
              No entries in this filter.
            </div>
          </Card>
        )}

        {visible.map((e) => (
          <Card
            key={e.id}
            className="money-list-card"
            style={{ display: 'flex', gap: '0.875rem', padding: '0.875rem 1.125rem', opacity: e.status === 'Cancelled' ? 0.55 : 1 }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 3, flexShrink: 0 }}>
              <span style={{ fontSize: '0.6rem', fontWeight: 700, color: TYPE_COLOR[e.type],     background: TYPE_COLOR[e.type]   + '22', borderRadius: 99, padding: '1px 6px' }}>{e.type}</span>
              <span style={{ fontSize: '0.6rem', fontWeight: 700, color: STATUS_COLOR[e.status], background: STATUS_COLOR[e.status] + '22', borderRadius: 99, padding: '1px 6px' }}>{e.status}</span>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, color: 'var(--text)', fontSize: '0.9rem' }}>{e.name}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>
              {e.category} · Due: {e.billingDate || '—'}
              {e.status !== 'Cancelled' && (
                <span style={{ marginLeft: 8, color: e.paidByMonth?.[currentMonth]?.paid ? '#10B981' : 'var(--muted)', fontWeight: 700 }}>
                  {e.paidByMonth?.[currentMonth]?.paid ? ' · Paid this month' : ' · Unpaid'}
                </span>
              )}
            </div>
            </div>
            <div style={{ fontFamily: 'var(--serif)', fontSize: '1.15rem', color: 'var(--text)', flexShrink: 0 }}>
              {fmt(e.amount)}
            </div>
            <div className="money-list-actions">
              {e.status !== 'Cancelled' && (
                <button
                  type="button"
                  onClick={() => toggleMonthPaid(e.id)}
                  style={{
                    background: e.paidByMonth?.[currentMonth]?.paid ? '#10B98122' : 'var(--card2)',
                    border: `1px solid ${e.paidByMonth?.[currentMonth]?.paid ? '#10B98155' : 'var(--border)'}`,
                    borderRadius: '0.5rem',
                    padding: '0.3rem 0.55rem',
                    color: e.paidByMonth?.[currentMonth]?.paid ? '#10B981' : 'var(--muted)',
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontFamily: 'var(--sans)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {e.paidByMonth?.[currentMonth]?.paid ? 'Paid ✓' : 'Mark paid'}
                </button>
              )}
              {e.type === 'Subscription' && (
                <button
                  onClick={() => toggleStatus(e.id)}
                  style={{ background: e.status === 'Active' ? '#EF444422' : '#10B98122', border: `1px solid ${e.status === 'Active' ? '#EF444444' : '#10B98144'}`, borderRadius: '0.5rem', padding: '0.3rem 0.55rem', color: e.status === 'Active' ? '#EF4444' : '#10B981', fontSize: '0.65rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--sans)' }}
                >
                  {e.status === 'Active' ? 'Cancel' : 'Keep'}
                </button>
              )}
              <EditBtn onClick={() => openEdit(e)} />
              <DelBtn  onClick={() => del(e.id)}   />
            </div>
          </Card>
        ))}
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'Edit Expense' : 'New Expense'}>
        <Field label="Name"                 value={form.name}        onChange={patch('name')}        placeholder="e.g. Netflix" />
        <Field label="Amount ($)" type="number" value={form.amount} onChange={patch('amount')} />
        <Field label="Category"             value={form.category}    onChange={patch('category')}    options={EXPENSE_CATS} />
        <Field label="Type"                 value={form.type}        onChange={patch('type')}        options={EXPENSE_TYPES} />
        <Field label="Billing Day of Month" value={form.billingDate} onChange={patch('billingDate')} placeholder="e.g. 15" />
        <Field label="Status"               value={form.status}      onChange={patch('status')}      options={EXPENSE_STATUSES} />
        <SaveCancel onSave={save} onCancel={() => setModal(false)} />
      </Modal>
    </div>
  )
}
