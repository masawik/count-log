import { Theme } from '@radix-ui/themes'
import { Outlet } from 'react-router'

import { useInitRoutingStore } from '@/shared/routing'
import { FullPageLoader } from '@/shared/ui'

import { useInitDb } from './db/useInitDb'
import { NavigationLoader } from './layout/NavigationLoader'
import './styles/index.css'

export function App() {
  const { loading: loadingDb } = useInitDb()
  useInitRoutingStore()

  return (
    <Theme accentColor="blue" radius="large" id="root" className="safeArea">
      {loadingDb ? (
        <FullPageLoader />
      ) : (
        <>
          <NavigationLoader />
          <Outlet />
        </>
      )}
    </Theme>
  )
}
