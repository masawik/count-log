export type Override<T, R> = Omit<T, keyof R> & R

type DeepPartial<T> =
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  T extends Function
    ? T
    : T extends Array<infer U>
      ? Array<DeepPartial<U>>
      : T extends object
        ? { [K in keyof T]?: DeepPartial<T[K]> }
        : T
