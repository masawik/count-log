import { attach } from 'effector'

import { $db } from '@/shared/db'

import type { CounterEvent, NewCounterEvent } from './types'

export const createCounterEventFx = attach({
  source: $db,
  effect: async (db, event: NewCounterEvent) => {
    const id = crypto.randomUUID()

    await db
      .insertInto('counter_events')
      .values({
        ...event,
        id,
      })
      .execute()

    return getCounterEventFx({ id })
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
