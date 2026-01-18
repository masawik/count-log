import { sql } from 'kysely'

import type { Kysely } from 'kysely'

export const ensureCountersTable = async <Db = unknown>(db: Kysely<Db>) => {
  await db.transaction().execute(async (trx) => {
    await trx.schema
    .createTable('counters')
    .ifNotExists()
    .addColumn('id', 'text', (col) =>
      col.primaryKey().defaultTo(sql`(lower(hex(randomblob(16))))`),
    )
    .addColumn('name', 'text')
    .addColumn('initial_value', 'integer')
    .addColumn('emojiIcon', 'text')
    .addColumn('steps', 'text')
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
}
