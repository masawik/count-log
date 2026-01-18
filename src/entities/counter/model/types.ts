import type { CounterDto, NewCounterDto } from './tableTypes'

export type Counter = CounterDto
export type NewCounter = Pick<NewCounterDto,
  | 'name'
  | 'initial_value'
  | 'emojiIcon'
  | 'steps'
>
export type CounterUpdate = Partial<NewCounter> & Pick<Counter, 'id'>
