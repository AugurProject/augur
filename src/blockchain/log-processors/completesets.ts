import { Augur } from "augur.js";
import * as Knex from "knex";
import { BigNumber } from "bignumber.js";
import { FormattedEventLog, MarketsRow, CompleteSetsRow } from "../../types";
import { numTicksToTickSize } from "../../utils/convert-fixed-point-to-decimal";
import { augurEmitter } from "../../events";
import { SubscriptionEventNames } from "../../constants";
import { updateOpenInterest } from "./order-filled/update-volumetrics";
import { updateProfitLossBuyShares, updateProfitLossSellShares } from "./profit-loss/update-profit-loss";

export async function processCompleteSetsPurchasedOrSoldLog(db: Knex, augur: Augur, log: FormattedEventLog) {
  const marketId = log.market;
  const marketsRow: MarketsRow<BigNumber>|undefined = await db.first("minPrice", "maxPrice", "numTicks").from("markets").where({ marketId });

  if (!marketsRow) throw new Error("market min price, max price, category, and/or num ticks not found");
  const minPrice = marketsRow.minPrice!;
  const maxPrice = marketsRow.maxPrice!;
  const numTicks = marketsRow.numTicks!;
  const numOutcomes = marketsRow.numOutcomes!;
  const tickSize = numTicksToTickSize(numTicks, minPrice, maxPrice);
  const numCompleteSets = augur.utils.convertOnChainAmountToDisplayAmount(new BigNumber(log.numCompleteSets, 10), tickSize).toString();
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
  await updateOpenInterest(db, marketId);
  // Don't process FillOrder buying and selling complete sets for profit loss
  if (log.account === augur.contracts.addresses[augur.rpc.getNetworkID()].FillOrder) return;
  if (log.eventName === "CompleteSetsPurchased") {
    await updateProfitLossBuyShares(db, marketId, log.account, numCompleteSets, Array.from(Array(numOutcomes).keys()), log.transactionHash);
  } else {
    await updateProfitLossSellShares(db, marketId, numCompleteSets, log.account, Array.from(Array(numOutcomes).keys()), numCompleteSets, log.transactionHash);
  }
}

export async function processCompleteSetsPurchasedOrSoldLogRemoval(db: Knex, augur: Augur, log: FormattedEventLog) {
  await db.from("completeSets").where({ transactionHash: log.transactionHash, logIndex: log.logIndex }).del();
  const eventName = log.eventName as keyof typeof SubscriptionEventNames;
  augurEmitter.emit(SubscriptionEventNames[eventName], log);
  await updateOpenInterest(db, log.market);
}
