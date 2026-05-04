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
        Bills are <strong>recurring templates</strong> (rent, phone, subscriptions). Each one needs a <strong>due day
        (1–31)</strong> — the day of the month the charge usually hits — so you can see what&apos;s coming. Amounts feed
        your dashboard totals. The <strong>Dashboard</strong> has a <strong>Due soon</strong> card that lists those bills
        in order; when the month in the header matches today&apos;s calendar month, it also shows <strong>due today</strong>,{' '}
        <strong>overdue</strong>, or <strong>due in X days</strong>. Tap <strong>Mark paid</strong> when you have actually
        paid a bill this month so it shows up in the six-month history. For subscriptions you can{' '}
        <strong>Cancel / Keep</strong> instead of deleting the row. When a bill&apos;s due day is{' '}
        <strong>tomorrow</strong> on the real calendar, Money HQ may show a one-time <strong>pop-up reminder</strong> that
        day after the welcome flow (dismiss with <strong>Got it</strong> so it doesn&apos;t repeat until the next
        &quot;tomorrow&quot; with a match).
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

      <div style={sectionTitle}>First visit: privacy, then the game</div>
      <p style={body}>
        The first pop-up is <strong>privacy</strong> (local data, feedback form, Google Analytics). Right after you confirm
        it, a second screen introduces the <strong>HQ Showcase</strong>: you earn <strong>+1 point</strong> for tapping{' '}
        <strong>Let&apos;s go</strong> (your login reward), and <strong>+1 point</strong> when you save your{' '}
        <strong>first income drop</strong> on the Income tab. Then you can add an optional <strong>display name</strong>{' '}
        (or skip) — it appears in the <strong>header</strong> and <strong>footer</strong> so this copy of the app feels
        personal, still only stored in this browser. Change it anytime under <strong>Data</strong>. Watch the header badge{' '}
        <strong>🎮 X/2</strong> and the pink progress card on the Dashboard — it&apos;s just for fun on this device.
      </p>

      <div style={sectionTitle}>Tour poster &amp; DJ sounds</div>
      <p style={body}>
        After your first income row, the Dashboard shows a big <strong>OPEN TOUR POSTER</strong> button. The poster includes{' '}
        <strong>health score</strong>, <strong>DJ career level</strong>, <strong>showcase points</strong>, the month, and{' '}
        <strong style={{ color: '#EC4899' }}>Powered by eyeCODEGlitter</strong> at the bottom. Dollar amounts stay{' '}
        <strong>off the image</strong> unless you turn on <strong>Show money on the poster</strong> (clear opt-in with a
        pink border). Download PNG or use Share where your phone supports it.
      </p>
      <p style={{ ...body, marginBottom: 0 }}>
        In <strong>Data</strong>, turn on <strong>Sound effects</strong> for a soft <strong>needle drop</strong> once per
        browser session the first time you open the <strong>Dashboard</strong> (while sounds are on), and a short{' '}
        <strong>chime</strong> when your <strong>DJ career level</strong> goes up. Sounds stay off by default and never play
        if your device prefers <strong>reduced motion</strong>.
      </p>

      <div style={sectionTitle}>Privacy and feedback</div>
      <p style={{ ...body, marginBottom: '0.75rem' }}>
        <strong style={{ display: 'block', fontWeight: 800, marginBottom: '0.5rem' }}>
          Your budget numbers stay on your phone. The feedback form only saves what you type there — not your balances or
          entries from this app.
        </strong>
        Income, bills, debt, and soft life live only in this browser unless you export or import JSON yourself.{' '}
        <strong>Google Analytics</strong> runs on the site for approximate traffic and region; it does not receive your
        budget numbers from this app.
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
