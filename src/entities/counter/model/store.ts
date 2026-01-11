import { createEffect, createEvent, createStore, sample } from 'effector'

import { dbInited } from '@/shared/model'

import { getCounter, getCounters } from '../api'

import type { Counter } from './table'

export const $counters = createStore<Counter[]>([])

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
  source: $counters,
  fn: (counters, updatedCounter) => counters.map(c => c.id === updatedCounter.id ? updatedCounter : c),
  target: $counters,
})
