import { index, route, type RouteConfig } from '@react-router/dev/routes'

import { counterRoute } from './pages/Counter'

const routes = [
  index('./pages/CountersList/ui/CountersList.tsx'),
  route(
    'create-counter',
    './pages/CreateCounter/CreateCounterPage.tsx',
  ),
  counterRoute,

  route('*', './pages/404.tsx'),
] satisfies RouteConfig

export default routes
