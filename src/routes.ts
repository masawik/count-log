import { index, route, type RouteConfig } from '@react-router/dev/routes'

import { counterRoute } from './pages/Counter'

const routes = [
  index('./pages/CountersList/ui/CountersList.tsx'),
  route('edit-counter', './pages/CounterEditor/ui/CounterEditorPage.tsx'),
  counterRoute,

  route('*', './pages/404.tsx'),
] satisfies RouteConfig

console.log({ routes })

export default routes
