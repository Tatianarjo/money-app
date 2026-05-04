/** Short UI sounds (Web Audio). Respects `prefers-reduced-motion: reduce` — no audio in that case. */

export function sfxAllowed(soundOn: boolean): boolean {
  if (typeof window === 'undefined' || !soundOn) return false
  try {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
  } catch {
    /* ignore */
  }
  return true
}

function createCtx(): AudioContext | null {
  const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!Ctx) return null
  return new Ctx()
}

export async function playLevelUp(soundOn: boolean): Promise<void> {
  if (!sfxAllowed(soundOn)) return
  const ctx = createCtx()
  if (!ctx) return
  await ctx.resume().catch(() => {})

  const t0 = ctx.currentTime
  const tone = (freq: number, start: number, dur: number, vol: number) => {
    const o = ctx.createOscillator()
    const g = ctx.createGain()
    o.type = 'sine'
    o.frequency.value = freq
    o.connect(g)
    g.connect(ctx.destination)
    g.gain.setValueAtTime(0, start)
    g.gain.linearRampToValueAtTime(vol, start + 0.02)
    g.gain.exponentialRampToValueAtTime(0.0001, start + dur)
    o.start(start)
    o.stop(start + dur + 0.03)
  }

  tone(523.25, t0, 0.14, 0.11)
  tone(659.25, t0 + 0.09, 0.2, 0.1)
  window.setTimeout(() => void ctx.close(), 500)
}

/** Soft “needle drop” — filtered noise burst. */
export async function playNeedleDrop(soundOn: boolean): Promise<void> {
  if (!sfxAllowed(soundOn)) return
  const ctx = createCtx()
  if (!ctx) return
  await ctx.resume().catch(() => {})

  const len = Math.floor(ctx.sampleRate * 0.14)
  const buf = ctx.createBuffer(1, len, ctx.sampleRate)
  const ch = buf.getChannelData(0)
  for (let i = 0; i < len; i++) ch[i] = Math.random() * 2 - 1

  const src = ctx.createBufferSource()
  src.buffer = buf
  const lp = ctx.createBiquadFilter()
  lp.type = 'lowpass'
  lp.frequency.value = 720
  const g = ctx.createGain()
  g.gain.value = 0.07
  src.connect(lp)
  lp.connect(g)
  g.connect(ctx.destination)
  src.start()
  src.stop(ctx.currentTime + 0.16)
  window.setTimeout(() => void ctx.close(), 400)
}
