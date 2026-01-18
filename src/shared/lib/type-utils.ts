export type Override<T, R> = Omit<T, keyof R> & R

export type Falsy =
  | false
  | 0
  | 0n
  | ''
  | null
  | undefined
