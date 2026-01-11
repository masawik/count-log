import { createEvent, sample } from 'effector'

import { counterMaybeUpdated } from '@/entities/counter'
import type { CounterEvent } from '@/entities/counterEvent'

export const counterEventAdded = createEvent<CounterEvent>()

/**
 * The counter associated with the newly created event might have been changed.
 */
sample({
  clock: counterEventAdded,
  fn: ({ counter_id }) => ({ id: counter_id }),
  target: counterMaybeUpdated,
})
