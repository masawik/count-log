import { createEvent, createStore, sample } from 'effector'

export const $appError = createStore<unknown>(null)

export const appErrorHappened = createEvent<unknown>()

sample({
  clock: appErrorHappened,
  target: $appError,
})
