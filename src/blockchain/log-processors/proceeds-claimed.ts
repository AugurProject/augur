import Augur = require("augur.js");
import * as Knex from "knex";
import { FormattedLog, ErrorCallback } from "../../types";

export function processProceedsClaimedLog(db: Knex, augur: Augur, trx: Knex.Transaction, log: FormattedLog, callback: ErrorCallback): void {

}
