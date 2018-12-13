import Augur from "augur.js";
import * as Knex from "knex";
import { EventLogProcessor, FormattedEventLog } from "../types";
import { logProcessors } from "./log-processors";
import { augurEmitter } from "../events";
import { SubscriptionEventNames } from "../constants";

export async function processLog(augur: Augur, log: FormattedEventLog, logProcessor: EventLogProcessor): Promise<(db: Knex) => Promise<void>> {
  return (!log.removed ? logProcessor.add : logProcessor.remove)(augur, log);
}

export function processLogByName(augur: Augur, log: FormattedEventLog, emitEvent: boolean): null|Promise<(db: Knex) => Promise<void>> {
  const contractProcessors = logProcessors[log.contractName];
  if (contractProcessors && contractProcessors[log.eventName]) {
    const logProcessor = contractProcessors[log.eventName];
    if (emitEvent) {
      if (!logProcessor.noAutoEmit) {
        const subscriptionEventName = log.eventName as keyof typeof SubscriptionEventNames;
        augurEmitter.emit(SubscriptionEventNames[subscriptionEventName], log);
      }
    }
    return processLog(augur, log, contractProcessors[log.eventName]);
  }
  return null;
}
