import { ensureCountersTable } from '@/entities/counter'

import type { Kysely } from 'kysely'

export async function ensureAllTables<DB = unknown>(db: Kysely<DB>) {
  await ensureCountersTable(db)
}
