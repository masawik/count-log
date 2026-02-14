import { migration as migration20260212_01 } from './20260212_01_change_integer_to_real'
import { migration as migration20260212_02 } from './20260212_02_add_rounding_to_counter_events_trigger'

import type { Migration, MigrationProvider } from 'kysely'


/**
 * Custom MigrationProvider that statically imports all migrations.
 *
 * This is necessary because FileMigrationProvider may not work
 * in browser environments with Capacitor SQLite.
 */
export const migrationProvider: MigrationProvider = {
  // eslint-disable-next-line @typescript-eslint/require-await
  async getMigrations(): Promise<Record<string, Migration>> {
    return {
      '20260212_01_change_integer_to_real': migration20260212_01,
      '20260212_02_add_rounding_to_counter_events_trigger': migration20260212_02,
    }
  },
}
