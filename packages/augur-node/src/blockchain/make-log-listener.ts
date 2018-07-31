import Augur from "augur.js";
import * as Knex from "knex";
import { ErrorCallback, FormattedEventLog } from "../types";
import { logProcessors } from "./log-processors";
import { processLog } from "./process-logs";
import { augurEmitter } from "../events";
import { logQueueAdd } from "./process-queue";

export function makeLogListener(augur: Augur, contractName: string, eventName: string) {
  return (log: FormattedEventLog): void => {
    logQueueAdd(log.blockHash, (db: Knex, callback: ErrorCallback) => {
      const logProcessor = logProcessors[contractName][eventName];
      if (!logProcessor.noAutoEmit) augurEmitter.emit(eventName, log);
      processLog(db, augur, log, logProcessors[contractName][eventName], callback);
    });
  };
}
