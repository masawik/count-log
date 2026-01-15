import { createCounter } from '@/entities/counter'

import { counterAdded } from './model'

type NewCounterData = Parameters<typeof createCounter>[0]

export const addCounter = async (data: NewCounterData) => {
  const record = await createCounter(data)
  counterAdded(record)

  return record
}
