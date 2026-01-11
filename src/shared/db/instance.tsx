import { CapacitorSQLite, SQLiteConnection } from '@capacitor-community/sqlite'
import CapacitorSQLiteKyselyDialect from 'capacitor-sqlite-kysely'
import { Kysely } from 'kysely'
import { SerializePlugin } from 'kysely-plugin-serialize'

import { SHOULD_LOG_KYSELY_OPERATIONS } from '../config'
import { logPlugin } from './logplugin'

import type { Database } from './types'

export const sqlite = new SQLiteConnection(CapacitorSQLite)

export const db = new Kysely<Database>({
  dialect: new CapacitorSQLiteKyselyDialect(sqlite, {}),
  plugins: [
    new SerializePlugin(),
    ...(SHOULD_LOG_KYSELY_OPERATIONS ? [ logPlugin ] : []),
  ],
})
