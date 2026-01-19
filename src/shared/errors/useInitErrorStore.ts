import { useUnit } from 'effector-react'
import { useEffect } from 'react'

import { $appError } from './model'
import { useAsyncErrorToBoundary } from './useAsyncErrorToBoundary'

export const useInitErrorStore = () => {
  const error = useUnit($appError)
  const setError = useAsyncErrorToBoundary()

  useEffect(() => {
    if (error !== null) {
      setError(error)
    }
  }, [ error, setError ])
}
