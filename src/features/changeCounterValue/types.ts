import type { Counter } from '@/entities/counter'
import type { NewCounterEvent } from '@/entities/counterEvent'

export type CounterValueChangedByDeltaAttrs = Pick<NewCounterEvent, 'counter_id' | 'delta'>
export type CorrectCounterValueAttrs = Pick<Counter, 'id'> & {
  targetValue: Counter['current_value'],
}
