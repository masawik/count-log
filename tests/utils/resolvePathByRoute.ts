import type { RouteConfigEntry } from '@react-router/dev/routes'

export function resolvePathByRoute(
  route: RouteConfigEntry,
): string | undefined {
  if (route.index) {
    return '/'
  }

  if (!route.path) {
    return undefined
  }

  // wildcard 404
  if (route.path === '*') {
    return '/404'
  }

  // catch-all "*"
  if (route.path.includes('*')) {
    return '/404'
  }

  return route.path.startsWith('/') ? route.path : `/${route.path}`
}
