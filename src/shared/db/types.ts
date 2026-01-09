import type { CountersTable } from '@/entities/counter'

import type { ColumnType } from 'kysely'

export interface Database {
  counters: CountersTable,
}

/**
 * Since the SerializePlugin plugin is used (see `./instance.ts`),
 * JSON data can be transmitted "as is"
 */
export type JSONColumnType<T> = ColumnType<T, T, T>
