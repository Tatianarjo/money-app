import { useState, useEffect } from 'react'
import { store } from '@/utils/store'

/**
 * Works exactly like useState but persists to localStorage under `key`.
 * Falls back to `initialValue` when nothing is stored yet.
 */
export function usePersistedState<T>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [state, setState] = useState<T>(() => store.get<T>(key, initialValue))

  useEffect(() => {
    store.set(key, state)
  }, [key, state])

  return [state, setState]
}
