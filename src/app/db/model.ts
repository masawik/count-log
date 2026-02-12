import { attach, createEffect, createStore, sample } from 'effector'
import { createGate } from 'effector-react'
import { once } from 'patronum/once'

import { ensureCountersTableFx } from '@/entities/counter'
import { ensureCounterEventsTableFx } from '@/entities/counterEvent'

import { IS_WEB } from '@/shared/config'
import { $sqlite, runMigrationsFx } from '@/shared/db'
import { appErrorHappened } from '@/shared/errors'

import { initWebStore } from './initWebStore'

export const AppGate = createGate()
export const $loading = createStore(true)

const initWebStoreIfNeedFx = attach({
  source: { $sqlite },
  effect: async ({ $sqlite }) => {
    if (IS_WEB) {
      await initWebStore($sqlite)
    }
  },
})

const ensureAllTablesFx = createEffect(async () => {
  await ensureCountersTableFx()
  await ensureCounterEventsTableFx()
})

sample({
  clock: [
    initWebStoreIfNeedFx.failData,
    ensureAllTablesFx.failData,
    runMigrationsFx.failData,
  ],
  target: appErrorHappened,
})

sample({
  clock: once(AppGate.open),
  target: initWebStoreIfNeedFx,
})

sample({
  clock: initWebStoreIfNeedFx.done,
  target: ensureAllTablesFx,
})

sample({
  clock: ensureAllTablesFx.done,
  target: runMigrationsFx,
})

sample({
  clock: [
    ensureAllTablesFx.fail,
    runMigrationsFx.finally,
  ],
  fn: () => false,
  target: $loading,
})
