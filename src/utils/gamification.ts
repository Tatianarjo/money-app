import type { Level } from '@/types'

export const LEVELS: Level[] = [
  { name: 'Open Mic',       icon: '🎤', min: 0,  desc: 'Just starting the set'   },
  { name: 'House Party',    icon: '🏠', min: 18, desc: 'Playing the living room'  },
  { name: 'Club Night',     icon: '🎧', min: 36, desc: 'Warming up the crowd'     },
  { name: 'Festival Stage', icon: '🎪', min: 54, desc: 'Main stage vibes'         },
  { name: 'Arena Tour',     icon: '🏟️', min: 72, desc: 'Sold out every night'    },
  { name: 'World Tour',     icon: '🌍', min: 90, desc: 'Global headliner'         },
]

export interface ScoreParams {
  remaining: number
  savingsPct: number
  debtPct: number
  totalSubs: number
}

export function calcScore({ remaining, savingsPct, debtPct, totalSubs }: ScoreParams): number {
  let score = 0
  if (remaining > 0)      score += 30
  else if (remaining > -200) score += 10
  score += savingsPct * 0.25
  score += debtPct    * 0.25
  if (totalSubs <= 150)   score += 20
  else if (totalSubs <= 250) score += 10
  return Math.round(Math.min(100, Math.max(0, score)))
}

export function getLevel(score: number): Level {
  let current = LEVELS[0]
  for (const level of LEVELS) {
    if (score >= level.min) current = level
  }
  return current
}

export function getNextLevel(score: number): Level | null {
  return LEVELS.find((l) => l.min > score) ?? null
}
