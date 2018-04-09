import Augur from "augur.js";
import * as Knex from "knex";
import { FormattedEventLog, EventLogProcessor, ErrorCallback } from "../types";

export function processLog(db: Knex, augur: Augur, log: FormattedEventLog, logProcessor: EventLogProcessor, callback: ErrorCallback): void {
  (!log.removed ? logProcessor.add : logProcessor.remove)(db, augur, log, callback);
}
