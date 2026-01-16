import { combine, createEvent, createStore, sample, type Store } from 'effector'
import { keyBy } from 'lodash-es'

import { dbInited } from '@/shared/model'

import { deleteCounterFx, getCounterFx, getCountersFx } from './crudEffects'

import type { CounterDto } from './tableTypes'
import type { Counter } from './types'

export const $counters = createStore<Counter[]>([])

export const $countersById = combine($counters, (store) => keyBy(store, 'id')) as Store<Record<CounterDto['id'], CounterDto>>

sample({
  clock: dbInited,
  target: getCountersFx,
})

sample({
  clock: getCountersFx.doneData,
  target: $counters,
})

export const counterUpdated = createEvent<{ id: CounterDto['id'] }>()
export const counterMaybeUpdated = createEvent<{ id: CounterDto['id'] }>()
sample({
  clock: counterMaybeUpdated,
  target: counterUpdated,
})

sample({
  clock: counterUpdated,
  target: getCounterFx,
})

sample({
  clock: getCounterFx.doneData,
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

export const counterDeleted = createEvent<Pick<CounterDto, 'id'>>()

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
