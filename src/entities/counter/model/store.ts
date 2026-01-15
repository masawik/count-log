import { combine, createEffect, createEvent, createStore, sample, type Store } from 'effector'
import { keyBy } from 'lodash-es'

import { dbInited } from '@/shared/model'

import { deleteCounter, getCounter, getCounters } from '../api'

import type { Counter } from './table'

export const $counters = createStore<Counter[]>([])

export const $countersById = combine($counters, (store) => keyBy(store, 'id')) as Store<Record<Counter['id'], Counter>>

export const fetchCountersFx = createEffect(getCounters)

sample({
  clock: dbInited,
  target: fetchCountersFx,
})

sample({
  clock: fetchCountersFx.doneData,
  target: $counters,
})

export const fetchCounterFx = createEffect(getCounter)

export const counterUpdated = createEvent<{ id: Counter['id'] }>()
export const counterMaybeUpdated = createEvent<{ id: Counter['id'] }>()
sample({
  clock: counterMaybeUpdated,
  target: counterUpdated,
})

sample({
  clock: counterUpdated,
  target: fetchCounterFx,
})

sample({
  clock: fetchCounterFx.doneData,
  source: {
    counters: $counters, countersById: $countersById,
  },
  fn: ({ counters, countersById }, fetchedCounter) => {
    const id = fetchedCounter.id

    if (id in countersById) {
      return counters.map(c => c.id === fetchedCounter.id ? fetchedCounter : c)
    } else {
      return [ ...counters, fetchedCounter ]
    }
  },
  target: $counters,
})

export const deleteCounterFx = createEffect(deleteCounter)

export const counterDeleted = createEvent<Pick<Counter, 'id'>>()

sample({
  clock: counterDeleted,
  target: deleteCounterFx,
})

sample({
  clock: deleteCounterFx.done,
  source: $counters,
  fn: (counters, deleted) => counters.filter(c => c.id !== deleted.params.id),
  target: $counters,
})
