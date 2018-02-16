import { Augur } from "augur.js";
import * as Knex from "knex";
import { Address, FormattedEventLog, MarketsRow, ErrorCallback } from "../../types";
import { augurEmitter } from "../../events";
import { upsertPositionInMarket } from "./order-filled/upsert-position-in-market";
import { convertNumTicksToTickSize } from "../../utils/convert-fixed-point-to-decimal";


export function processCompleteSetsPurchasedOrSoldLog(db: Knex, augur: Augur, trx: Knex.Transaction, log: FormattedEventLog, callback: ErrorCallback): void {
  const marketID: Address = log.market;
  const blockNumber: number = log.blockNumber;
  const account: Address = log.account;
  trx.first("minPrice", "maxPrice", "numTicks", "category").from("markets").where({ marketID }).asCallback((err: Error|null, marketsRow?: Partial<MarketsRow>): void => {
    if (err) return callback(err);
    if (!marketsRow) return callback(new Error("market min price, max price, and/or num ticks not found"));
    const minPrice = marketsRow.minPrice!;
    const maxPrice = marketsRow.maxPrice!;
    const numTicks = marketsRow.numTicks!;
    const tickSize = convertNumTicksToTickSize(numTicks, minPrice, maxPrice);
    augur.trading.getPositionInMarket({ market: marketID, address: account, tickSize }, (err: Error|null, positions: Array<string>): void => {
      if (err) return callback(err);
      const completeSetPurchasedData = {
        marketID,
        account,
        blockNumber,
        transactionHash: log.transactionHash,
        logIndex: log.logIndex,
        tradeGroupID: log.tradeGroupId,
        numPurchased: log.numCompleteSets,
      };
      augurEmitter.emit(log.eventName, completeSetPurchasedData);
      upsertPositionInMarket(db, augur, trx, account, marketID, numTicks, positions, callback);
    });
  });
}

export function processCompleteSetsPurchasedOrSoldLogRemoval(db: Knex, augur: Augur, trx: Knex.Transaction, log: FormattedEventLog, callback: ErrorCallback): void {
    const marketID: Address = log.market;
    const account: Address = log.account;
    trx.first("minPrice", "maxPrice", "numTicks", "category").from("markets").where({ marketID }).asCallback((err: Error|null, marketsRow?: Partial<MarketsRow>): void => {
      if (err) return callback(err);
      if (!marketsRow) return callback(new Error("market min price, max price, and/or num ticks not found"));
      const minPrice = marketsRow.minPrice!;
      const maxPrice = marketsRow.maxPrice!;
      const numTicks = marketsRow.numTicks!;
      const tickSize = convertNumTicksToTickSize(numTicks, minPrice, maxPrice);
      augur.trading.getPositionInMarket({ market: marketID, address: account, tickSize }, (err: Error|null, positions: Array<string>): void => {
        if (err) return callback(err);
        augurEmitter.emit(log.eventName, log);
        upsertPositionInMarket(db, augur, trx, account, marketID, numTicks, positions, callback);
      });
    });
  }
  