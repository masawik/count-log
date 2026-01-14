import { Theme } from '@radix-ui/themes'
import { Outlet } from 'react-router'

import './styles/index.css'
import { useInitRoutingStore } from '@/shared/routing'
import { FullPageLoader } from '@/shared/ui'

import { useInitDb } from './db/useInitDb'

export function App() {
  const { loading } = useInitDb()
  useInitRoutingStore()

  return (
    <Theme accentColor="blue" radius="large" id="root" className="safeArea">

      {
        loading
        ? (<FullPageLoader />)
        : (<Outlet />)
      }
    </Theme>
  )
}
