import { createEffect, sample } from 'effector'

import { counterMaybeUpdated } from '@/entities/counter'

import { correctCounterValue, resetCounterValue } from './api'

export const resetCounterValueFx = createEffect(resetCounterValue)
export const correctCounterValueFx = createEffect(correctCounterValue)

sample({
  clock: [ resetCounterValueFx, correctCounterValueFx ],
  target: counterMaybeUpdated,
})
