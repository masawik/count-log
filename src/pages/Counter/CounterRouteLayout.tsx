import { useGate, useUnit } from 'effector-react'
import { Outlet, useParams } from 'react-router'

import { FullPageLoader } from '@/shared/ui'

import { $counter, counterPageGate, type CounterPageUrlParams } from './model'


const CounterRouteLayout = () => {
  const params = useParams<CounterPageUrlParams>()
    useGate(counterPageGate, params)
    const counter = useUnit($counter)

    if (!counter) return <FullPageLoader />

    return <Outlet context={{ counter }} />
}

export default CounterRouteLayout
