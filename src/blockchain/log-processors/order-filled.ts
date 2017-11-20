import { Augur, CalculatedProfitLoss } from "augur.js";
import BigNumber from "bignumber.js";
import { forEachOf, parallel } from "async";
import * as Knex from "knex";
import { Address, Bytes32, Int256, FormattedLog, OrdersRow, UITrade, AsyncCallback, ErrorCallback } from "../../types";
import { getUserTradingHistory } from "../../server/getters/get-user-trading-history";
import { augurEmitter } from "../../events";
import { convertFixedPointToDecimal } from "../../utils/convert-fixed-point-to-decimal";
import { denormalizePrice } from "../../utils/denormalize-price";
import { WEI_PER_ETHER } from "../../constants";

interface TokensRow {
  marketID: Address;
  outcome: number;
}

interface TokensRowWithNumTicks extends TokensRow {
  numTicks: number|string;
}

interface MarketsRow {
  minPrice: string|number;
  maxPrice: string|number;
  numTicks: string|number;
}

interface PositionsRow {
  outcome: number;
  marketID?: Address;
  numShares?: string|number;
  account?: Address;
  realizedProfitLoss?: string|number;
  unrealizedProfitLoss?: string|number;
  numSharesAdjustedForUserIntention?: string|number;
}

interface OutcomesRow {
  price: string|number;
}

interface OrderFilledOnContractData {
  amount: string;
  creatorPositionInMarket: Array<string>;
  fillerPositionInMarket: Array<string>;
}

export function calculateNumberOfSharesTraded(numShares: string, numTokens: string, price: string): string {
  return new BigNumber(numShares, 10).plus(new BigNumber(numTokens, 10).dividedBy(new BigNumber(price, 10))).toFixed();
}

export function insertPositionInMarket(db: Knex, trx: Knex.Transaction, account: Address, marketID: Address, positionInMarket: Array<string>, realizedProfitLoss: Array<string>, unrealizedProfitLoss: Array<string>, positionInMarketAdjustedForUserIntention: Array<string>, callback: ErrorCallback): void {
  db.batchInsert("positions", positionInMarket.map((numShares: string, outcome: number): PositionsRow => ({
    account,
    marketID,
    outcome,
    numShares,
    realizedProfitLoss: realizedProfitLoss[outcome],
    unrealizedProfitLoss: unrealizedProfitLoss[outcome],
    numSharesAdjustedForUserIntention: positionInMarketAdjustedForUserIntention[outcome],
  })), 1000).transacting(trx).asCallback(callback);
}

export function updatePositionInMarket(db: Knex, trx: Knex.Transaction, account: Address, marketID: Address, positionInMarket: Array<string>, realizedProfitLoss: Array<string>, unrealizedProfitLoss: Array<string>, positionInMarketAdjustedForUserIntention: Array<string>, callback: ErrorCallback): void {
  forEachOf(positionInMarket, (numShares: string, outcome: number, nextOutcome: ErrorCallback): void => {
    db("positions").transacting(trx).where({ account, marketID, outcome }).update({
      numShares,
      realizedProfitLoss: realizedProfitLoss[outcome],
      unrealizedProfitLoss: unrealizedProfitLoss[outcome],
      numSharesAdjustedForUserIntention: positionInMarketAdjustedForUserIntention[outcome],
    }).asCallback(nextOutcome);
  }, callback);
}

export function calculateProfitLossInOutcome(augur: Augur, trx: Knex.Transaction, account: Address, marketID: Address, outcome: number, callback: (err: Error|null, profitLossInOutcome?: CalculatedProfitLoss) => void): void {
  getUserTradingHistory(trx, null, account, marketID, outcome, null, null, null, null, null, null, null, (err: Error|null, userTradingHistory?: Array<UITrade>): void => {
    if (err) return callback(err);
    if (!userTradingHistory || !userTradingHistory.length) return callback(null, { realized: "0", unrealized: "0", position: "0", meanOpenPrice: "0", queued: "0" });
    trx.select("price").from("outcomes").where({ marketID, outcome }).asCallback((err: Error|null, outcomesRows?: Array<OutcomesRow>): void => {
      if (err) return callback(err);
      if (!outcomesRows || !outcomesRows.length) return callback(null);
      const { price } = outcomesRows![0];
      callback(null, augur.trading.calculateProfitLoss({ trades: userTradingHistory || [], lastPrice: price }));
    });
  });
}

