import { CapacitorSQLite, SQLiteConnection } from '@capacitor-community/sqlite'
import CapacitorSQLiteKyselyDialect from 'capacitor-sqlite-kysely'
import { createStore } from 'effector'
import { Kysely } from 'kysely'
import { SerializePlugin } from 'kysely-plugin-serialize'

import { SHOULD_LOG_KYSELY_OPERATIONS } from '../config'
import { logPlugin } from './logplugin'

import type { Database } from './types'

export const $sqlite = createStore(new SQLiteConnection(CapacitorSQLite))

export const $db = $sqlite.map(sqlite => new Kysely<Database>({
  dialect: new CapacitorSQLiteKyselyDialect(sqlite, {}),
  plugins: [
    new SerializePlugin(),
    ...(SHOULD_LOG_KYSELY_OPERATIONS ? [ logPlugin ] : []),
  ],
}))
