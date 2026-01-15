import {
  attach,
  combine,
  sample,
} from 'effector'
import { createAction } from 'effector-action'
import { createGate } from 'effector-react'

import {
  $countersById,
  fetchCounterFx,
} from '@/entities/counter'

import { goTo404 } from '@/shared/routing'

import type { CounterPageUrlParams } from './types'

export const counterPageGate = createGate<CounterPageUrlParams>('CounterPage')

export const $counter = combine(
  counterPageGate.state,
  $countersById,
  (gateState, countersById) => (gateState.counterId && (gateState.counterId in countersById)) ? countersById[gateState.counterId] : null,
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
