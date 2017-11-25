import Augur from "augur.js";
import * as Knex from "knex";
import { FormattedLog } from "../types";
import { logProcessors } from "./log-processors";
import { processLog } from "./process-logs";
import { augurEmitter } from "../events";
import { logError } from "../utils/log-error";

export function makeLogListener(db: Knex, augur: Augur, contractName: string, eventName: string) {
  return (log: FormattedLog): void => {
    console.log("log:", contractName, eventName, log);
    const logProcessor = logProcessors[contractName][eventName];
    if (!logProcessor.noAutoEmit) augurEmitter.emit(eventName, log);
    db.transaction((trx: Knex.Transaction): void => processLog(db, augur, trx, log, logProcessors[contractName][eventName], (err: Error|null): void => {
      if (err) {
        trx.rollback(err);
      } else {
        trx.commit();
      }
    })).asCallback(logError);
  };
}
