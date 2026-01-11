/* eslint-disable no-console */
import type { KyselyPlugin } from 'kysely'

export const logPlugin = {
  transformQuery(args) {
    console.log(args)

    return args.node
  },
  async transformResult(args) {
    console.log(args)

    return args.result
  },
} as const satisfies KyselyPlugin
