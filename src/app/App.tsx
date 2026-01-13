import { Spinner, Theme } from '@radix-ui/themes'
import { Outlet } from 'react-router'

import './styles/index.css'
import { useInitDb } from './db/useInitDb'

export function App() {
  const { loading } = useInitDb()

  return (
    <Theme accentColor="blue" radius="large" id="root" className="safeArea">

      {
        loading
        ? (<Spinner />)
        : (<Outlet />)
      }
    </Theme>
  )
}
