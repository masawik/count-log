import { createEvent, sample } from 'effector'

import { createCounterEventFx } from '@/entities/counterEvent'

import { correctCounterValueFx } from './effects'

import type { CorrectCounterValueAttrs, CounterValueChangedByDeltaAttrs } from './types'

export const changeCounterValueByDelta =
  createEvent<CounterValueChangedByDeltaAttrs>()

sample({
  clock: changeCounterValueByDelta,
  target: createCounterEventFx,
})

export const counterValueCorrected = createEvent<CorrectCounterValueAttrs>()

sample({
  clock: counterValueCorrected,
  target: correctCounterValueFx,
})
