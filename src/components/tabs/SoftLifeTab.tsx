import { useState } from 'react'
import { uid, SOFT_CATS } from '@/constants'
import { fmt } from '@/utils/format'
import { Card, SectionHead, AddBtn, EditBtn, DelBtn, Modal, Field, Bar, SaveCancel } from '@/components/ui'
import type { SoftEntry, SoftForm, SoftCat } from '@/types'

interface Props {
  softLife: SoftEntry[]
  setSoftLife: React.Dispatch<React.SetStateAction<SoftEntry[]>>
}

const CAT_COLORS: Record<SoftCat, string> = {
  'Eating Out':  '#F59E0B',
  Events:        '#8B5CF6',
  Shopping:      '#EC4899',
  Travel:        '#06B6D4',
  Beauty:        '#F472B6',
  'DJ / Music':  '#10B981',
  Miscellaneous: '#94A3B8',
}

const CAT_EMOJI: Record<SoftCat, string> = {
  'Eating Out':  '🍽',
  Events:        '🎭',
  Shopping:      '🛍',
  Travel:        '✈️',
  Beauty:        '💅',
  'DJ / Music':  '🎧',
  Miscellaneous: '🌀',
}

const BLANK: SoftForm = {
  category: 'Eating Out',
  amount:   '',
  date:     new Date().toISOString().slice(0, 10),
  note:     '',
}

export function SoftLifeTab({ softLife, setSoftLife }: Props) {
  const [modal,   setModal]   = useState(false)
  const [editing, setEditing] = useState<string | null>(null)
  const [form,    setForm]    = useState<SoftForm>(BLANK)

  const patch = <K extends keyof SoftForm>(k: K) =>
    (v: string) => setForm((prev) => ({ ...prev, [k]: v }))

  const total = softLife.reduce((s, e) => s + e.amount, 0)

  const catTotals = SOFT_CATS.map((cat) => ({
    cat,
    total: softLife.filter((e) => e.category === cat).reduce((s, e) => s + e.amount, 0),
  })).filter((c) => c.total > 0)

  const openNew = () => { setEditing(null); setForm(BLANK); setModal(true) }
  const openEdit = (item: SoftEntry) => {
    setEditing(item.id)
    setForm({ category: item.category, amount: String(item.amount), date: item.date, note: item.note })
    setModal(true)
  }

  const save = () => {
    if (!form.amount) return
    const entry: Omit<SoftEntry, 'id'> = {
      category: form.category,
      amount:   Number(form.amount),
      date:     form.date,
      note:     form.note,
    }
    if (editing) {
      setSoftLife((prev) => prev.map((e) => (e.id === editing ? { ...e, ...entry } : e)))
    } else {
      setSoftLife((prev) => [...prev, { id: uid(), ...entry }])
    }
    setModal(false)
  }

  const del = (id: string) => setSoftLife((prev) => prev.filter((e) => e.id !== id))

  return (
    <div className="fade-up">
      <SectionHead
        title="✨ Soft Life Fund"
        sub={<>Total Spent: <strong style={{ color: '#F472B6' }}>{fmt(total)}</strong></>}
        action={<AddBtn label="+ Spend" onClick={openNew} />}
      />

      {/* Category breakdown */}
      {catTotals.length > 0 && (
        <Card style={{ marginBottom: '1.25rem' }}>
          <div style={{ fontSize: '0.68rem', letterSpacing: '0.15em', color: 'var(--muted)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '1rem' }}>Category Breakdown</div>
          <div style={{ display: 'grid', gap: '0.625rem' }}>
            {[...catTotals].sort((a, b) => b.total - a.total).map(({ cat, total: t }) => (
              <div key={cat}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text)' }}>{CAT_EMOJI[cat]} {cat}</span>
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: CAT_COLORS[cat] }}>{fmt(t)}</span>
                </div>
                <Bar value={t} max={total} color={CAT_COLORS[cat]} h={4} />
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Entry list */}
      <div style={{ display: 'grid', gap: '0.625rem' }}>
        {softLife.length === 0 && (
          <Card>
            <div style={{ textAlign: 'center', color: 'var(--muted)', padding: '2rem', fontSize: '0.9rem' }}>
              No soft life spending yet. Live a little.
            </div>
          </Card>
        )}

        {[...softLife].sort((a, b) => b.date.localeCompare(a.date)).map((item) => (
          <Card key={item.id} className="money-list-card" style={{ display: 'flex', gap: '0.875rem', padding: '0.875rem 1.125rem' }}>
            <div style={{ fontSize: 22, flexShrink: 0 }}>{CAT_EMOJI[item.category]}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, color: 'var(--text)', fontSize: '0.9rem' }}>{item.category}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--muted)', wordBreak: 'break-word' }}>
                {item.date}{item.note ? ` · ${item.note}` : ''}
              </div>
            </div>
            <div style={{ fontFamily: 'var(--serif)', fontSize: '1.15rem', color: CAT_COLORS[item.category], flexShrink: 0 }}>
              {fmt(item.amount)}
            </div>
            <div className="money-list-actions">
              <EditBtn onClick={() => openEdit(item)} />
              <DelBtn  onClick={() => del(item.id)}   />
            </div>
          </Card>
        ))}
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'Edit Soft Life' : 'New Soft Life Spend'}>
        <Field label="Category"            value={form.category} onChange={patch('category')} options={SOFT_CATS} />
        <Field label="Amount ($)" type="number" value={form.amount}   onChange={patch('amount')} />
        <Field label="Date"       type="date"   value={form.date}     onChange={patch('date')} />
        <Field label="Note (optional)"     value={form.note}     onChange={patch('note')}     placeholder="e.g. Birthday dinner" />
        <SaveCancel onSave={save} onCancel={() => setModal(false)} />
      </Modal>
    </div>
  )
}
