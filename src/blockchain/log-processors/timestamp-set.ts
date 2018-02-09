import Augur from "augur.js";
import * as Knex from "knex";
import { FormattedEventLog, ErrorCallback } from "../../types";
import { removeOverrideTimestamp, setOverrideTimestamp } from "../process-block";

export function processTimestampSetLog(db: Knex, augur: Augur, trx: Knex.Transaction, log: FormattedEventLog, callback: ErrorCallback): void {
  setOverrideTimestamp(trx, log.newTimestamp, callback);
}

export function processTimestampSetLogRemoval(db: Knex, augur: Augur, trx: Knex.Transaction, log: FormattedEventLog, callback: ErrorCallback): void {
  removeOverrideTimestamp(trx, log.newTimestamp, callback);
}
