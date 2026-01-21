import { attach, createEvent, createStore, sample } from 'effector'
import { createAction } from 'effector-action'

import { updateCounterFx, type Counter } from '@/entities/counter'

export type CounterVisualFields = Pick<Counter, 'emojiIcon' | 'name'>

export const editCounterVisualDialogOpened = createEvent<Counter>()
export const editCounterVisualDialogClosed = createEvent()

export const $counter = createStore<Counter | null>(null)
  .on(editCounterVisualDialogOpened, (_, counter) => counter)
  .reset(editCounterVisualDialogClosed)

export const updateCounterVisualFx = attach({ effect: updateCounterFx })
export const $isSubmitting = updateCounterVisualFx.pending

export const formSubmitted = createEvent<CounterVisualFields>()

createAction(formSubmitted, {
  source: { counter: $counter },
  target: { updateCounterVisualFx },
  fn(target, source, update) {
    if (!source.counter) return

    target.updateCounterVisualFx({
      id: source.counter.id,
      ...update,
    })
  },
})

sample({
  clock: updateCounterVisualFx.done,
  target: editCounterVisualDialogClosed,
})

