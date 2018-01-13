import * as async from "async";
import { ErrorCallback } from "../types";

export const BLOCK_PRIORITY = 10;
export const LOG_PRIORITY = 20;

export const processQueue = async.priorityQueue( (processFunction: (callback: ErrorCallback) => void, nextFunction: ErrorCallback ): void => {
    processFunction(nextFunction);
  }, 1);
