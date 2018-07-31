import Augur from "augur.js";
import * as Knex from "knex";
import { FormattedEventLog, ErrorCallback } from "../../types";
import { augurEmitter } from "../../events";

// event FeeWindowRedeemed(address indexed universe, address indexed reporter, address indexed feeWindow, uint256 amountRedeemed, uint256 reportingFeesReceived);
export function processFeeWindowRedeemedLog(db: Knex, augur: Augur, log: FormattedEventLog, callback: ErrorCallback): void {
  const redeemedToInsert = {
    reporter: log.reporter,
    feeWindow: log.feeWindow,
    blockNumber: log.blockNumber,
    transactionHash: log.transactionHash,
    logIndex: log.logIndex,
    amountRedeemed: log.amountRedeemed, // attoRep
    reportingFeesReceived: log.reportingFeesReceived, // attoEth
  };
  db.insert(redeemedToInsert).into("participation_token_redeemed").asCallback((err: Error|null): void => {
    if (err) return callback(err);
    augurEmitter.emit("FeeWindowRedeemed", log);
    callback(null);
  });
}

export function processFeeWindowRedeemedLogRemoval(db: Knex, augur: Augur, log: FormattedEventLog, callback: ErrorCallback): void {
  db.from("participation_token_redeemed").where({ transactionHash: log.transactionHash, logIndex: log.logIndex }).del().asCallback((err: Error|null): void => {
    if (err) return callback(err);
    augurEmitter.emit("FeeWindowRedeemed", log);
    callback(null);
  });
}
