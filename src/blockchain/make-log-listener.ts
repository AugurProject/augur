import Augur from "augur.js";
import * as Knex from "knex";
import { ErrorCallback, FormattedEventLog } from "../types";
import { logProcessors } from "./log-processors";
import { processLog } from "./process-logs";
import { augurEmitter } from "../events";
import { logQueueAdd } from "./process-queue";
import { SubscriptionEventNames } from "../constants";

export function makeLogListener(augur: Augur, contractName: string, eventName: string, callback: ErrorCallback) {
  return async (log: FormattedEventLog) => {
    const dbWritePromise = processLog(augur, log, logProcessors[contractName][eventName]) // .catch(callback);
    logQueueAdd(log.blockHash, async (db: Knex) => {
      const logProcessor = logProcessors[contractName][eventName];
      if (!logProcessor.noAutoEmit) {
        const subscriptionEventName = eventName as keyof typeof SubscriptionEventNames;
        augurEmitter.emit(SubscriptionEventNames[subscriptionEventName], log);
      }
      if (dbWritePromise == null) return callback(new Error("Problem"));
      await (await dbWritePromise)(db);
    });
  };
}