export function upsertPositionInMarket(db: Knex, augur: Augur, trx: Knex.Transaction, account: Address, marketID: Address, positionInMarket: Array<string>, callback: ErrorCallback): void {
  trx.select("outcome").from("positions").where({ account, marketID }).asCallback((err: Error|null, positionsRows?: Array<PositionsRow>): void => {
    if (err) return callback(err);
    const numOutcomes = positionInMarket.length;
    const realizedProfitLoss = new Array(numOutcomes);
    const unrealizedProfitLoss = new Array(numOutcomes);
    const positionInMarketAdjustedForUserIntention = new Array(numOutcomes);
    forEachOf(positionInMarket, (numShares: string, outcome: number, nextOutcome: AsyncCallback): void => {
      calculateProfitLossInOutcome(augur, trx, account, marketID, outcome, (err: Error|null, profitLossInOutcome?: CalculatedProfitLoss): void => {
        if (err) return nextOutcome(err);
        const { realized, unrealized, position } = profitLossInOutcome!;
        realizedProfitLoss[outcome] = realized;
        unrealizedProfitLoss[outcome] = unrealized;
        positionInMarketAdjustedForUserIntention[outcome] = position;
        nextOutcome();
      });
    }, (err: Error|null): void => {
      if (err) return callback(err);
      (!positionsRows!.length ? insertPositionInMarket : updatePositionInMarket)(db, trx, account, marketID, positionInMarket, realizedProfitLoss, unrealizedProfitLoss, positionInMarketAdjustedForUserIntention, callback);
    });
  });
}

export function updateOrdersAndPositions(db: Knex, augur: Augur, trx: Knex.Transaction, marketID: Address, shareToken: Address, orderID: Bytes32, creator: Address, filler: Address, numTicks: string|number, callback: ErrorCallback): void {
  const shareTokenPayload: {} = { tx: { to: shareToken } };
  parallel({
    amount: (next: AsyncCallback): void => augur.api.Orders.getAmount({ _orderId: orderID }, next),
    creatorPositionInMarket: (next: AsyncCallback): void => augur.trading.getPositionInMarket({ market: marketID, address: creator }, next),
    fillerPositionInMarket: (next: AsyncCallback): void => augur.trading.getPositionInMarket({ market: marketID, address: filler }, next),
  }, (err: Error|null, onContractData: OrderFilledOnContractData): void => {
    if (err) return callback(err);
    const { amount, creatorPositionInMarket, fillerPositionInMarket } = onContractData!;
    const amountRemainingInOrder = convertFixedPointToDecimal(new BigNumber(amount!, 16).toFixed(), numTicks);
    const updateParams = amountRemainingInOrder === "0" ? { amount: amountRemainingInOrder, isRemoved: 1 } : { amount: amountRemainingInOrder };
    db("orders").transacting(trx).where({ orderID }).update(updateParams).asCallback((err: Error|null): void => {
      if (err) return callback(err);
      parallel([
        (next: AsyncCallback): void => upsertPositionInMarket(db, augur, trx, creator, marketID, creatorPositionInMarket, next),
        (next: AsyncCallback): void => upsertPositionInMarket(db, augur, trx, filler, marketID, fillerPositionInMarket, next),
      ], callback);
    });
  });
}

