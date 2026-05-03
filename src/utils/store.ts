const PREFIX = 'mhq_'

export const store = {
  get<T>(key: string, fallback: T): T {
    try {
      const raw = localStorage.getItem(PREFIX + key)
      return raw !== null ? (JSON.parse(raw) as T) : fallback
    } catch {
      return fallback
    }
  },

  set(key: string, value: unknown): void {
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(value))
    } catch {
      // silently fail (e.g. private browsing / storage full)
    }
  },

  remove(key: string): void {
    try {
      localStorage.removeItem(PREFIX + key)
    } catch {
      // ignore
    }
  },
}
