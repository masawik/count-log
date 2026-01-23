import { CreateCounterPage } from './CreateCounterPage'

import type { RouteObject } from 'react-router'

export const createCounterRoute: RouteObject = {
  path: 'create-counter',
  Component: CreateCounterPage,
}
