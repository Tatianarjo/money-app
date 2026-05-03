import type { CSSProperties } from 'react'
import { Card } from '@/components/ui'
import { FEEDBACK_FORM_URL } from '@/constants/feedback'
import { LEVELS } from '@/utils/gamification'

const feedbackReady = FEEDBACK_FORM_URL.startsWith('http')

const sectionTitle: CSSProperties = {
  fontSize: '0.68rem',
  letterSpacing: '0.12em',
  color: 'var(--accent)',
  textTransform: 'uppercase',
  fontWeight: 700,
  marginBottom: '0.5rem',
}

const body: CSSProperties = {
  fontSize: '0.88rem',
  color: 'var(--text)',
  lineHeight: 1.65,
  marginBottom: '1.25rem',
}

export function HelpContent() {
  return (
    <div>
      <div style={sectionTitle}>The score, plainly</div>
      <p style={body}>
        Your <strong>health score</strong> is a number from 0 to 100. It reflects four habits: whether you are
        <strong> above zero</strong> after bills this month, how much you are <strong>saving toward your goal</strong>,
        how much <strong>debt you have cleared</strong> compared to your starting baseline, and whether
        <strong> subscriptions</strong> stay lean. A higher score moves you up the DJ career path on the dashboard.
      </p>

      <div style={sectionTitle}>DJ career levels</div>
      <Card style={{ marginBottom: '1.25rem', padding: '1rem' }}>
        <ul style={{ margin: 0, paddingLeft: '1.1rem', fontSize: '0.82rem', color: 'var(--text)', lineHeight: 1.7 }}>
          {LEVELS.map((l) => (
            <li key={l.name} style={{ marginBottom: '0.35rem' }}>
              <strong>{l.icon} {l.name}</strong> — from {l.min} points. {l.desc}
            </li>
          ))}
        </ul>
      </Card>

      <div style={sectionTitle}>The month switcher</div>
      <p style={body}>
        The arrows change which <strong>calendar month</strong> you are viewing. <strong>Income</strong> and{' '}
        <strong>Soft Life</strong> only show entries whose date falls in that month. Use <strong>Close month →</strong> when
        you are done with a month: it saves each active card&apos;s debt balance and your current savings into history,
        then moves you to the next month. Use <strong>Mark paid</strong> on bills so spending history includes that bill
        for the month you are in.
      </p>

      <div style={sectionTitle}>Entering data</div>

      <p style={{ ...body, marginBottom: '0.5rem' }}>
        <strong>Income Drops</strong>
      </p>
      <p style={body}>
        Add every time you get paid (salary, gig, etc.). The <strong>date</strong> on each row decides which month it
        counts toward—match it to the month you selected in the header.
      </p>

      <p style={{ ...body, marginBottom: '0.5rem' }}>
        <strong>Bills</strong>
      </p>
      <p style={body}>
        Bills are <strong>recurring templates</strong> (rent, phone, subscriptions). Amounts feed your dashboard totals.
        Tap <strong>Mark paid</strong> when you have actually paid a bill this month so it shows up in the six-month
        history. For subscriptions you can <strong>Cancel / Keep</strong> instead of deleting the row.
      </p>

      <p style={{ ...body, marginBottom: '0.5rem' }}>
        <strong>Debt</strong>
      </p>
      <p style={body}>
        One row per card: current <strong>balance</strong>, <strong>minimum payment</strong>, and optional{' '}
        <strong>credit limit</strong>. The list sorts <strong>smallest balance first</strong> (snowball order).
        When a card is paid off, use <strong>Paid Off</strong> rather than delete so it stays in your history.
      </p>

      <p style={{ ...body, marginBottom: '0.5rem' }}>
        <strong>Soft Life</strong>
      </p>
      <p style={body}>
        Optional spending (eating out, events, etc.). Same rule as income: the <strong>date</strong> ties the row to a
        calendar month.
      </p>

      <div style={sectionTitle}>Data and backup</div>
      <p style={body}>
        Open <strong>Data</strong> to <strong>export</strong> a JSON file (move your data to another device) or{' '}
        <strong>import</strong> a file you exported earlier—the app reloads after import. Tap{' '}
        <strong>Print / Save as PDF</strong> in Data to print a full statement. On iPhone, choose{' '}
        <strong>Save to Files</strong> in the Share sheet to keep a PDF copy. The <strong>debt payoff baseline</strong>{' '}
        is the starting total used for the payoff progress bar; adjust it if your real starting debt was different.{' '}
        <strong>Reset everything</strong> wipes all entries and starts fresh—use with care.
      </p>

      <div style={sectionTitle}>Install on iPhone</div>
      <p style={body}>
        Deploy or open the app over <strong>HTTPS</strong>. In Safari, tap <strong>Share</strong>, then{' '}
        <strong>Add to Home Screen</strong> to open Money HQ like a standalone app.
      </p>

      <div style={sectionTitle}>Privacy and feedback</div>
      <p style={{ ...body, marginBottom: '0.75rem' }}>
        <strong style={{ display: 'block', fontWeight: 800, marginBottom: '0.5rem' }}>
          Your budget numbers stay on your phone. The feedback form only saves what you type there — not your balances or
          entries from this app.
        </strong>
        Income, bills, debt, and soft life live only in this browser unless you export or import JSON yourself.
      </p>
      {feedbackReady ? (
        <p style={{ ...body, marginBottom: 0 }}>
          <a
            href={FEEDBACK_FORM_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--accent)', fontWeight: 700 }}
          >
            Send feedback (opens in new tab)
          </a>
        </p>
      ) : null}
    </div>
  )
}
