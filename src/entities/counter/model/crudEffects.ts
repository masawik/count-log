import { attach } from 'effector'

import { $db } from '@/shared/db'

import type { Counter, CounterUpdate, NewCounter } from './types'

export const createCounterFx = attach({
  source: $db,
  effect: async (db, newCounter: NewCounter) => {
    const id = crypto.randomUUID()

    await db
      .insertInto('counters')
      .values({
        ...newCounter,
        id,
        current_value: newCounter.initial_value,
      })
      .execute()

    return getCounterFx({ id })
  },
})

export const getCountersFx = attach({
  source: $db,
  effect: (db) => {
    return db.selectFrom('counters').selectAll().execute()
  },
})

export const getCounterFx = attach({
  source: $db,
  effect: (db, selector: Pick<Counter, 'id'>) => {
    return db
      .selectFrom('counters')
      .selectAll()
      .where('id', '=', selector.id)
      .executeTakeFirstOrThrow()
  },
})

export const updateCounterFx = attach({
  source: $db,
  effect: async (db, update: CounterUpdate) => {
    const { id, ...patch } = update

    await db.updateTable('counters').set(patch).where('id', '=', id).execute()

    return getCounterFx({ id })
  },
})

export const deleteCounterFx = attach({
  source: $db,
  effect: (db, { id }: Pick<Counter, 'id'>) => {
    return db
      .deleteFrom('counters')
      .where('id', '=', id)
      .executeTakeFirstOrThrow()
  },
})
