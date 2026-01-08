import { db } from '@/shared/db'

import type { NewCounter } from '../model'

export const createCounter = async (data: NewCounter) => {
  return await db
    .insertInto('counters')
    .values({
      ...data,
    })
    .executeTakeFirst()
}
