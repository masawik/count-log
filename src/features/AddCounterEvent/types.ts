import type { NewCounterEvent } from '@/entities/counterEvent'

export type CounterDeltaEvent = Pick<NewCounterEvent, 'counter_id' | 'delta'>
