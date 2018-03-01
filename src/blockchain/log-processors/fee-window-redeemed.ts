import Augur from "augur.js";
import * as Knex from "knex";
import { FormattedEventLog, ErrorCallback } from "../../types";
import { augurEmitter } from "../../events";

// event FeeWindowRedeemed(address indexed universe, address indexed reporter, address indexed feeWindow, uint256 amountRedeemed, uint256 reportingFeesReceived);
export function processFeeWindowRedeemedLog(db: Knex, augur: Augur, log: FormattedEventLog, callback: ErrorCallback): void {
  console.log("TODO: feeWindowRedeemedLog");
  console.log(log);
  callback(null);
}

export function processFeeWindowRedeemedLogRemoval(db: Knex, augur: Augur, log: FormattedEventLog, callback: ErrorCallback): void {
  console.log("TODO: feeWindowRedeemedLog removal");
  console.log(log);
  augurEmitter.emit("FeeWindowRedeemed", log);
  callback(null);
}
