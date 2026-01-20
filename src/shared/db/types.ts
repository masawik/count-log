import type { CountersTable } from '@/entities/counter'
import type { CounterEventsTable } from '@/entities/counterEvent'

import type { ColumnType } from 'kysely'

export interface Database {
  counters: CountersTable,
  counter_events: CounterEventsTable,
}

/**
 * Since the SerializePlugin plugin is used (see `./instance.ts`),
 * JSON data can be transmitted "as is"
 */
export type JSONColumnType<S, I = S, U = S> = ColumnType<S, I, U>
