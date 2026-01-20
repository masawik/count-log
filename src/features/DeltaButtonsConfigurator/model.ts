import { attach, createEvent, sample } from 'effector'
import { createGate } from 'effector-react'
import { uniqBy } from 'lodash-es'

import { updateCounterFx, type Counter } from '@/entities/counter'

export const DeltaButtonsConfiguratorGate = createGate<Counter>()

export const formSubmitted = createEvent<Pick<Counter, 'steps'>>()


export const updateCounterStepsFx = attach({ effect: updateCounterFx })
export const $submitting = updateCounterStepsFx.pending

const formSubmittedMapped = sample({
  clock: formSubmitted,
  fn: ({ steps }) => ({
    steps: uniqBy(steps, (step) => step.value),
  }),
})

sample({
  clock: formSubmittedMapped,
  source: DeltaButtonsConfiguratorGate.state,
  fn: ({ id }, { steps }) => ({ id, steps }),
  target: updateCounterStepsFx,
})
