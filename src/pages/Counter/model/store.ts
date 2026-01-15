import { attach, combine, createEvent, sample } from 'effector'
import { createAction } from 'effector-action'
import { createGate } from 'effector-react'

import { counterDeltaButtonClicked } from '@/features/AddCounterEvent'

import { $countersById, fetchCounterFx } from '@/entities/counter'

import { goTo404 } from '@/shared/routing'

import type { CounterPageUrlParams } from './types'

export const counterPageGate = createGate<CounterPageUrlParams>('CounterPage')

export const $counter = combine(
  counterPageGate.state,
  $countersById,
  (gateState, countersById) =>
    gateState.counterId && gateState.counterId in countersById
      ? countersById[gateState.counterId]
      : null,
)

const tryFetchCounterFx = attach({ effect: fetchCounterFx })

createAction(counterPageGate.state, {
  source: {
    counter: $counter,
    gateStatus: counterPageGate.status,
  },
  target: {
    tryFetchCounterFx,
    goTo404,
  },
  fn: (target, source, state) => {
    if (source.gateStatus === false) return
    if (source.counter !== null) return

    if (!state.counterId) {
      target.goTo404()
      return
    }

    /**
     * @see fetchCounterFx implementation.
     * This will add an record to the $counters list and the $counter will recalculate itself.
     */
    target.tryFetchCounterFx({ id: state.counterId })
  },
})

sample({
  clock: tryFetchCounterFx.fail,
  target: goTo404,
})

export const deleteCounterClicked = createEvent()
export const resetCounterClicked = createEvent()
export const counterValueCorrected = createEvent()
export const deltaButtonClicked = createEvent<number>()

sample({
  clock: deltaButtonClicked,
  source: $counter,
  filter: (counter) => !!counter,
  fn: (counter, delta) => ({ delta, counter_id: counter!.id }),
  target: counterDeltaButtonClicked,
})
