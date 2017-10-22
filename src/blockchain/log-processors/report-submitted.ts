import Augur from "augur.js";
import * as Knex from "knex";
import { FormattedLog, ErrorCallback } from "../../types";

export function processReportSubmittedLog(db: Knex, augur: Augur, trx: Knex.Transaction, log: FormattedLog, callback: ErrorCallback): void {
    console.log("TODO: ReportSubmitted");
    console.log(log);
    callback(null);
}
