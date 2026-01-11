import type { Counter } from '@/entities/counter/@x/counterEvent'

import type { ColumnType, Insertable, Selectable, Updateable } from 'kysely'

export interface CounterEventsTable {
  id: ColumnType<string, string | undefined, never>,
  counter_id: Counter['id'],
  created_at: ColumnType<Date, string | undefined, never>,
  delta: number,
}

export type CounterEvent = Selectable<CounterEventsTable>
export type NewCounterEvent = Insertable<CounterEventsTable>
export type CounterEventUpdate = Updateable<CounterEventsTable>
