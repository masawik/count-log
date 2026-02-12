import { attach } from 'effector'
import {
  sql,
  type ColumnType,
  type Insertable,
  type Selectable,
  type Updateable,
} from 'kysely'

import type { Counter } from '@/entities/counter/@x/counterEvent'

import { $db } from '@/shared/db'


export interface CounterEventsTable {
  id: ColumnType<string, string, never>,
  counter_id: Counter['id'],
  created_at: ColumnType<Date, string | undefined, never>,
  note?: 'correction' | 'reset',
  current_value?: number,
  delta: number,
}

export type CounterEventDto = Selectable<CounterEventsTable>
export type NewCounterEventDto = Insertable<CounterEventsTable>
export type CounterEventUpdateDto = Updateable<CounterEventsTable>

export const ensureCounterEventsTableFx = attach({
  source: { db: $db },
  effect: ({ db }) => {
    return db.transaction().execute(async (trx) => {
      await trx.schema
        .createTable('counter_events')
        .ifNotExists()
        .addColumn('id', 'text', (col) =>
          col.primaryKey().defaultTo(sql`(lower(hex(randomblob(16))))`),
        )
        .addColumn('counter_id', 'text', (c) => c.notNull())
        .addForeignKeyConstraint(
          'fk_counter_events_counter', // имя FK-constraint'а
          [ 'counter_id' ], // колонка(и) в этой таблице
          'counters', // таблица, на которую ссылаемся
          [ 'id' ], // колонка PK в таблице `counters`
          (fk) => fk.onDelete('cascade'), // поведение при удалении (опционально)
        )
        .addColumn('created_at', 'text', (col) =>
          col.defaultTo(sql`(strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))`),
        )
        .addColumn('delta', 'real', (c) => c.notNull())
        .addColumn('note', 'text')
        .addColumn('current_value', 'real')
        .execute()

      await sql`
        CREATE TRIGGER IF NOT EXISTS counter_events_apply_delta
        AFTER INSERT ON counter_events
        FOR EACH ROW
        BEGIN
          UPDATE counter_events
          SET current_value =
            (
              COALESCE(
                (
                  SELECT ce.current_value
                  FROM counter_events AS ce
                  WHERE ce.counter_id = NEW.counter_id
                    AND ce.rowid < NEW.rowid
                  ORDER BY ce.rowid DESC
                  LIMIT 1
                ),
                (SELECT c.initial_value  FROM counters AS c WHERE c.id = NEW.counter_id),
                (SELECT c.current_value  FROM counters AS c WHERE c.id = NEW.counter_id),
                0
              )
              + NEW.delta
            )
          WHERE rowid = NEW.rowid;

          UPDATE counters
          SET current_value =
            (SELECT ce.current_value FROM counter_events AS ce WHERE ce.rowid = NEW.rowid),
              updated_at = (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
          WHERE id = NEW.counter_id;
        END;
      `.execute(trx)
    })
  },
})
