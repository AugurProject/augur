// This modifies `retryable` from the original definition because it was defined incorrectly.

declare module 'async' {
  export as namespace async;

  export function retryable<T, E = Error>(opts: number | {times: number, interval: number}, task: AsyncWorker<T, E>): AsyncWorker<T, E>;
}
