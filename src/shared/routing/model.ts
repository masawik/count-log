import { attach, createEvent, sample } from 'effector'
import { createGate } from 'effector-react'

import type { AppRouterStore, NavigateAttrs } from './types'
import type { NavigateOptions } from 'react-router'

export const AppRouterGate = createGate<AppRouterStore>('AppRouterStore')
export const $appRouter = AppRouterGate.state.map((state) => state)


const navigateFx = attach({
  source: $appRouter,
  effect(router, { to, options }: NavigateAttrs) {
    if (!router.navigate) {
      throw new Error('appRouter store isnt ready!')
    }

    void router.navigate(to, options)
  },
})

export const navigateTo = createEvent<NavigateAttrs>()

sample({
  clock: navigateTo,
  target: navigateFx,
})

export const goTo404 = createEvent()
sample({
  clock: goTo404,
  fn: () => ({ to: '/404', options: { replace: true } }),
  target: navigateTo,
})

export const goToHomePage = createEvent<NavigateOptions | undefined>()
sample({
  clock: goToHomePage,
  fn: (opts) => ({ to: '/', options: opts }),
  target: navigateTo,
})
