import { sql } from 'kysely'

import { checkTableExists } from './utils'

import type { DbInstance } from '../types'
import type { Migration } from 'kysely'

/**
 * Migration: Add rounding to counter_events_apply_delta trigger
 *
 * Changes:
 * - Updates counter_events_apply_delta trigger to round current_value to 2 decimal places
 * - Uses ROUND() function with precision 2 to match NUM_COUNTER_MAX_PRECISION constant
 */
export const migration: Migration = {
  async up(db: DbInstance): Promise<void> {
    const counterEventsTableExists = await checkTableExists(db, 'counter_events')

    // If table doesn't exist, migration should do nothing
    // Table will be created with correct trigger by ensureCounterEventsTableFx
    if (!counterEventsTableExists) {
      return
    }

    // Execute migration in a transaction
    await db.transaction().execute(async (trx) => {
      // Drop old trigger
      await sql`DROP TRIGGER IF EXISTS counter_events_apply_delta`.execute(trx)

      // Create new trigger with rounding
      await sql`
        CREATE TRIGGER IF NOT EXISTS counter_events_apply_delta
        AFTER INSERT ON counter_events
        FOR EACH ROW
        BEGIN
          UPDATE counter_events
          SET current_value = ROUND(
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
            ),
            2
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

  async down(db: DbInstance): Promise<void> {
    const counterEventsTableExists = await checkTableExists(db, 'counter_events')

    if (!counterEventsTableExists) {
      return
    }

    // Rollback: remove rounding from trigger
    await db.transaction().execute(async (trx) => {
      // Drop trigger with rounding
      await sql`DROP TRIGGER IF EXISTS counter_events_apply_delta`.execute(trx)

      // Recreate trigger without rounding (original version)
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
}
