import Augur from "augur.js";
import * as Knex from "knex";
import { FormattedEventLog, ErrorCallback } from "../../types";
import { augurEmitter } from "../../events";

export function processWinningTokensRedeemedLog(db: Knex, augur: Augur, trx: Knex.Transaction, log: FormattedEventLog, callback: ErrorCallback): void {
  console.log("TODO: WinningTokensRedeemed");
  console.log(log);
  callback(null);
}

export function processWinningTokensRedeemedLogRemoval(db: Knex, augur: Augur, trx: Knex.Transaction, log: FormattedEventLog, callback: ErrorCallback): void {
  console.log("TODO: WinningTokensRedeemed removal");
  console.log(log);
  augurEmitter.emit("WinningTokenRedeemed", log);
  callback(null);
}
