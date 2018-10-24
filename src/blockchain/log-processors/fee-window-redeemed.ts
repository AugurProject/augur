import Augur from "augur.js";
import * as Knex from "knex";
import { FormattedEventLog} from "../../types";
import { augurEmitter } from "../../events";
import { SubscriptionEventNames } from "../../constants";

// event FeeWindowRedeemed(address indexed universe, address indexed reporter, address indexed feeWindow, uint256 amountRedeemed, uint256 reportingFeesReceived);
export async function processFeeWindowRedeemedLog(db: Knex, augur: Augur, log: FormattedEventLog) {
  const redeemedToInsert = {
    reporter: log.reporter,
    feeWindow: log.feeWindow,
    blockNumber: log.blockNumber,
    transactionHash: log.transactionHash,
    logIndex: log.logIndex,
    amountRedeemed: log.amountRedeemed, // attoRep
    reportingFeesReceived: log.reportingFeesReceived, // attoEth
  };
  await db.insert(redeemedToInsert).into("participation_token_redeemed");
  augurEmitter.emit(SubscriptionEventNames.FeeWindowRedeemed, log);
}

export async function processFeeWindowRedeemedLogRemoval(db: Knex, augur: Augur, log: FormattedEventLog) {
  await db.from("participation_token_redeemed").where({ transactionHash: log.transactionHash, logIndex: log.logIndex }).del();
  augurEmitter.emit(SubscriptionEventNames.FeeWindowRedeemed, log);
}
