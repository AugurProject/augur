import Augur from "augur.js";
import * as Knex from "knex";
import { FormattedEventLog, EventLogProcessor } from "../types";

export async function processLog(augur: Augur, log: FormattedEventLog, logProcessor: EventLogProcessor): Promise<(db: Knex) => Promise<void>> {
  return (!log.removed ? logProcessor.add : logProcessor.remove)(augur, log);
}
