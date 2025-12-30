import { index, layout, route, type RouteConfig } from '@react-router/dev/routes'

const routes = [
  index('./pages/home.tsx'),

  layout('./app/layout/AppLayout.tsx', [

  ]),

  route('*', './pages/404.tsx'),
] satisfies RouteConfig

export default routes
