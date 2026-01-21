import { attach, combine, createEvent, sample } from 'effector'
import { createAction } from 'effector-action'
import { createGate } from 'effector-react'

import { $countersById } from '@/widgets/CountersList'

import {
  changeCounterValueByDelta,
  resetCounterValueFx,
} from '@/features/changeCounterValue'

import {
  deleteCounterFx,
  getCounterFx,
  type Counter,
} from '@/entities/counter'

import { goTo404 } from '@/shared/routing'
import { goToHomePage } from '@/shared/routing'

import type { CounterPageUrlParams } from './types'
import type { NavigateOptions } from 'react-router'

export const CounterPageGate = createGate<CounterPageUrlParams>('CounterPage')

export const $counter = combine(
  CounterPageGate.state,
  $countersById,
  (gateState, countersById) =>
    gateState.counterId && gateState.counterId in countersById
      ? countersById[gateState.counterId]
      : null,
)

const tryFetchCounterFx = attach({ effect: getCounterFx })

createAction(CounterPageGate.state, {
  source: {
    counter: $counter,
    gateStatus: CounterPageGate.status,
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

export const deltaButtonClicked = createEvent<number>()

sample({
  clock: deltaButtonClicked,
  source: $counter,
  filter: (counter) => !!counter,
  fn: (counter, delta) => ({ delta, counter_id: counter!.id }),
  target: changeCounterValueByDelta,
})

const passCounterIdSampleProps = {
  source: $counter,
  filter: (counter: Counter | null) => !!counter,
  fn: (counter: Counter) => ({ id: counter.id }),
}

sample({
  clock: deleteCounterFx.done,
  source: CounterPageGate.state,
  filter: ({ counterId }, deleted) => counterId === deleted.params.id,
  fn: (): NavigateOptions => ({ replace: true }),
  target: goToHomePage,
})

export const resetCounterClicked = createEvent()

sample({
  clock: resetCounterClicked,
  ...passCounterIdSampleProps,
  target: resetCounterValueFx,
})

export const deleteCounter = createEvent<Pick<Counter, 'id'>>()
sample({
  clock: deleteCounter,
  target: deleteCounterFx,
})

export const deleteCounterConfirmed = createEvent()

sample({
  clock: deleteCounterConfirmed,
  ...passCounterIdSampleProps,
  target: deleteCounter,
})
