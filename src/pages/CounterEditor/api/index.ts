import { updateCounter as updateCounterApi, type CounterUpdate } from '@/entities/counter'

import { counterUpdated } from '../model'

export const updateCounter = async (data: CounterUpdate) => {
  const record = await updateCounterApi(data)
  counterUpdated(record)

  return record
}
