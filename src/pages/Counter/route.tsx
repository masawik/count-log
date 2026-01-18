import { fileURLToPath } from 'url'

import { layout, route } from '@react-router/dev/routes'

const here = (rel: string) => fileURLToPath(new URL(rel, import.meta.url))

export const counterRoute = layout(here('./CounterRouteLayout.tsx'), [
  route('counter/:counterId', here('./CounterPage/CounterPage.tsx')),
  route('counter/:counterId/history', here('./CounterHistoryPage/CounterHistoryPage.tsx')),
])
