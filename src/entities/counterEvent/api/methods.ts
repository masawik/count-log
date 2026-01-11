import { db } from '@/shared/db'

import type { CounterEvent, NewCounterEvent } from '../model'

export const createCounterEvent = async (event: NewCounterEvent) => {
  return await db
    .insertInto('counter_events')
    .values({
      ...event,
    })
    .returningAll()
    .executeTakeFirstOrThrow()
}

export const getCounterEvent = async (selector: Pick<CounterEvent, 'id'>) => {
  return await db
    .selectFrom('counter_events')
    .selectAll()
    .where('id', '=', selector.id)
    .executeTakeFirstOrThrow()
}
