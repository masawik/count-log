import { attach, combine, createStore, sample } from 'effector'
import { createGate } from 'effector-react'

import type { Counter } from '@/entities/counter'
import { type CounterEvent } from '@/entities/counterEvent'

import { $db } from '@/shared/db'

export const conuterHistoryPageGate = createGate<Counter>()

const $counter = conuterHistoryPageGate.state.map((c) => c)

export const $events = createStore<CounterEvent[] | null>(null).reset(
  conuterHistoryPageGate.close,
)

export type GetCounterEventsSelector = Pick<CounterEvent, 'counter_id'>
const getCounterEventsForHistoryPageFx = attach({
  source: $db,
  effect: (db, selector: GetCounterEventsSelector) => {
    return db
      .selectFrom('counter_events')
      .selectAll()
      .where('counter_id', '=', selector.counter_id)
      .orderBy('created_at', 'desc')
      .execute()
  },
})

export const $loading = combine(
  {
    events: $events,
    pending: getCounterEventsForHistoryPageFx.pending,
  },
  ({ events, pending }) => events === null || pending,
)

sample({
  clock: conuterHistoryPageGate.open,
  fn: ({ id }): GetCounterEventsSelector => ({ counter_id: id }),
  target: getCounterEventsForHistoryPageFx,
})

sample({
  clock: getCounterEventsForHistoryPageFx.done,
  source: $counter,
  filter: (counter, { params }) => params?.counter_id === counter.id,
  fn: (_, { result }) => result,
  target: $events,
})
