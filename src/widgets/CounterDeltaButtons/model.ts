import { createEvent, createStore, sample } from 'effector'
import { createGate } from 'effector-react'

import { updateCounterStepsFx } from '@/features/DeltaButtonsConfigurator'

import type { Counter } from '@/entities/counter'

export const CounterDeltaButtonsGate = createGate<Counter>()

export const configuratorDialogOpened = createEvent()
export const configuratorDialogClosed = createEvent()

export const $isConfiguratorDialogOpened = createStore(false)
  .on(configuratorDialogOpened, () => true)
  .on(configuratorDialogClosed, () => false)

sample({
  clock: updateCounterStepsFx.done,
  source: CounterDeltaButtonsGate.state,
  filter: ({ id }, { params }) => id === params.id,
  target: configuratorDialogClosed,
})
