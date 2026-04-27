export type AwaitedReturn<T> =
  T extends (...args: infer Args) => infer R ? (Args extends unknown[] ? Awaited<R> : never) : never;
export type MutationData<T> = AwaitedReturn<T> extends { data: infer TData } ? TData : never;
export type FirstArg<T> =
  T extends (arg0: infer A, ...args: infer Rest) => unknown ? (Rest extends unknown[] ? A : never) : never;
export type SecondArg<T> =
  T extends (arg0: infer A0, arg1: infer A, ...args: infer Rest) => unknown
    ? (A0 extends unknown ? (Rest extends unknown[] ? A : never) : never)
    : never;
