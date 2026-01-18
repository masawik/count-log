
import type { JSONColumnType } from '@/shared/db'
import type { EmojiIconType } from '@/shared/ui'

import type { ColumnType, Insertable, Selectable, Updateable } from 'kysely'

export interface CountersTable {
  id: ColumnType<string, string | undefined, never>,
  name: string,
  initial_value: number,
  emojiIcon: JSONColumnType<EmojiIconType>,
  steps: JSONColumnType<({ value: number })[]>,
  created_at: ColumnType<Date, string | undefined, never>,
  current_value: number,
  updated_at: ColumnType<Date, string | undefined, never>,
}

export type CounterDto = Selectable<CountersTable>
export type NewCounterDto = Insertable<CountersTable>
export type CounterUpdateDto = Updateable<CountersTable>
