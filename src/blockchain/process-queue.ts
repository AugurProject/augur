import * as async from "async";
import { ErrorCallback } from "../types";

export const BLOCK_PRIORITY = 10;
export const LOG_PRIORITY = 20;

interface LogQueue {
  [blockNumber: number]: Array<LogProcessCallback>;
}

export type LogProcessCallback = (errorCallback?: ErrorCallback) => void;

export const processQueue = async.priorityQueue((processFunction: (callback: ErrorCallback) => void, nextFunction: ErrorCallback): void => {
  processFunction(nextFunction);
}, 1);

const logQueue: LogQueue = {};

export function logQueueAdd(blockNumber: number, logCallback: LogProcessCallback|Array<LogProcessCallback>) {
  if (logQueue[blockNumber] === undefined) {
    logQueue[blockNumber] = [];
  }
  if (Array.isArray(logCallback) ) {
    logQueue[blockNumber] = logQueue[blockNumber].concat(logCallback);
  } else {
    logQueue[blockNumber].push(logCallback);
  }
}

export function logQueuePop(blockNumber: number): Array<LogProcessCallback> {
  if (logQueue[blockNumber] === undefined) return [];
  const callbacks = logQueue[blockNumber];
  delete logQueue[blockNumber];
  return callbacks;
}

export function logQueueProcess(blockNumber: number, callback: ErrorCallback): void {
  const logCallbacks = logQueuePop(blockNumber);
  async.eachSeries(logCallbacks,
    (logCallback: LogProcessCallback, next: ErrorCallback) => logCallback(next),
    callback);
}
