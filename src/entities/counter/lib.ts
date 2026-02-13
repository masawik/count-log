import { round } from 'lodash-es'

import { NUM_COUNTER_MAX_PRECISION } from '@/shared/config'


export const roundNumCounterValue = (value: number) =>
  round(value, NUM_COUNTER_MAX_PRECISION)
