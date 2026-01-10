import type { EmojiIconType } from '@/entities/EmojiIcon'

import type { JSONColumnType } from '@/shared/db/types'

import type { ColumnType, Insertable, Selectable, Updateable } from 'kysely'

export interface CountersTable {
  id: ColumnType<string, string | undefined, never>,
  name: string,
  description: ColumnType<string, string | undefined, string | undefined>,
  initial_value: number,
  emojiIcon: JSONColumnType<EmojiIconType>,
  steps: JSONColumnType<({ value: number })[]>,
  created_at: ColumnType<Date, string | undefined, never>,
  current_value: number,
  updated_at: ColumnType<Date, string | undefined, never>,
}

export type Counter = Selectable<CountersTable>
export type NewCounter = Insertable<CountersTable>
export type CounterUpdate = Updateable<CountersTable>
