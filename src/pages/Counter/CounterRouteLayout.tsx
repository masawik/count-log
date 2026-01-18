import { useGate, useUnit } from 'effector-react'
import { Outlet, useParams } from 'react-router'

import type { Counter } from '@/entities/counter'

import { FullPageLoader } from '@/shared/ui'

import {
  $counter,
  counterPageGate,
  type CounterPageUrlParams,
} from './CounterPage/model'

export type CounterOutletContext = { counter: Counter }

const CounterRouteLayout = () => {
  const params = useParams<CounterPageUrlParams>()
  useGate(counterPageGate, params)
  const counter = useUnit($counter)

  if (!counter) return <FullPageLoader />

  return <Outlet context={{ counter }} />
}

export default CounterRouteLayout
