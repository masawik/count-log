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
    .addColumn('description', 'text', (col) => col.defaultTo(null))
    .addColumn('initial_value', 'integer')
    .addColumn('emojiIcon', 'text')
    .addColumn('steps', 'text')
    .addColumn('current_value', 'integer')
    .addColumn('created_at', 'timestamp', (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`),
    )
    .addColumn('updated_at', 'timestamp', (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`),
    )
    .execute()

    await sql`
      CREATE TRIGGER IF NOT EXISTS counters_updated_at
      AFTER UPDATE ON counters
      FOR EACH ROW
      WHEN NEW.updated_at = OLD.updated_at
      BEGIN
        UPDATE counters
        SET updated_at = datetime('now')
        WHERE id = OLD.id;
      END;
    `.execute(trx)
  })
}
