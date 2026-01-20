import { attach } from 'effector'
import {
  sql,
  type ColumnType,
  type Insertable,
  type Selectable,
  type Updateable,
} from 'kysely'

import { $db, type JSONColumnType } from '@/shared/db'
import type { EmojiIconType } from '@/shared/ui'

type CounterValue = number
type Step = { value: CounterValue }
export interface CountersTable {
  id: ColumnType<string, string | undefined, never>,
  name: string,
  initial_value: CounterValue,
  emojiIcon: JSONColumnType<EmojiIconType>,
  steps: JSONColumnType<Step[], Step[] | undefined>,
  created_at: ColumnType<Date, string | undefined, never>,
  current_value: CounterValue,
  updated_at: ColumnType<Date, string | undefined, never>,
}

export type CounterDto = Selectable<CountersTable>
export type NewCounterDto = Insertable<CountersTable>
export type CounterUpdateDto = Updateable<CountersTable>

export const ensureCountersTableFx = attach({
  source: { db: $db },
  effect: ({ db }) => {
    return db.transaction().execute(async (trx) => {
      await trx.schema
        .createTable('counters')
        .ifNotExists()
        .addColumn('id', 'text', (col) =>
          col.primaryKey().defaultTo(sql`(lower(hex(randomblob(16))))`),
        )
        .addColumn('name', 'text')
        .addColumn('initial_value', 'integer')
        .addColumn('emojiIcon', 'text')
        .addColumn('steps', 'text', (col) =>
          col.defaultTo(sql`'[{"value":-1},{"value":1}]'`),
        )
        .addColumn('current_value', 'integer')
        .addColumn('created_at', 'text', (col) =>
          col.defaultTo(sql`(strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))`),
        )
        .addColumn('updated_at', 'text', (col) =>
          col.defaultTo(sql`(strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))`),
        )
        .execute()

      await sql`
        CREATE TRIGGER IF NOT EXISTS counters_updated_at
        AFTER UPDATE ON counters
        FOR EACH ROW
        WHEN NEW.updated_at = OLD.updated_at
        BEGIN
          UPDATE counters
          SET updated_at = (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
          WHERE id = OLD.id;
        END;
      `.execute(trx)
    })
  },
})
