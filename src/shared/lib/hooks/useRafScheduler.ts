import { useCallback, useEffect, useRef } from 'react'

export function useRafScheduler() {
  const rafId = useRef<number | null>(null)

  const cancel = useCallback(() => {
    if (rafId.current != null) cancelAnimationFrame(rafId.current)
    rafId.current = null
  }, [])

  const schedule = useCallback((fn: () => void) => {
    cancel()
    rafId.current = requestAnimationFrame(() => {
      rafId.current = null
      fn()
    })
  }, [ cancel ])

  useEffect(() => cancel, [ cancel ])

  return { schedule, cancel }
}
