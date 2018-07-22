import { Augur } from "augur.js";
import * as Knex from "knex";
import { BigNumber } from "bignumber.js";
import { FormattedEventLog, MarketsRow, CompleteSetsRow, ErrorCallback } from "../../types";
import { numTicksToTickSize } from "../../utils/convert-fixed-point-to-decimal";
import { augurEmitter } from "../../events";
import { refreshPositionInMarket } from "./order-filled/refresh-position-in-market";

export function processCompleteSetsPurchasedOrSoldLog(db: Knex, augur: Augur, log: FormattedEventLog, callback: ErrorCallback): void {
  const blockNumber: number = log.blockNumber;
  const marketId = log.market;
  const account = log.account;
  refreshPositionInMarket(db, augur, marketId, account, (err: Error|null) => {
    if (err) return callback(err);
    db.first("minPrice", "maxPrice", "numTicks").from("markets").where({ marketId }).asCallback((err: Error|null, marketsRow?: Partial<MarketsRow<BigNumber>>): void => {
      if (err) return callback(err);
      if (!marketsRow) return callback(new Error("market min price, max price, category, and/or num ticks not found"));
      const minPrice = marketsRow.minPrice!;
      const maxPrice = marketsRow.maxPrice!;
      const numTicks = marketsRow.numTicks!;
      const tickSize = numTicksToTickSize(numTicks, minPrice, maxPrice);
      const numCompleteSets = augur.utils.convertOnChainAmountToDisplayAmount(new BigNumber(log.numCompleteSets, 10), tickSize).toFixed();
      const completeSetPurchasedData: CompleteSetsRow<string> = {
        marketId,
        account,
        blockNumber,
        universe: log.universe,
        eventName: log.eventName,
        transactionHash: log.transactionHash,
        logIndex: log.logIndex,
        tradeGroupId: log.tradeGroupId,
        numCompleteSets,
        numPurchasedOrSold: numCompleteSets,
      };
      augurEmitter.emit(log.eventName, completeSetPurchasedData);
      db.insert(completeSetPurchasedData).into("completeSets").asCallback(callback);
    });
  });
}

export function processCompleteSetsPurchasedOrSoldLogRemoval(db: Knex, augur: Augur, log: FormattedEventLog, callback: ErrorCallback): void {
  refreshPositionInMarket(db, augur, log.market, log.account, (err: Error|null) => {
    if (err) return callback(err);
    augurEmitter.emit(log.eventName, log);
    db.from("completeSets").where({ transactionHash: log.transactionHash, logIndex: log.logIndex }).del().asCallback(callback);
  });
}
