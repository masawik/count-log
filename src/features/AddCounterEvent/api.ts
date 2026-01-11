import { createCounterEvent, type NewCounterEvent } from '@/entities/counterEvent'

import { counterEventAdded } from './model'

export const addCounterEvent = async (event: NewCounterEvent) => {
  const eventRecord = await createCounterEvent(event)
  counterEventAdded(eventRecord)
}