export function processOrderFilledLog(db: Knex, augur: Augur, trx: Knex.Transaction, log: FormattedLog, callback: ErrorCallback): void {
  trx.select(["marketID", "outcome"]).from("tokens").where({ contractAddress: log.shareToken }).asCallback((err: Error|null, tokensRows?: Array<TokensRow>): void => {
    if (err) return callback(err);
    if (!tokensRows || !tokensRows.length) return callback(new Error("market and outcome not found"));
    const { marketID, outcome } = tokensRows[0];
    trx.select(["minPrice", "maxPrice", "numTicks"]).from("markets").where({ marketID }).asCallback((err: Error|null, marketsRows?: Array<MarketsRow>): void => {
      if (err) return callback(err);
      if (!marketsRows || !marketsRows.length) return callback(new Error("market min price, max price, and/or num ticks not found"));
      const { minPrice, maxPrice, numTicks } = marketsRows[0];
      const orderID = log.orderId;
      trx.select(["orderCreator", "price", "orderType"]).from("orders").where({ orderID }).asCallback((err: Error|null, ordersRows?: Array<Partial<OrdersRow>>): void => {
        if (err) return callback(err);
        if (!ordersRows || !ordersRows.length) return callback(new Error("order not found"));
        const { orderCreator, price, orderType } = ordersRows[0];
        const numCreatorTokens = convertFixedPointToDecimal(log.numCreatorTokens, WEI_PER_ETHER);
        const numCreatorShares = convertFixedPointToDecimal(log.numCreatorShares, numTicks);
        const numFillerTokens = convertFixedPointToDecimal(log.numFillerTokens, WEI_PER_ETHER);
        const numFillerShares = convertFixedPointToDecimal(log.numFillerShares, numTicks);
        const settlementFees = convertFixedPointToDecimal(log.settlementFees, WEI_PER_ETHER);
        const tradeData = {
          marketID,
          outcome,
          orderID,
          creator: orderCreator!,
          orderType: orderType!,
          filler: log.filler,
          shareToken: log.shareToken,
          blockNumber: log.blockNumber,
          transactionHash: log.transactionHash,
          logIndex: log.transactionIndex,
          tradeGroupID: log.tradeGroupId,
          numCreatorTokens,
          numCreatorShares,
          numFillerTokens,
          numFillerShares,
          price: price!,
          amount: calculateNumberOfSharesTraded(numCreatorShares, numCreatorTokens, price!),
          settlementFees,
        };
        augurEmitter.emit("OrderFilled", tradeData);
        db.transacting(trx).insert(tradeData).into("trades").asCallback((err: Error|null): void => {
          if (err) return callback(err);
          updateOrdersAndPositions(db, augur, trx, marketID, log.shareToken, orderID, orderCreator!, log.filler, numTicks, callback);
        });
      });
    });
  });
}

export function processOrderFilledLogRemoval(db: Knex, augur: Augur, trx: Knex.Transaction, log: FormattedLog, callback: ErrorCallback): void {
  augurEmitter.emit("OrderFilled", log);
  trx.select(["tokens.marketID", "tokens.outcome", "markets.numTicks"]).from("tokens").join("markets", "tokens.marketID", "markets.marketID").where("tokens.contractAddress", log.shareToken).asCallback((err: Error|null, tokensRows?: Array<TokensRowWithNumTicks>): void => {
    if (err) return callback(err);
    if (!tokensRows || !tokensRows.length) return callback(new Error("market and outcome not found"));
    const { marketID, outcome, numTicks } = tokensRows[0];
    const orderID = log.orderId;
    trx.select("orderCreator").from("orders").where({ orderID }).asCallback((err: Error|null, ordersRows?: Array<Partial<OrdersRow>>): void => {
      if (err) return callback(err);
      if (!ordersRows || !ordersRows.length) return callback(new Error("order not found"));
      const { orderCreator } = ordersRows[0];
      db.transacting(trx).from("trades").where({ marketID, outcome, orderID: log.orderId, blockNumber: log.blockNumber }).del().asCallback((err?: Error|null): void => {
        if (err) return callback(err);
        updateOrdersAndPositions(db, augur, trx, marketID, log.shareToken, log.orderId, orderCreator!, log.filler, numTicks, callback);
      });
    });
  });
}
