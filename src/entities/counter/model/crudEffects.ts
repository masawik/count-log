import { attach } from 'effector'

import { $db } from '@/shared/db'

import type { Counter, CounterUpdate, NewCounter } from './types'

export const createCounterFx = attach({
  source: $db,
  effect: (db, newCounter: NewCounter) => {
    return db
      .insertInto('counters')
      .values({
        ...newCounter,
        current_value: newCounter.initial_value,
      })
      .returningAll()
      .executeTakeFirstOrThrow()
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
  effect: (db, update: CounterUpdate) => {
    const { id, ...patch } = update

    return db
      .updateTable('counters')
      .set(patch)
      .where('id', '=', id)
      .returningAll()
      .executeTakeFirstOrThrow()
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
