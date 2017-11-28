import { Augur } from "augur.js";
import * as Knex from "knex";
import { Address, FormattedLog, TokensRow, MarketsRow, OrdersRow, AsyncCallback, ErrorCallback } from "../../../types";
import { calculateNumberOfSharesTraded } from "./calculate-number-of-shares-traded";
import { updateOrdersAndPositions } from "./update-orders-and-positions";
import { updateVolumetrics } from "./update-volumetrics";
import { augurEmitter } from "../../../events";
import { convertFixedPointToDecimal } from "../../../utils/convert-fixed-point-to-decimal";
import { WEI_PER_ETHER } from "../../../constants";

interface TokensRowWithNumTicksAndCategory extends TokensRow {
  numTicks: number|string;
  category: string;
}

export function processOrderFilledLog(db: Knex, augur: Augur, trx: Knex.Transaction, log: FormattedLog, callback: ErrorCallback): void {
  const shareToken: Address = log.shareToken;
  const blockNumber: number = log.blockNumber;
  const filler: Address = log.filler;
  trx.first("marketID", "outcome").from("tokens").where({ contractAddress: shareToken }).asCallback((err: Error|null, tokensRow?: Partial<TokensRow>): void => {
    if (err) return callback(err);
    if (!tokensRow) return callback(new Error("market and outcome not found"));
    const marketID = tokensRow.marketID!;
    const outcome = tokensRow.outcome!;
    trx.first("minPrice", "maxPrice", "numTicks", "category").from("markets").where({ marketID }).asCallback((err: Error|null, marketsRow?: Partial<MarketsRow>): void => {
      if (err) return callback(err);
      if (!marketsRow) return callback(new Error("market min price, max price, category, and/or num ticks not found"));
      const minPrice = marketsRow.minPrice!;
      const maxPrice = marketsRow.maxPrice!;
      const numTicks = marketsRow.numTicks!;
      const category = marketsRow.category!;
      const orderID = log.orderId;
      trx.first("orderCreator", "fullPrecisionPrice", "orderType").from("orders").where({ orderID }).asCallback((err: Error|null, ordersRow?: Partial<OrdersRow>): void => {
        if (err) return callback(err);
        if (!ordersRow) return callback(new Error("order not found"));
        const orderCreator = ordersRow.orderCreator!;
        const price = ordersRow.fullPrecisionPrice!;
        const orderType = ordersRow.orderType!;
        const numCreatorTokens = convertFixedPointToDecimal(log.numCreatorTokens, WEI_PER_ETHER);
        const numCreatorShares = convertFixedPointToDecimal(log.numCreatorShares, numTicks);
        const numFillerTokens = convertFixedPointToDecimal(log.numFillerTokens, WEI_PER_ETHER);
        const numFillerShares = convertFixedPointToDecimal(log.numFillerShares, numTicks);
        const marketCreatorFees = convertFixedPointToDecimal(log.marketCreatorFees, WEI_PER_ETHER);
        const reporterFees = convertFixedPointToDecimal(log.reporterFees, WEI_PER_ETHER);
        const amount = calculateNumberOfSharesTraded(numCreatorShares, numCreatorTokens, augur.trading.normalizePrice({ minPrice, maxPrice, price }));
        const tradeData = {
          marketID,
          outcome,
          orderID,
          creator: orderCreator,
          orderType,
          filler,
          shareToken,
          blockNumber,
          transactionHash: log.transactionHash,
          logIndex: log.logIndex,
          tradeGroupID: log.tradeGroupId,
          numCreatorTokens,
          numCreatorShares,
          numFillerTokens,
          numFillerShares,
          price,
          amount,
          marketCreatorFees,
          reporterFees,
        };
        augurEmitter.emit("OrderFilled", tradeData);
        db.transacting(trx).insert(tradeData).into("trades").asCallback((err: Error|null): void => {
          if (err) return callback(err);
          updateVolumetrics(db, augur, trx, category, marketID, outcome, blockNumber, orderID, orderCreator, true, (err: Error|null): void => {
            if (err) return callback(err);
            updateOrdersAndPositions(db, augur, trx, marketID, shareToken, orderID, orderCreator, filler, numTicks, callback);
          });
        });
      });
    });
  });
}

export function processOrderFilledLogRemoval(db: Knex, augur: Augur, trx: Knex.Transaction, log: FormattedLog, callback: ErrorCallback): void {
  augurEmitter.emit("OrderFilled", log);
  const shareToken: Address = log.shareToken;
  const blockNumber: number = log.blockNumber;
  trx.first(["tokens.marketID", "tokens.outcome", "markets.numTicks", "markets.category"]).from("tokens").join("markets", "tokens.marketID", "markets.marketID").where("tokens.contractAddress", shareToken).asCallback((err: Error|null, tokensRow?: Partial<TokensRowWithNumTicksAndCategory>): void => {
    if (err) return callback(err);
    if (!tokensRow) return callback(new Error("market and outcome not found"));
    const marketID = tokensRow.marketID!;
    const outcome = tokensRow.outcome!;
    const numTicks = tokensRow.numTicks!;
    const category = tokensRow.category!;
    const orderID = log.orderId;
    trx.first("orderCreator").from("orders").where({ orderID }).asCallback((err: Error|null, ordersRow?: Partial<OrdersRow>): void => {
      if (err) return callback(err);
      if (!ordersRow) return callback(new Error("order not found"));
      const orderCreator = ordersRow.orderCreator!;
      updateVolumetrics(db, augur, trx, category, marketID, outcome, blockNumber, orderID, orderCreator, false, (err: Error|null): void => {
        if (err) return callback(err);
        db.transacting(trx).from("trades").where({ marketID, outcome, orderID, blockNumber }).del().asCallback((err?: Error|null): void => {
          if (err) return callback(err);
          updateOrdersAndPositions(db, augur, trx, marketID, shareToken, orderID, orderCreator, log.filler, numTicks, callback);
        });
      });
    });
  });
}
