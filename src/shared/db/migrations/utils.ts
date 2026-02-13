import type { DbInstance } from '../types'

/**
 * Checks if a table exists in the database.
 *
 * @param db - Database instance
 * @param tableName - Name of the table to check
 * @returns Promise that resolves to true if the table exists, false otherwise
 */
export async function checkTableExists(
  db: DbInstance,
  tableName: string,
): Promise<boolean> {
  const result = await db
    .selectFrom('sqlite_master')
    .select('name')
    .where('type', '=', 'table')
    .where('name', '=', tableName)
    .executeTakeFirst()

  return !!result
}
