import { Augur, BigNumber, FormattedEventLog } from "../../types";
import Knex from "knex";
import { formatBigNumberAsFixed } from "../../utils/format-big-number-as-fixed";

import { augurEmitter } from "../../events";
import { SubscriptionEventNames } from "../../constants";
import { updateProfitLossSellShares } from "./profit-loss/update-profit-loss";
import { numTicksToTickSize } from "../../utils/convert-fixed-point-to-decimal";

interface ShareTokenOutcome {
  outcome: number;
}

interface MarketData {
  numTicks: BigNumber;
  maxPrice: BigNumber;
  minPrice: BigNumber;
}

export async function processTradingProceedsClaimedLog(augur: Augur, log: FormattedEventLog) {
  return async (db: Knex) => {
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
    const shareTokenOutcome: ShareTokenOutcome = await db("tokens").first("outcome").where({ contractAddress: log.shareToken});
    const marketData: MarketData = await db.first(["numTicks", "minPrice", "maxPrice"]).from("markets").where({ marketId: log.market });

    const minPrice = marketData.minPrice;
    const maxPrice = marketData.maxPrice;
    const numTicks = marketData.numTicks;
    const tickSize = numTicksToTickSize(numTicks, minPrice, maxPrice);
    const numShares = new BigNumber(log.numShares).div(tickSize).div(10 ** 18);
    const payoutTokens = new BigNumber(log.numPayoutTokens).div(10 ** 18);

    await updateProfitLossSellShares(db, log.market, numShares, log.sender, [shareTokenOutcome.outcome], payoutTokens, log.transactionHash);
    augurEmitter.emit(SubscriptionEventNames.TradingProceedsClaimed, log);
  };
}

export async function processTradingProceedsClaimedLogRemoval(augur: Augur, log: FormattedEventLog) {
  return async (db: Knex) => {
    await db.from("trading_proceeds").where({ transactionHash: log.transactionHash, logIndex: log.logIndex }).del();
    await db.from("profit_loss_timeseries").where({ transactionHash: log.transactionHash }).del();
    augurEmitter.emit(SubscriptionEventNames.TradingProceedsClaimed, log);
  };
}
