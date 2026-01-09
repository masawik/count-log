import { useEffect, useState } from 'react'

import { db } from '@/shared/db'

import type { Counter, NewCounter } from '../model'

export const createCounter = async (data: NewCounter) => {
  return await db
    .insertInto('counters')
    .values({
      ...data,
    })
    .executeTakeFirst()
}

export const getCounters = async () => {
  return db.selectFrom('counters').selectAll().execute()
}

export const useGetCounters = () => {
  const [ counters, setCounters ] = useState<Counter[]>()
  useEffect(() => {
    getCounters().then(setCounters)
  }, [])

  return counters
}
