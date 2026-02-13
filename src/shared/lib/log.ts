import { IS_DEV } from '../config'


export const log = (...args: Parameters<typeof console.log>) => {
  if (!IS_DEV) return

  // eslint-disable-next-line no-console
  console.log(...args)
}
