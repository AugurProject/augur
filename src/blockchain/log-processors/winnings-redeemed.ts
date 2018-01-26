import Augur from "augur.js";
import * as Knex from "knex";
import { FormattedEventLog, ErrorCallback } from "../../types";
import { augurEmitter } from "../../events";

// event WinningsRedeemed(address indexed universe, address indexed reporter, address indexed market, address reportingParticipant, uint256 amountRedeemed, uint256 reportingFeesReceived, uint256[] payoutNumerators);
export function processWinningsRedeemedLog(db: Knex, augur: Augur, trx: Knex.Transaction, log: FormattedEventLog, callback: ErrorCallback): void {
  console.log("TODO: WinningsRedeemed");
  console.log(log);
  callback(null);
}

export function processWinningsRedeemedLogRemoval(db: Knex, augur: Augur, trx: Knex.Transaction, log: FormattedEventLog, callback: ErrorCallback): void {
  console.log("TODO: WinningsRedeemed removal");
  console.log(log);
  augurEmitter.emit("WinningsRedeemed", log);
  callback(null);
}
