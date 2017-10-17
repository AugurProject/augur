import Augur = require("augur.js");
import * as Knex from "knex";
import { FormattedLog, ErrorCallback } from "../../types";

export function processDesignatedReportSubmittedLog(db: Knex, augur: Augur, trx: Knex.Transaction, log: FormattedLog, callback: ErrorCallback): void {
    console.log("TODO: DesignatedReportSubmitted");
    console.log(log);
    callback(null);
}
