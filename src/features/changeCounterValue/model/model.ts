import { createEvent, sample } from 'effector'

import { createCounterEventFx } from '@/entities/counterEvent'

import type { CounterValueChangedByDeltaAttrs } from './types'


export const changeCounterValueByDelta = createEvent<CounterValueChangedByDeltaAttrs>()

sample({
  clock: changeCounterValueByDelta,
  target: createCounterEventFx,
})
