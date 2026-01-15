import { db } from '@/shared/db'

import type {
  Counter,
  NewCounter,
  CounterUpdateDTO,
} from '../model'

export const createCounter = async (
  data: Omit<NewCounter, 'current_value'>,
) => {
  return await db
    .insertInto('counters')
    .values({
      ...data,
      current_value: data.initial_value,
    })
    .returningAll()
    .executeTakeFirstOrThrow()
}

export const getCounters = async () => {
  return db.selectFrom('counters').selectAll().execute()
}

export const getCounter = async (selector: Pick<Counter, 'id'>) => {
  return await db
    .selectFrom('counters')
    .selectAll()
    .where('id', '=', selector.id)
    .executeTakeFirstOrThrow()
}

export type CounterUpdate = CounterUpdateDTO & Pick<Counter, 'id'>
export const updateCounter = async (data: CounterUpdate) => {
  const { id, ...patch } = data

  const updated = await db
    .updateTable('counters')
    .set(patch)
    .where('id', '=', id)
    .returningAll()
    .executeTakeFirstOrThrow()

  return updated
}

export const deleteCounter = async ({ id }: Pick<Counter, 'id'>) => {
  return db.deleteFrom('counters')
    .where('id', '=', id)
    .executeTakeFirstOrThrow()
}
