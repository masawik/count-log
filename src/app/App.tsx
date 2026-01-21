import { Theme } from '@radix-ui/themes'
import { useGate, useUnit } from 'effector-react'
import { Outlet } from 'react-router'

import { useInitErrorStore } from '@/shared/errors'
import { AndroidBackButtonProvider } from '@/shared/nativePlatform'
import { useInitRoutingStore } from '@/shared/routing'
import { FullPageLoader } from '@/shared/ui'

import { $loading, AppGate } from './db/model'
import { NavigationLoader } from './layout/NavigationLoader'
import {useInitI18n} from '@/shared/i18n'
import './styles/index.css'

export function App() {
  useGate(AppGate)
  useInitRoutingStore()
  useInitErrorStore()

  const loadingDb = useUnit($loading)
  const loadingI18n = useInitI18n()

  const appNotReady = loadingDb || loadingI18n

  return (
    <AndroidBackButtonProvider>
      <Theme
        appearance="light"
        accentColor="blue"
        radius="large"
        id="root"
        className="safeArea"
      >
        {appNotReady ? (
          <FullPageLoader />
        ) : (
          <>
            <NavigationLoader className="absolute" />
            <Outlet />
          </>
        )}
      </Theme>
    </AndroidBackButtonProvider>
  )
}
