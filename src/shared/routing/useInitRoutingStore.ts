import { useGate } from 'effector-react'
import { useMemo } from 'react'
import { useNavigate } from 'react-router'

import { AppRouterGate } from './model'

import type { AppRouterStore } from './types'

export const useInitRoutingStore = () => {
  const navigate = useNavigate()

  const appRouter = useMemo<AppRouterStore>(() => ({
    navigate,
  }), [ navigate ])

  useGate(AppRouterGate, appRouter)
}
