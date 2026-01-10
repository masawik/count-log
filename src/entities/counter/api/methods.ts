import { useCallback, useEffect, useState } from 'react'

import { db } from '@/shared/db'

import type { Counter, NewCounter } from '../model'

export const createCounter = async (
  data: Omit<NewCounter, 'current_value'>,
) => {
  return await db
    .insertInto('counters')
    .values({
      ...data,
      current_value: data.initial_value,
    })
    .executeTakeFirst()
}

export const getCounters = async () => {
  return db.selectFrom('counters').selectAll().execute()
}

export const useGetCounters = () => {
  const [ counters, setCounters ] = useState<Counter[]>()

  const update = useCallback(() => getCounters().then(setCounters), [])

  useEffect(() => {
    update()
  }, [])

  return { counters, update }
}
