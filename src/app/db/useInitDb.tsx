import { useEffect, useState } from 'react'

import { IS_WEB } from '@/shared/config'
import { db, sqlite } from '@/shared/db'
import { useAsyncErrorToBoundary } from '@/shared/lib'

import { ensureAllTables } from './ensureAllTables'
import { initWebStore } from './initWebStore'

let inited = false

export function useInitDb() {
  const [ loading, setLoading ] = useState(true)
  const setError = useAsyncErrorToBoundary()

  useEffect(() => {
    if (inited) return
    inited = true;

    (async () => {
      try {
        if (IS_WEB) {
          await initWebStore(sqlite)
        }

        await ensureAllTables(db)
        setLoading(false)
      } catch (e) {
        setError(e)
      }
    })()
  }, [ setError ])

  return { loading }
}
