import type { Counter } from '@/entities/counter'

export type CorrectionUpdate = Pick<Counter, 'id'> & {
  targetValue: Counter['current_value'],
}
