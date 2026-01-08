import type { CountersTable } from '@/entities/counter'

export interface Database {
  counters: CountersTable,
}
