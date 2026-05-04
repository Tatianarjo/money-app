import { Modal } from '@/components/ui'

interface Props {
  open: boolean
  onContinue: () => void
}

export function PostWelcomeGamifyModal({ open, onContinue }: Props) {
  return (
    <Modal
      open={open}
      onClose={onContinue}
      title="🎮 Your HQ showcase"
      closeOnBackdrop={false}
      showCloseButton={false}
    >
      <p
        style={{
          margin: '0 0 1rem',
          fontFamily: 'var(--sans)',
          fontSize: '0.95rem',
          lineHeight: 1.55,
          color: 'var(--text)',
        }}
      >
        Money HQ isn&apos;t just spreadsheets — it&apos;s a little <strong>DJ / tour game</strong> on top of your real
        numbers. Here&apos;s how you start earning <strong>showcase points</strong> (separate from your health score):
      </p>

      <ul
        style={{
          margin: '0 0 1.25rem',
          paddingLeft: '1.2rem',
          color: 'var(--text)',
          fontSize: '0.9rem',
          lineHeight: 1.65,
          fontFamily: 'var(--sans)',
        }}
      >
        <li style={{ marginBottom: '0.5rem' }}>
          <strong>+1 point</strong> for showing up — tap <strong>Let&apos;s go</strong> below right after this screen
          (your &quot;logged on&quot; reward).
        </li>
        <li style={{ marginBottom: '0.5rem' }}>
          <strong>+1 point</strong> when you add your <strong>first income drop</strong> on the Income tab (any amount).
        </li>
      </ul>

      <p style={{ margin: '0 0 1rem', fontSize: '0.88rem', color: 'var(--muted)', lineHeight: 1.6, fontFamily: 'var(--sans)' }}>
        With at least one income row, the <strong>Dashboard</strong> unlocks a shareable <strong>tour poster</strong> — DJ
        level, health score, and month. By default it <strong>does not</strong> show dollar amounts (you can opt in
        inside the poster). Every poster says{' '}
        <strong style={{ color: '#EC4899' }}>Powered by eyeCODEGlitter</strong> — the crew behind the vibe.
      </p>

      <p style={{ margin: '0 0 1.25rem', fontSize: '0.82rem', color: 'var(--muted)', lineHeight: 1.55 }}>
        Points are saved only on this device — just for fun and to show friends the gamified side.
      </p>

      <button
        type="button"
        onClick={onContinue}
        style={{
          width: '100%',
          padding: '0.85rem 1rem',
          border: 'none',
          borderRadius: '0.75rem',
          background: 'linear-gradient(135deg, var(--accent) 0%, #EC4899 100%)',
          color: 'var(--on-accent)',
          fontWeight: 900,
          cursor: 'pointer',
          fontFamily: 'var(--sans)',
          fontSize: '0.95rem',
          letterSpacing: '0.04em',
          boxShadow: '0 6px 24px rgba(245, 158, 11, 0.35)',
        }}
      >
        Let&apos;s go — claim my +1 login point
      </button>
    </Modal>
  )
}
