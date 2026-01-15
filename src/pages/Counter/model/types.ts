import type { Counter } from '@/entities/counter'

export type CounterPageUrlParams = { counterId?: Counter['id'] }
export type CounterOutletContext = { counter: Counter }
