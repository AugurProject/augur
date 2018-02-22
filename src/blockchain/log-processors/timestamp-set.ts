import Augur from "augur.js";
import * as Knex from "knex";
import { FormattedEventLog, ErrorCallback } from "../../types";
import { removeOverrideTimestamp, setOverrideTimestamp } from "../process-block";

export function processTimestampSetLog(db: Knex, augur: Augur, log: FormattedEventLog, callback: ErrorCallback): void {
  setOverrideTimestamp(db, log.newTimestamp, callback);
}

export function processTimestampSetLogRemoval(db: Knex, augur: Augur, log: FormattedEventLog, callback: ErrorCallback): void {
  removeOverrideTimestamp(db, log.newTimestamp, callback);
}
