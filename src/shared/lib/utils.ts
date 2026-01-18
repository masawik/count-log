import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

import type { Falsy } from './type-utils'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const isFalsyExceptZero = (
  value: unknown,
): value is Exclude<Falsy, 0> => {
  if (value === 0) return false
  return !value
}
