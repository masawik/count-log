import { db } from '@/shared/db'

import type { NewCounterEvent } from '../model'

export const createCounterEvent = async (event: NewCounterEvent) => {
  return await db
    .insertInto('counter_events')
    .values({
      ...event,
    })
    .executeTakeFirst()
}
