import type { NavigateFunction, NavigateOptions, To } from 'react-router'

export interface AppRouterStore {
  navigate: NavigateFunction,
}

export interface NavigateAttrs {
  to: To,
  options?: NavigateOptions,
}
