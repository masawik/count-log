import { sql } from 'kysely'

import type { Counter } from '@/entities/counter'

import { db } from '@/shared/db'

import type { CorrectionUpdate } from './types'

export const resetCounterValue = async (selector: Pick<Counter, 'id'>) => {
  return db
    .insertInto('counter_events')
    .columns([ 'counter_id', 'delta', 'note' ])
    .expression((eb) =>
      eb
        .selectFrom('counters')
        .select((eb) => [
          eb.ref('id').as('counter_id'),
          sql<number>`COALESCE(initial_value, 0) - COALESCE(current_value, 0)`.as(
            'delta',
          ),
          sql<string>`'reset'`.as('note'),
        ])
        .where('id', '=', selector.id),
    )
    .executeTakeFirstOrThrow()
}

export const correctCounterValue = async (update: CorrectionUpdate) => {
  const { id, targetValue } = update

  return db
    .insertInto('counter_events')
    .columns([ 'counter_id', 'delta', 'note' ])
    .expression((eb) =>
      eb
        .selectFrom('counters')
        .select((eb) => [
          eb.ref('id').as('counter_id'),
          sql<number>`
            ${targetValue}
            - COALESCE(current_value, 0)
          `.as('delta'),
          sql<string>`'correction'`.as('note'),
        ])
        .where('id', '=', id),
    )
    .executeTakeFirstOrThrow()
}
