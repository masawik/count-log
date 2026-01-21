import {
  combine,
  createEvent,
  createStore,
  sample,
  type Store,
} from 'effector'
import { createGate } from 'effector-react'
import { keyBy } from 'lodash-es'

import {
  changeCounterValueByDelta,
  correctCounterValueFx,
  counterValueCorrected,
  resetCounterValueFx,
} from '@/features/changeCounterValue'

import {
  deleteCounterFx,
  getCounterFx,
  getCountersFx,
  updateCounterFx,
  type Counter,
  createCounterFx,
} from '@/entities/counter'
import { createCounterEventFx } from '@/entities/counterEvent'

export const CountersListGate = createGate()

export const $counters = createStore<Counter[]>([])
export const $countersById = combine($counters, (store) =>
  keyBy(store, 'id'),
) as Store<Record<Counter['id'], Counter>>

export const $initialLoading = createStore(true)
sample({
  clock: getCountersFx.finally,
  fn: () => false,
  target: $initialLoading,
})

// fetching
sample({
  clock: [ CountersListGate.open, createCounterFx.done, deleteCounterFx.done ],
  target: getCountersFx,
})

sample({
  clock: getCountersFx.doneData,
  target: $counters,
})

sample({
  clock: getCounterFx.doneData,
  source: {
    counters: $counters,
    countersById: $countersById,
  },
  fn: ({ counters, countersById }, fetchedCounter) => {
    const id = fetchedCounter.id

    if (id in countersById) {
      return counters.map((c) =>
        c.id === fetchedCounter.id ? fetchedCounter : c,
      )
    } else {
      return [ ...counters, fetchedCounter ]
    }
  },
  target: $counters,
})

// handling updates
export const counterUpdated = createEvent<{ id: Counter['id'] }>()
export const counterMaybeUpdated = createEvent<{ id: Counter['id'] }>()
sample({
  clock: counterMaybeUpdated,
  target: counterUpdated,
})

sample({
  clock: counterUpdated,
  target: getCounterFx,
})

sample({
  clock: updateCounterFx.doneData,
  target: counterUpdated,
})

// optimistic update
sample({
  clock: changeCounterValueByDelta,
  source: $counters,
  fn: (counters, { counter_id, delta }) =>
    counters.map((c) => {
      if (c.id !== counter_id) return c

      return {
        ...c,
        current_value: c.current_value + delta,
      }
    }),
  target: $counters,
})

sample({
  clock: counterValueCorrected,
  source: $counters,
  fn: (counters, { id, targetValue }) =>
    counters.map((c) => {
      if (c.id !== id) return c

      return {
        ...c,
        current_value: targetValue,
      }
    }),
  target: $counters,
})


// sync
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
