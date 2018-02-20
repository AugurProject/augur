import Augur from "augur.js";
import * as Knex from "knex";
import { ErrorCallback, FormattedEventLog } from "../types";
import { logProcessors } from "./log-processors";
import { processLog } from "./process-logs";
import { augurEmitter } from "../events";
import { logQueueAdd } from "./process-queue";

export function makeLogListener(trx: Knex, augur: Augur, contractName: string, eventName: string) {
  return (log: FormattedEventLog): void => {
    console.log("log queued for block:", log.blockNumber);
    logQueueAdd(log.blockNumber, (callback: ErrorCallback) => {
      console.log("EXECUTING log:", log.blockNumber);
      const logProcessor = logProcessors[contractName][eventName];
      if (!logProcessor.noAutoEmit) augurEmitter.emit(eventName, log);
      processLog(trx, augur, log, logProcessors[contractName][eventName], callback);
    });
  };
}
