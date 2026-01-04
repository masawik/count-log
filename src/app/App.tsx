import { Theme } from '@radix-ui/themes'
import { Outlet } from 'react-router'
import './styles/index.css'

export function App() {
  return (
    <Theme accentColor="blue" radius="large">
      <Outlet />
    </Theme>
  )
}
