import { createEvent, sample } from 'effector'

import { $counters, type Counter } from '@/entities/counter'

export const counterUpdated = createEvent<Counter>()

sample({
  clock: counterUpdated,
  source: $counters,
  fn: (counters, updatedCounter) => counters.map(c => c.id === updatedCounter.id ? updatedCounter : c),
  target: $counters,
})
