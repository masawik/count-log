import { Capacitor } from '@capacitor/core'

export const IS_DEV = import.meta.env.DEV
export const IS_TEST = import.meta.env.MODE === 'test' || import.meta.env.VITE_E2E === '1'

export const PLATFORM = Capacitor.getPlatform()
export const IS_NATIVE = Capacitor.isNativePlatform()
export const IS_WEB = Capacitor.getPlatform() === 'web'

export const SHOULD_LOG_KYSELY_OPERATIONS = IS_DEV && isNaN(+import.meta.env.VITE_LOG_KYSELY_OPERATIONS)
  ? false
  : Boolean(+import.meta.env.VITE_LOG_KYSELY_OPERATIONS)
