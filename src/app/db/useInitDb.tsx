import { useEffect, useState } from 'react'

import { IS_WEB } from '@/shared/config'
import { db, sqlite } from '@/shared/db'

import { ensureAllTables } from './ensureAllTables'
import { initWebStore } from './initWebStore'


let inited = false

export function useInitDb() {
  const [ loading, setLoading ] = useState(true)

  useEffect(() => {
    if (inited) return
    inited = true

    ;(async () => {
      if (IS_WEB) {
        await initWebStore(sqlite)
      }

      await ensureAllTables(db)

    })().then(() => {
      setLoading(false)
    })
  }, [])

  return { loading }
}

