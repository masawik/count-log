import { createEvent, sample } from 'effector'

import { counterMaybeUpdated } from '@/entities/counter'
import { createCounterEventFx } from '@/entities/counterEvent'

import { correctCounterValueFx, resetCounterValueFx } from './effects'

import type { CounterValueChangedByDeltaAttrs } from './types'

export const counterValueChangedByDelta = createEvent<CounterValueChangedByDeltaAttrs>()

sample({
  clock: counterValueChangedByDelta,
  target: createCounterEventFx,
})

sample({
  clock: createCounterEventFx.doneData,
  fn: ({ counter_id }) => ({ id: counter_id }),
  target: counterMaybeUpdated,
})

sample({
  clock: [ resetCounterValueFx.done, correctCounterValueFx.done ],
  fn: ({ params: { id } }) => ({ id }),
  target: counterMaybeUpdated,
})
