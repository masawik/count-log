import { Outlet } from 'react-router'

export default function AppLayout() {
  return (
    <div>
      <main className="container mx-auto px-2">
        <Outlet />
      </main>
    </div>
  )
}
