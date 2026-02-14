import { CounterHistoryPage } from './CounterHistoryPage'
import { CounterPage } from './CounterPage'
import CounterRouteLayout from './CounterRouteLayout'

import type { RouteObject } from 'react-router'

export const counterRoute: RouteObject = {
  Component: CounterRouteLayout,
  children: [
    { path: 'counter/:counterId', Component: CounterPage },
    { path: 'counter/:counterId/history', Component: CounterHistoryPage },
  ],
}
