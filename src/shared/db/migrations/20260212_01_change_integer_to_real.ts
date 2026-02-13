import { sql } from 'kysely'

import { checkTableExists } from './utils'

import type { DbInstance } from '../types'
import type { Migration } from 'kysely'


/**
 * Migration: Change integer columns to real for floating point support
 *
 * Changes:
 * - counters.initial_value: integer → real
 * - counters.current_value: integer → real
 * - counter_events.delta: integer → real
 * - counter_events.current_value: integer → real
 */
export const migration: Migration = {
  async up(db: DbInstance): Promise<void> {
    // Check which tables exist
    const countersTableExists = await checkTableExists(db, 'counters')
    const counterEventsTableExists = await checkTableExists(
      db,
      'counter_events',
    )

    if (!countersTableExists && !counterEventsTableExists) return

    // Execute migration in a single transaction to ensure consistency
    // Each table is migrated separately if it exists
    await db.transaction().execute(async (trx) => {
      // Step 1: Drop triggers first to avoid dependency issues
      if (counterEventsTableExists) {
        await sql`DROP TRIGGER IF EXISTS counter_events_apply_delta`.execute(trx)
      }
      if (countersTableExists) {
        await sql`DROP TRIGGER IF EXISTS counters_updated_at`.execute(trx)
      }

      // Step 2: Migrate counters table first (counter_events depends on it)
      if (countersTableExists) {
        // Create new table with real types and same defaults as original
        await trx.schema
          .createTable('counters_new')
          .addColumn('id', 'text', (col) => col.primaryKey().notNull())
          .addColumn('name', 'text')
          .addColumn('initial_value', 'real')
          .addColumn('emojiIcon', 'text')
          .addColumn('steps', 'text', (col) =>
            col.defaultTo(sql`'[{"value":-1},{"value":1}]'`),
          )
          .addColumn('current_value', 'real')
          .addColumn('created_at', 'text', (col) =>
            col.defaultTo(sql`(strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))`),
          )
          .addColumn('updated_at', 'text', (col) =>
            col.defaultTo(sql`(strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))`),
          )
          .execute()

        // Copy data from old table
        await sql`
          INSERT INTO counters_new
          SELECT id, name, initial_value, emojiIcon, steps, current_value, created_at, updated_at
          FROM counters
        `.execute(trx)

        // Drop old table
        await trx.schema.dropTable('counters').execute()

        // Rename new table
        await sql`ALTER TABLE counters_new RENAME TO counters`.execute(trx)

        // Recreate trigger
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
      }

      // Step 3: Migrate counter_events table (after counters is migrated)
      if (counterEventsTableExists) {
        // Create new table with real types, same defaults as original, and foreign key constraint
        await trx.schema
          .createTable('counter_events_new')
          .addColumn('id', 'text', (col) =>
            col.primaryKey().defaultTo(sql`(lower(hex(randomblob(16))))`),
          )
          .addColumn('counter_id', 'text', (c) => c.notNull())
          .addForeignKeyConstraint(
            'fk_counter_events_counter',
            [ 'counter_id' ],
            'counters',
            [ 'id' ],
            (fk) => fk.onDelete('cascade'),
          )
          .addColumn('created_at', 'text', (col) =>
            col.defaultTo(sql`(strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))`),
          )
          .addColumn('delta', 'real', (c) => c.notNull())
          .addColumn('note', 'text')
          .addColumn('current_value', 'real')
          .execute()

        // Copy data from old table
        await sql`
          INSERT INTO counter_events_new
          SELECT id, counter_id, created_at, delta, note, current_value
          FROM counter_events
        `.execute(trx)

        // Drop old table
        await trx.schema.dropTable('counter_events').execute()

        // Rename new table
        await sql`ALTER TABLE counter_events_new RENAME TO counter_events`.execute(trx)

        // Recreate trigger (now counters table exists)
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
      }
    })
  },

  async down(db: DbInstance): Promise<void> {
    // Rollback migration: change real back to integer
    // Note: This will truncate decimal values

    const countersTableExists = await checkTableExists(db, 'counters')
    const counterEventsTableExists = await checkTableExists(
      db,
      'counter_events',
    )

    // If tables don't exist, migration should do nothing
    // Tables will be created with correct schema by ensureAllTablesFx
    if (!countersTableExists && !counterEventsTableExists) {
      return
    }

    // Execute rollback in a single transaction
    await db.transaction().execute(async (trx) => {
      // Step 1: Drop triggers first
      if (counterEventsTableExists) {
        await sql`DROP TRIGGER IF EXISTS counter_events_apply_delta`.execute(trx)
      }
      if (countersTableExists) {
        await sql`DROP TRIGGER IF EXISTS counters_updated_at`.execute(trx)
      }

      // Step 2: Rollback counter_events first (it depends on counters)
      if (counterEventsTableExists) {
        await trx.schema
          .createTable('counter_events_new')
          .addColumn('id', 'text', (col) =>
            col.primaryKey().defaultTo(sql`(lower(hex(randomblob(16))))`),
          )
          .addColumn('counter_id', 'text', (c) => c.notNull())
          .addForeignKeyConstraint(
            'fk_counter_events_counter',
            [ 'counter_id' ],
            'counters',
            [ 'id' ],
            (fk) => fk.onDelete('cascade'),
          )
          .addColumn('created_at', 'text', (col) =>
            col.defaultTo(sql`(strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))`),
          )
          .addColumn('delta', 'integer', (c) => c.notNull())
          .addColumn('note', 'text')
          .addColumn('current_value', 'integer')
          .execute()

        await sql`
          INSERT INTO counter_events_new
          SELECT id, counter_id, created_at, CAST(delta AS INTEGER), note, CAST(current_value AS INTEGER)
          FROM counter_events
        `.execute(trx)

        await trx.schema.dropTable('counter_events').execute()
        await sql`ALTER TABLE counter_events_new RENAME TO counter_events`.execute(trx)
      }

      // Step 3: Rollback counters table
      if (countersTableExists) {
        await trx.schema
          .createTable('counters_new')
          .addColumn('id', 'text', (col) => col.primaryKey().notNull())
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
          INSERT INTO counters_new
          SELECT id, name, CAST(initial_value AS INTEGER), emojiIcon, steps, CAST(current_value AS INTEGER), created_at, updated_at
          FROM counters
        `.execute(trx)

        await trx.schema.dropTable('counters').execute()
        await sql`ALTER TABLE counters_new RENAME TO counters`.execute(trx)

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
      }

      // Step 4: Recreate counter_events trigger (after counters is rolled back)
      if (counterEventsTableExists) {
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
      }
    })
  },
}
