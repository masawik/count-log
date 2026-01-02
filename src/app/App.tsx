import { Outlet } from 'react-router'
import { Theme } from '@radix-ui/themes'
import './styles/index.css'

export function App() {
  return (
    <Theme accentColor="blue" radius="large">
      <Outlet />
    </Theme>
  )
}
