import Augur from "augur.js";
import * as Knex from "knex";
import { FormattedEventLog, EventLogProcessor } from "../types";

export async function processLog(db: Knex, augur: Augur, log: FormattedEventLog, logProcessor: EventLogProcessor) {
  return (!log.removed ? logProcessor.add : logProcessor.remove)(db, augur, log);
}
