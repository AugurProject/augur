import Augur from "augur.js";
import * as Knex from "knex";
import { FormattedEventLog, ErrorCallback } from "../../../types";

export function processFundedAccountLog(db: Knex, augur: Augur, log: FormattedEventLog, callback: ErrorCallback): void {
  callback(null);
}
