import { useUnit } from 'effector-react'
import { useEffect, useState } from 'react'

import { IS_WEB } from '@/shared/config'
import { $db, $sqlite } from '@/shared/db'
import { useAsyncErrorToBoundary } from '@/shared/lib'
import { dbInited } from '@/shared/model'

import { ensureAllTables } from './ensureAllTables'
import { initWebStore } from './initWebStore'

let inited = false

export function useInitDb() {
  const dbInitedEvent = useUnit(dbInited)
  const [ loading, setLoading ] = useState(true)
  const setError = useAsyncErrorToBoundary()

  useEffect(() => {
    if (inited) return
    inited = true;

    (async () => {
      try {
        if (IS_WEB) {
          await initWebStore($sqlite.getState())
        }

        await ensureAllTables($db.getState())
        setLoading(false)
        dbInitedEvent()
      } catch (e) {
        setError(e)
      }
    })()
  }, [ setError, dbInitedEvent ])

  return { loading }
}
