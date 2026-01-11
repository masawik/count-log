import { createEvent, sample } from 'effector'

import { $counters, type Counter } from '@/entities/counter'

export const counterAdded = createEvent<Counter>()

sample({
  clock: counterAdded,
  source: $counters,
  fn: (counters, newCounter) => ([ ...counters, newCounter ]),
  target: $counters,
})
