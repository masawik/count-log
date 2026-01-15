import { Theme } from '@radix-ui/themes'
import { Outlet, useNavigation } from 'react-router'

import { useInitRoutingStore } from '@/shared/routing'
import { FullPageLoader } from '@/shared/ui'

import { useInitDb } from './db/useInitDb'

import './styles/index.css'

export function App() {
  const { loading: loadingDb } = useInitDb()
  useInitRoutingStore()

  // TODO decompose
  const navigation = useNavigation()
  const isNavigating = Boolean(navigation.location)

  return (
    <Theme accentColor="blue" radius="large" id="root" className="safeArea">
      {loadingDb ? (
        <FullPageLoader />
      ) : (
        <>
          {isNavigating && (
            <div
              className="loader-line absolute"
              role="progressbar"
              aria-valuetext="Loading"
            />
          )}

          <Outlet />
        </>
      )}
    </Theme>
  )
}
