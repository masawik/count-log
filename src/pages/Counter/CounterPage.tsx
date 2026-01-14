import { useGate, useUnit } from 'effector-react'
import { useParams } from 'react-router'

import { FullPageLoader } from '@/shared/ui'

import { $counter, counterPageGate, type CounterPageUrlParams } from './model'

export const CounterPage = () => {
  const params = useParams<CounterPageUrlParams>()
  useGate(counterPageGate, params)

  const counter = useUnit($counter)

  if (!counter) return <FullPageLoader />

  return (
    <pre>
      {JSON.stringify(counter, null, 2)}
    </pre>
  )
}


export default CounterPage
