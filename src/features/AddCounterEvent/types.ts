import type { Counter } from '@/entities/counter'
import type { NewCounterEvent } from '@/entities/counterEvent'

export type CounterDeltaEvent = Pick<NewCounterEvent, 'counter_id' | 'delta'>
export type CounterCorrectionEvent = Pick<NewCounterEvent, 'counter_id'> & {
  value: Counter['current_value'],
}
