import Augur from "augur.js";
import * as Knex from "knex";
import { FormattedEventLog, EventLogProcessor } from "../types";
import { logProcessors } from "./log-processors";

export async function processLog(augur: Augur, log: FormattedEventLog, logProcessor: EventLogProcessor): Promise<(db: Knex) => Promise<void>> {
  return (!log.removed ? logProcessor.add : logProcessor.remove)(augur, log);
}

export function processLogByName(augur: Augur, log: FormattedEventLog): null|Promise<(db: Knex) => Promise<void>> {
  const contractProcessors = logProcessors[log.contractName];
  if (contractProcessors && contractProcessors[log.eventName]) {
    return processLog(augur, log, contractProcessors[log.eventName]);
  }
  return null;
}
