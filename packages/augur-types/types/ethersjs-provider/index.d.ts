// This definition is required by EthersProvider because it is incorrectly defined in @types/async
export function retryable<T, E = Error>(opts: number | {times: number, interval: number}, task: AsyncWorker<T, E>): AsyncWorker<T, E>;
