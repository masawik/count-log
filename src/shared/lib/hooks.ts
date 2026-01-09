import { useState } from 'react'

export function useAsyncErrorToBoundary() {
  const [ error, setError ] = useState<unknown>(null)
  if (error) throw error
  return setError
}
