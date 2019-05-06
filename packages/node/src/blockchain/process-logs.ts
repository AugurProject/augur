import { Augur, EventLogProcessor, FormattedEventLog, ParsedLogWithEventName } from "../types";
import Knex from "knex";
import { logProcessors } from "./log-processors";
import { augurEmitter } from "../events";
import { SubscriptionEventNames } from "../constants";
import _ from "lodash";
import { ParsedLog } from "@augurproject/api";

export function processLog(augur: Augur, log: FormattedEventLog, logProcessor: EventLogProcessor): Promise<(db: Knex) => Promise<void>> {
  if (log["extraInfo"] != null && typeof log["extraInfo"] === "string") log["extraInfo"] = JSON.parse(log["extraInfo"])
  return (!log.removed ? logProcessor.add : logProcessor.remove)(augur, log);
}

export async function processLogByName(augur: Augur, log: ParsedLogWithEventName, emitEvent: boolean): Promise<(db: Knex) => Promise<void>> {
  const contractProcessors = logProcessors["Augur"];

  if(!log.topics) {
    return (db: Knex) => Promise.resolve();
  }

  const logProcessorName = log.eventName;
  if (logProcessorName && contractProcessors && contractProcessors[logProcessorName]) {
    const logProcessor = contractProcessors[logProcessorName];
    if (emitEvent) {
      if (!logProcessor.noAutoEmit) {
        const subscriptionEventName = logProcessorName as keyof typeof SubscriptionEventNames;
        augurEmitter.emit(SubscriptionEventNames[subscriptionEventName], log);
      }
    }
    return processLog(augur, log, contractProcessors[logProcessorName]);
  } else {
    console.log('Cannot find processor for: ', JSON.stringify(log));
  }
  return (db: Knex) => Promise.resolve();
}
