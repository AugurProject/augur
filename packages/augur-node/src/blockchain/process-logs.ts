import { Augur, EventLogProcessor, FormattedEventLog } from "../types";
import Knex from "knex";
import { logProcessors } from "./log-processors";
import { augurEmitter } from "../events";
import { SubscriptionEventNames } from "../constants";
import { Log } from "@augurproject/api";
import _ from "lodash";

export async function processLog(augur: Augur, log: FormattedEventLog, logProcessor: EventLogProcessor): Promise<(db: Knex) => Promise<void>> {
  return (!log.removed ? logProcessor.add : logProcessor.remove)(augur, log);
}

export function processLogByName(augur: Augur, log: Log, emitEvent: boolean): null|Promise<(db: Knex) => Promise<void>> {
  const contractProcessors = logProcessors["Augur"];
  const logProcessorName = Object.keys(contractProcessors).find((eventName) => {
    const intersection = _.intersection(log.topics, augur.events.getEventTopics(eventName));
    return !_.isEmpty(intersection);
  });
  if (logProcessorName && contractProcessors && contractProcessors[logProcessorName]) {
    const parsedLog = augur.events.parseLogs([log])[0];
    const logProcessor = contractProcessors[logProcessorName];
    if (emitEvent) {
      if (!logProcessor.noAutoEmit) {
        const subscriptionEventName = logProcessorName as keyof typeof SubscriptionEventNames;
        augurEmitter.emit(SubscriptionEventNames[subscriptionEventName], parsedLog);
      }
    }
    return processLog(augur, log, contractProcessors[log.eventName]);
  }
  return null;
}
