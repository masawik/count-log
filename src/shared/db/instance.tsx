import { CapacitorSQLite, SQLiteConnection } from '@capacitor-community/sqlite'
import CapacitorSQLiteKyselyDialect from 'capacitor-sqlite-kysely'
import { Kysely } from 'kysely'
import { SerializePlugin } from 'kysely-plugin-serialize'

import type { Database } from './types'

export const sqlite = new SQLiteConnection(CapacitorSQLite)

export const db = new Kysely<Database>({
  dialect: new CapacitorSQLiteKyselyDialect(sqlite, {}),
  plugins: [ new SerializePlugin() ],
})
