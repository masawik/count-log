import { attach } from 'effector'

import { $db } from '@/shared/db'

import type { CounterEvent, NewCounterEvent } from './types'

export const createCounterEventFx = attach({
  source: $db,
  effect: (db, event: NewCounterEvent) => {
    return db
      .insertInto('counter_events')
      .values({
        ...event,
      })
      .returningAll()
      .executeTakeFirstOrThrow()
  },
})

export type GetConunterEventSelector = Pick<CounterEvent, 'id'>
export const getCounterEventFx = attach({
  source: $db,
  effect: (db, selector: GetConunterEventSelector) => {
    return db
      .selectFrom('counter_events')
      .selectAll()
      .where('id', '=', selector.id)
      .executeTakeFirstOrThrow()
  },
})
