import { useCallback, useMemo, useState } from 'react'

export const useTrigger = () => {
  const [ triggerValue, setTriggerValue ] = useState(0)

  const trigger = useCallback(() => setTriggerValue(v => v+1), [])
  const dependency = useMemo(() => Symbol(triggerValue), [ triggerValue ])

  return {
    dependency,
    trigger,
  }
}
