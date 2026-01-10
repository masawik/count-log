import { sql } from 'kysely'

import type { Kysely } from 'kysely'

export const ensureCounterEventsTable = async <Db = unknown>(db: Kysely<Db>) => {

  await db.transaction().execute(async (trx) => {
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
    .addColumn('created_at', 'timestamp', (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`),
    )
    .addColumn('delta', 'integer', (c) => c.notNull())
    .execute()


    await sql`
      CREATE TRIGGER IF NOT EXISTS trg_counter_events_ai
      AFTER INSERT ON counter_events
      FOR EACH ROW
      BEGIN
        UPDATE counters
        SET current_value = current_value + NEW.delta,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = NEW.counter_id;
      END;
    `.execute(trx)
  })
}
