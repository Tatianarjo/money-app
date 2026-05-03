import { useState } from 'react'
import { uid, INCOME_TYPES } from '@/constants'
import { fmt } from '@/utils/format'
import { Card, SectionHead, AddBtn, EditBtn, DelBtn, Modal, Field, SaveCancel } from '@/components/ui'
import type { IncomeEntry, IncomeForm, IncomeType } from '@/types'

interface Props {
  income: IncomeEntry[]
  setIncome: React.Dispatch<React.SetStateAction<IncomeEntry[]>>
}

const TYPE_COLORS: Record<IncomeType, string> = {
  Salary:          '#10B981',
  'DJ Gig':        '#F59E0B',
  'Contract Work': '#8B5CF6',
  Other:           '#94A3B8',
}

const BLANK: IncomeForm = {
  source: '',
  amount: '',
  date: new Date().toISOString().slice(0, 10),
  type: 'Salary',
}

export function IncomeTab({ income, setIncome }: Props) {
  const [modal,   setModal]   = useState(false)
  const [editing, setEditing] = useState<string | null>(null)
  const [form,    setForm]    = useState<IncomeForm>(BLANK)

  const patch = <K extends keyof IncomeForm>(k: K) =>
    (v: string) => setForm((prev) => ({ ...prev, [k]: v }))

  const openNew = () => {
    setEditing(null)
    setForm(BLANK)
    setModal(true)
  }

  const openEdit = (item: IncomeEntry) => {
    setEditing(item.id)
    setForm({ source: item.source, amount: String(item.amount), date: item.date, type: item.type })
    setModal(true)
  }

  const save = () => {
    if (!form.source.trim() || !form.amount) return
    const entry: Omit<IncomeEntry, 'id'> = {
      source: form.source,
      amount: Number(form.amount),
      date:   form.date,
      type:   form.type,
    }
    if (editing) {
      setIncome((prev) => prev.map((i) => (i.id === editing ? { ...i, ...entry } : i)))
    } else {
      setIncome((prev) => [...prev, { id: uid(), ...entry }])
    }
    setModal(false)
  }

  const del = (id: string) => setIncome((prev) => prev.filter((i) => i.id !== id))

  const total = income.reduce((s, i) => s + i.amount, 0)

  return (
    <div className="fade-up">
      <SectionHead
        title="💸 Income Drops"
        sub={<>Total: <strong style={{ color: '#10B981' }}>{fmt(total)}</strong></>}
        action={<AddBtn label="+ Drop" onClick={openNew} />}
      />

      <div style={{ display: 'grid', gap: '0.625rem' }}>
        {income.length === 0 && (
          <Card>
            <div style={{ textAlign: 'center', color: 'var(--muted)', padding: '2rem', fontSize: '0.9rem' }}>
              No income entries yet. Add your first drop.
            </div>
          </Card>
        )}

        {income.map((item) => (
          <Card key={item.id} className="money-list-card" style={{ display: 'flex', gap: '1rem', padding: '0.875rem 1.125rem' }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: TYPE_COLORS[item.type], flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, color: 'var(--text)', fontSize: '0.9rem' }}>{item.source}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>{item.type} · {item.date}</div>
            </div>
            <div style={{ fontFamily: 'var(--serif)', fontSize: '1.2rem', color: '#10B981', flexShrink: 0 }}>
              {fmt(item.amount)}
            </div>
            <div className="money-list-actions">
              <EditBtn onClick={() => openEdit(item)} />
              <DelBtn  onClick={() => del(item.id)}   />
            </div>
          </Card>
        ))}
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'Edit Income Drop' : 'New Income Drop'}>
        <Field label="Source"     value={form.source} onChange={patch('source')} placeholder="e.g. Freelance gig" />
        <Field label="Amount ($)" type="number" value={form.amount} onChange={patch('amount')} />
        <Field label="Date"       type="date"   value={form.date}   onChange={patch('date')}   />
        <Field label="Type"       value={form.type}   onChange={patch('type')}   options={INCOME_TYPES} />
        <SaveCancel onSave={save} onCancel={() => setModal(false)} saveLabel="Save Drop" />
      </Modal>
    </div>
  )
}
