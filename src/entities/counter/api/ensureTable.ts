import { sql } from 'kysely'

import type { Kysely } from 'kysely'

export const ensureCountersTable = async <Db = unknown>(db: Kysely<Db>) => {

  await db.schema
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
      .addColumn('created_at', 'timestamp', (col) =>
        col.defaultTo(sql`CURRENT_TIMESTAMP`),
      )
      .execute()
}
