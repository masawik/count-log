import type { Counter } from '@/entities/counter/@x/counterEvent'

import type { ColumnType, Insertable, Selectable, Updateable } from 'kysely'

export interface CounterEventsTable {
  id: ColumnType<string, string | undefined, never>,
  counter_id: Counter['id'],
  created_at: ColumnType<Date, string | undefined, never>,
  note?: 'correction' | 'reset',
  current_value?: number,
  delta: number,
}

export type CounterEventDto = Selectable<CounterEventsTable>
export type NewCounterEventDto = Insertable<CounterEventsTable>
export type CounterEventUpdateDto = Updateable<CounterEventsTable>
