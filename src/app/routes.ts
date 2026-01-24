import { type RouteObject } from 'react-router'

import { NotFoundPage } from '@/pages/404'
import { counterRoute } from '@/pages/Counter'
import { CountersListPage } from '@/pages/CountersList'
import { createCounterRoute } from '@/pages/CreateCounter'

import { App } from './App'
import { ErrorBoundary } from './ErrorBoundary'

export const routes = [
  {
    path: '/',
    ErrorBoundary,
    Component: App,
    children: [
      { index: true, Component: CountersListPage },
      createCounterRoute,
      counterRoute,

      { path: '*', Component: NotFoundPage },
    ],
  },
] as const satisfies RouteObject[]
