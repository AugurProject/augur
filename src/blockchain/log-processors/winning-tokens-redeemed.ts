import Augur from "augur.js";
import * as Knex from "knex";
import { FormattedLog, ErrorCallback } from "../../types";

export function processWinningTokensRedeemedLog(db: Knex, augur: Augur, trx: Knex.Transaction, log: FormattedLog, callback: ErrorCallback): void {
    console.log("TODO: WinningTokensRedeemed");
    console.log(log);
    callback(null);
}
