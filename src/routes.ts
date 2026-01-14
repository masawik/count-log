import { index, route, type RouteConfig } from '@react-router/dev/routes'

const routes = [
  index('./pages/CountersList/ui/CountersList.tsx'),
  route('edit-counter', './pages/CounterEditor/ui/CounterEditorPage.tsx'),
  route('counter/:counterId', './pages/Counter/CounterPage.tsx'),

  route('*', './pages/404.tsx'),
] satisfies RouteConfig

export default routes
