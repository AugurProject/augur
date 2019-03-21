import { Augur, CompleteSetsRow, FormattedEventLog, MarketsRow } from "../../types";
import * as Knex from "knex";
import { BigNumber } from "bignumber.js";
import { numTicksToTickSize } from "../../utils/convert-fixed-point-to-decimal";
import { augurEmitter } from "../../events";
import { SubscriptionEventNames } from "../../constants";
import { updateMarketOpenInterest } from "./order-filled/update-volumetrics";
import { updateProfitLossBuyShares, updateProfitLossSellShares } from "./profit-loss/update-profit-loss";

export async function processCompleteSetsPurchasedOrSoldLog(augur: Augur, log: FormattedEventLog) {
  return async (db: Knex) => {
    const marketId = log.market;
    const marketsRow: MarketsRow<BigNumber>|undefined = await db.first("minPrice", "maxPrice", "numTicks", "numOutcomes").from("markets").where({ marketId });
    if (!marketsRow) throw new Error(`market not found: ${marketId}`);
    const minPrice = marketsRow.minPrice;
    const maxPrice = marketsRow.maxPrice;
    const numTicks = marketsRow.numTicks;
    const numOutcomes = marketsRow.numOutcomes;
    const tickSize = numTicksToTickSize(numTicks, minPrice, maxPrice);
    const numCompleteSets = augur.utils.convertOnChainAmountToDisplayAmount(new BigNumber(log.numCompleteSets, 10), tickSize);
    const completeSetPurchasedData: CompleteSetsRow<string> = {
      marketId,
      account: log.account,
      blockNumber: log.blockNumber,
      universe: log.universe,
      eventName: log.eventName,
      transactionHash: log.transactionHash,
      logIndex: log.logIndex,
      tradeGroupId: log.tradeGroupId,
      numCompleteSets,
      numPurchasedOrSold: numCompleteSets,
    };
    const eventName = log.eventName as keyof typeof SubscriptionEventNames;
    await db.insert(completeSetPurchasedData).into("completeSets");
    augurEmitter.emit(SubscriptionEventNames[eventName], completeSetPurchasedData);
    await updateMarketOpenInterest(db, marketId);

    // Don't process FillOrder buying and selling complete sets for profit loss
    if (log.account === augur.contracts.addresses[augur.rpc.getNetworkID()].FillOrder) return;
    if (log.eventName === "CompleteSetsPurchased") {
      await updateProfitLossBuyShares(db, marketId, log.account, numCompleteSets, Array.from(Array(numOutcomes).keys()), log.transactionHash);
    } else {
      await updateProfitLossSellShares(db, marketId, numCompleteSets, log.account, Array.from(Array(numOutcomes).keys()), numCompleteSets, log.transactionHash);
    }
  };
}

export async function processCompleteSetsPurchasedOrSoldLogRemoval(augur: Augur, log: FormattedEventLog) {
  return async (db: Knex) => {
    await db.from("completeSets").where({ transactionHash: log.transactionHash, logIndex: log.logIndex }).del();
    const eventName = log.eventName as keyof typeof SubscriptionEventNames;
    augurEmitter.emit(SubscriptionEventNames[eventName], log);
    await updateMarketOpenInterest(db, log.market);
  };
}
