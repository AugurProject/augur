import Augur from "augur.js";
import * as Knex from "knex";
import * as async from "async";
import { ErrorCallback, FormattedEventLog } from "../types";
import { logProcessors } from "./log-processors";
import { processLog } from "./process-logs";
import { augurEmitter } from "../events";
import { logError } from "../utils/log-error";
import { processQueue, LOG_PRIORITY } from "../blockchain/process-queue";

export function makeLogListener(db: Knex, augur: Augur, contractName: string, eventName: string) {
  return (log: FormattedEventLog): void => {
    console.log("log queued:", contractName, eventName, log);
    processQueue.push( (callback: ErrorCallback) => {
      console.log("log processing:", contractName, eventName, log);
      const logProcessor = logProcessors[contractName][eventName];
      if (!logProcessor.noAutoEmit) augurEmitter.emit(eventName, log);
      db.transaction((trx: Knex.Transaction): void => processLog(db, augur, trx, log, logProcessors[contractName][eventName], (err: Error|null): void => {
        if (err) {
          trx.rollback(err);
        } else {
          trx.commit();
        }
      })).asCallback(callback);
  }, LOG_PRIORITY);
  };
}
