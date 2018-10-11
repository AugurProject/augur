import Augur from "augur.js";
import * as Knex from "knex";
import { formatBigNumberAsFixed } from "../../utils/format-big-number-as-fixed";
import { FormattedEventLog, ErrorCallback } from "../../types";
import { BigNumber } from "bignumber.js";
import { augurEmitter } from "../../events";
import { SubscriptionEventNames } from "../../constants";
import { updateProfitLossSellShares } from "./profit-loss/update-profit-loss";
import { numTicksToTickSize } from "../../utils/convert-fixed-point-to-decimal";


interface ShareTokenOutcome {
  outcome: number,
}

interface MarketData {
  numTicks: BigNumber;
  maxPrice: BigNumber;
  minPrice: BigNumber;
}

export function processTradingProceedsClaimedLog(db: Knex, augur: Augur, log: FormattedEventLog, callback: ErrorCallback): void {
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
  db("trading_proceeds").insert(tradingProceedsToInsert).asCallback((err?: Error|null) => {
    if (err) return callback(err);
    db("tokens").first("outcome").where({ contractAddress: log.shareToken}).asCallback((err: Error, shareTokenOutcome: ShareTokenOutcome) => {
      if (err) return callback(err);
      db.first(["numTicks", "minPrice", "maxPrice"]).from("markets").where({ marketId: log.market }).asCallback((err: Error, marketData: MarketData) => {
        if (err) return callback(err);
        const minPrice = marketData.minPrice;
        const maxPrice = marketData.maxPrice;
        const numTicks = marketData.numTicks;
        const tickSize = numTicksToTickSize(numTicks, minPrice, maxPrice);
        const numShares = new BigNumber(log.numShares, 10).dividedBy(tickSize).dividedBy(10**18);
        const payoutTokens = new BigNumber(log.numPayoutTokens).dividedBy(10**18);
        updateProfitLossSellShares(db, log.market, numShares, log.sender, [shareTokenOutcome.outcome], payoutTokens, log.transactionHash, (err?: Error|null) => {
          if (err) return callback(err);
          augurEmitter.emit(SubscriptionEventNames.TradingProceedsClaimed, log);
          return callback(null);
        });
      });
    });
  });
}

export function processTradingProceedsClaimedLogRemoval(db: Knex, augur: Augur, log: FormattedEventLog, callback: ErrorCallback): void {
  db.from("trading_proceeds").where({ transactionHash: log.transactionHash, logIndex: log.logIndex }).del().asCallback((err?: Error|null) => {
    if (err) return callback(err);
    augurEmitter.emit(SubscriptionEventNames.TradingProceedsClaimed, log);
    callback(null);
  });
}
