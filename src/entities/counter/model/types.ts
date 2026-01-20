import type { CounterDto, NewCounterDto } from './table'

export type Counter = CounterDto
export type NewCounter = Pick<NewCounterDto,
  | 'name'
  | 'initial_value'
  | 'emojiIcon'
>
export type CounterUpdate = Pick<Counter, 'id'> & Partial<Pick<Counter,
  | 'emojiIcon'
  | 'name'
  | 'steps'
>>
