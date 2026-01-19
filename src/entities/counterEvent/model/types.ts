import type { CounterEventDto, CounterEventUpdateDto, NewCounterEventDto } from './table'


export type CounterEvent = CounterEventDto
export type NewCounterEvent = Pick<NewCounterEventDto, 'counter_id' | 'delta' | 'note'>
export type CounterEventUpdate = CounterEventUpdateDto
