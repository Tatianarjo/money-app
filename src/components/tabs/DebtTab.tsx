import { useState } from 'react'
import { uid, DEBT_PRIORITIES, DEBT_STATUSES, TOTAL_ORIG_DEBT } from '@/constants'
import { fmt } from '@/utils/format'
import { Card, SectionHead, AddBtn, EditBtn, DelBtn, Modal, Field, Bar, Pill, SaveCancel } from '@/components/ui'
import type { Debt, DebtForm, DebtPriority, DebtStatus } from '@/types'

interface Props {
  debts: Debt[]
  setDebts: React.Dispatch<React.SetStateAction<Debt[]>>
}

const PRIORITY_COLOR: Record<DebtPriority, string> = {
  High: '#EF4444', Medium: '#F59E0B', Low: '#10B981',
}

const BLANK: DebtForm = {
  cardName: '', balance: '', creditLimit: '', minPayment: '', priority: 'High', status: 'Active',
}

export function DebtTab({ debts, setDebts }: Props) {
  const [modal,   setModal]   = useState(false)
  const [editing, setEditing] = useState<string | null>(null)
  const [form,    setForm]    = useState<DebtForm>(BLANK)

  const patch = <K extends keyof DebtForm>(k: K) =>
    (v: string) => setForm((prev) => ({ ...prev, [k]: v }))

  const active     = debts.filter((d) => d.status === 'Active')
  const paidOff    = debts.filter((d) => d.status === 'Paid Off')
  const totalDebt  = active.reduce((s, d) => s + d.balance, 0)
  const totalMin   = active.reduce((s, d) => s + d.minPayment, 0)
  const totalLimit = active.reduce((s, d) => s + d.creditLimit, 0)
  const utilization = totalLimit > 0 ? ((totalDebt / totalLimit) * 100).toFixed(1) : null
  const debtPaid   = Math.max(0, TOTAL_ORIG_DEBT - totalDebt)
  const debtPct    = Math.min(100, (debtPaid / TOTAL_ORIG_DEBT) * 100)
  const snowball   = [...active].sort((a, b) => a.balance - b.balance)

  const utilizColor = utilization
    ? Number(utilization) > 70 ? '#EF4444'
    : Number(utilization) > 30 ? '#F59E0B'
    : '#10B981'
    : '#94A3B8'

  const openNew = () => { setEditing(null); setForm(BLANK); setModal(true) }
  const openEdit = (item: Debt) => {
    setEditing(item.id)
    setForm({ cardName: item.cardName, balance: String(item.balance), creditLimit: String(item.creditLimit), minPayment: String(item.minPayment), priority: item.priority, status: item.status })
    setModal(true)
  }

  const save = () => {
    if (!form.cardName.trim() || !form.balance) return
    const entry: Omit<Debt, 'id'> = {
      cardName: form.cardName,
      balance: Number(form.balance),
      creditLimit: Number(form.creditLimit || 0),
      minPayment: Number(form.minPayment || 0),
      priority: form.priority,
      status: form.status,
    }
    if (editing) {
      setDebts((prev) => prev.map((d) => (d.id === editing ? { ...d, ...entry } : d)))
    } else {
      setDebts((prev) => [...prev, { id: uid(), ...entry }])
    }
    setModal(false)
  }

  const del        = (id: string) => setDebts((prev) => prev.filter((d) => d.id !== id))
  const markPaidOff = (id: string) =>
    setDebts((prev) => prev.map((d) =>
      d.id === id ? { ...d, status: 'Paid Off' as DebtStatus, balance: 0 } : d
    ))

  const statCards = [
    { label: 'Total Debt',  val: fmt(totalDebt), color: '#FB7185' },
    { label: 'Min / Month', val: fmt(totalMin),  color: '#F59E0B' },
    ...(utilization ? [{ label: 'Utilization', val: `${utilization}%`, color: utilizColor }] : []),
    { label: 'Cleared',     val: `${debtPct.toFixed(0)}%`, color: '#10B981' },
  ]

  return (
    <div className="fade-up">
      <SectionHead
        title="💳 Debt Kill List"
        sub="Snowball method — smallest balance first"
        action={<AddBtn label="+ Card" onClick={openNew} />}
      />

      {/* Stat chips */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '0.75rem', marginBottom: '1.25rem' }}>
        {statCards.map(({ label, val, color }) => (
          <Card key={label} style={{ padding: '1rem' }}>
            <div style={{ fontSize: '0.65rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700, marginBottom: 4 }}>{label}</div>
            <div style={{ fontFamily: 'var(--serif)', fontSize: '1.4rem', color }}>{val}</div>
          </Card>
        ))}
      </div>

      {/* Progress bar */}
      <Card style={{ marginBottom: '1.25rem' }}>
        <div style={{ fontSize: '0.68rem', letterSpacing: '0.15em', color: 'var(--muted)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.5rem' }}>🎯 Payoff Progress</div>
        <Bar value={debtPaid} max={TOTAL_ORIG_DEBT} color="#FB7185" h={8} />
        <div style={{ fontSize: '0.72rem', color: 'var(--muted)', marginTop: '0.4rem' }}>
          {fmt(debtPaid)} paid down · {fmt(totalDebt)} remaining
        </div>
      </Card>

      {/* Snowball order */}
      <div style={{ fontSize: '0.68rem', letterSpacing: '0.15em', color: 'var(--accent)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.75rem' }}>❄️ Snowball Attack Order</div>
      <div style={{ display: 'grid', gap: '0.625rem' }}>
        {snowball.map((d, i) => (
          <Card
            key={d.id}
            className="debt-snow-card money-list-card"
            style={{ display: 'flex', gap: '0.875rem', padding: '0.875rem 1.125rem', borderLeft: `3px solid ${i === 0 ? '#EF4444' : i === 1 ? '#F59E0B' : 'var(--border)'}` }}
          >
            <div className="debt-snow-badge" style={{ width: 26, height: 26, borderRadius: '50%', background: i === 0 ? '#EF444422' : 'var(--card2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800, color: i === 0 ? '#EF4444' : 'var(--muted)', flexShrink: 0 }}>
              {i + 1}
            </div>
            <div className="debt-snow-body">
              <div style={{ fontWeight: 600, color: 'var(--text)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                {d.cardName}
                {i === 0 && <Pill color="#EF4444">Attack First</Pill>}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--muted)', marginTop: 2 }}>
                Min: {fmt(d.minPayment)} · {d.creditLimit ? `Limit: ${fmt(d.creditLimit)} · Util: ${((d.balance / d.creditLimit) * 100).toFixed(0)}%` : 'No limit set'}
              </div>
            </div>
            <div className="debt-snow-side">
              <div style={{ fontFamily: 'var(--serif)', fontSize: '1.15rem', color: '#FB7185' }}>{fmt(d.balance)}</div>
              <Pill color={PRIORITY_COLOR[d.priority]}>{d.priority}</Pill>
            </div>
            <div className="debt-snow-actions money-list-actions">
              <button type="button" onClick={() => markPaidOff(d.id)} style={{ background: '#10B98122', border: '1px solid #10B98144', borderRadius: '0.5rem', padding: '0.35rem 0.65rem', color: '#10B981', fontSize: '0.65rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--sans)', whiteSpace: 'nowrap' }}>✓ Paid Off</button>
              <EditBtn onClick={() => openEdit(d)} />
              <DelBtn  onClick={() => del(d.id)}   />
            </div>
          </Card>
        ))}
      </div>

      {/* Cleared debts */}
      {paidOff.length > 0 && (
        <div style={{ marginTop: '1.25rem' }}>
          <div style={{ fontSize: '0.68rem', letterSpacing: '0.15em', color: '#10B981', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.75rem' }}>✅ Cleared Static</div>
          {paidOff.map((d) => (
            <Card key={d.id} className="money-list-card" style={{ display: 'flex', gap: '0.875rem', padding: '0.75rem 1.125rem', opacity: 0.6, marginBottom: '0.5rem' }}>
              <div style={{ flex: 1, minWidth: 0, fontWeight: 600, color: 'var(--text)', fontSize: '0.9rem' }}>{d.cardName}</div>
              <Pill color="#10B981">Paid Off</Pill>
              <div className="money-list-actions">
                <DelBtn onClick={() => del(d.id)} />
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'Edit Debt' : 'New Debt Card'}>
        <Field label="Card Name"        value={form.cardName}    onChange={patch('cardName')}    placeholder="e.g. Chase Sapphire" />
        <Field label="Balance ($)"      type="number" value={form.balance}     onChange={patch('balance')} />
        <Field label="Credit Limit ($)" type="number" value={form.creditLimit} onChange={patch('creditLimit')} placeholder="Optional" />
        <Field label="Min Payment ($)"  type="number" value={form.minPayment}  onChange={patch('minPayment')} />
        <Field label="Priority"         value={form.priority}    onChange={patch('priority')}    options={DEBT_PRIORITIES} />
        <Field label="Status"           value={form.status}      onChange={patch('status')}      options={DEBT_STATUSES} />
        <SaveCancel onSave={save} onCancel={() => setModal(false)} />
      </Modal>
    </div>
  )
}
