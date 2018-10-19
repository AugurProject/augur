import Augur from "augur.js";
import * as Knex from "knex";
import { formatBigNumberAsFixed } from "../../utils/format-big-number-as-fixed";
import { FormattedEventLog } from "../../types";
import { augurEmitter } from "../../events";
import { SubscriptionEventNames } from "../../constants";

export async function processTradingProceedsClaimedLog(db: Knex, augur: Augur, log: FormattedEventLog) {
  const tradingProceedsToInsert = formatBigNumberAsFixed({
    marketId: log.market,
    shareToken: log.shareToken,
    account: log.sender,
    numShares: log.numShares,
    numPayoutTokens: log.numPayoutTokens,
    blockNumber: log.blockNumber,
    transactionHash: log.transactionHash,
    logIndex: log.logIndex,
  });
  await db("trading_proceeds").insert(tradingProceedsToInsert);
  augurEmitter.emit(SubscriptionEventNames.TradingProceedsClaimed, log);
}

export async function processTradingProceedsClaimedLogRemoval(db: Knex, augur: Augur, log: FormattedEventLog) {
  await db.from("trading_proceeds").where({ transactionHash: log.transactionHash, logIndex: log.logIndex }).del();
  augurEmitter.emit(SubscriptionEventNames.TradingProceedsClaimed, log);
}
