import { createEffect, createEvent, sample } from 'effector'

import { counterMaybeUpdated } from '@/entities/counter'
import { createCounterEvent } from '@/entities/counterEvent'

import type { CounterDeltaEvent } from './types'

export const createCounterEventFx = createEffect(createCounterEvent)

export const counterDeltaButtonClicked = createEvent<CounterDeltaEvent>()

sample({
  clock: counterDeltaButtonClicked,
  target: createCounterEventFx,
})

sample({
  clock: createCounterEventFx.doneData,
  fn: ({ counter_id }) => ({ id: counter_id }),
  target: counterMaybeUpdated,
})
