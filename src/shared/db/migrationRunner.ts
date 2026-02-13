import { attach } from 'effector'
import { Migrator } from 'kysely'

import { log } from '@/shared/lib'

import { migrationProvider } from './migrations'
import { $db } from './model'

/**
 * Runs all pending migrations using Kysely Migrator.
 *
 * Migrations are executed in alphabetical order based on their names.
 * The Migrator automatically creates the kysely_migration table and tracks
 * applied migrations.
 *
 * Migrations should check if tables exist before modifying them, as the database
 * might be empty when migrations run (tables will be created by ensureAllTablesFx
 * after migrations complete).
 *
 * @returns MigrationResultSet with information about executed migrations and any errors
 */
export const runMigrationsFx = attach({
  source: { db: $db },
  effect: async ({ db }) => {
    const migrator = new Migrator({
      db,
      provider: migrationProvider,
    })

    const result = await migrator.migrateToLatest()

    // Kysely Migrator doesn't throw errors, it returns them in the result
    if (result.error) {
      console.error('Migration error:', result.error)
      throw result.error
    }

    // Log migration results
    if (result.results) {
      const appliedMigrations = result.results.filter(
        (r) => r.status === 'Success',
      )
      const failedMigrations = result.results.filter(
        (r) => r.status === 'Error',
      )

      if (appliedMigrations.length > 0) {
        log(
          `Applied ${appliedMigrations.length} migration(s):`,
          appliedMigrations.map((r) => r.migrationName),
        )
      }

      if (failedMigrations.length > 0) {
        console.error(
          `Failed ${failedMigrations.length} migration(s):`,
          failedMigrations.map((r) => r.migrationName),
        )
        throw new Error(
          `Migration failed: ${failedMigrations.map((r) => r.migrationName).join(', ')}`,
        )
      }
    }

    return result
  },
})
