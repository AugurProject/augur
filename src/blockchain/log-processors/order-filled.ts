import { Augur, CalculatedProfitLoss } from "augur.js";
import BigNumber from "bignumber.js";
import { forEachOf, parallel } from "async";
import * as Knex from "knex";
import { Address, Bytes32, Int256, FormattedLog, UITrade, AsyncCallback, ErrorCallback } from "../../types";
import { getUserTradingHistory } from "../../server/getters/get-user-trading-history";
import { convertFixedPointToDecimal } from "../../utils/convert-fixed-point-to-decimal";
import { denormalizePrice } from "../../utils/denormalize-price";
import { WEI_PER_ETHER } from "../../constants";

interface BlocksRow {
  blockTimestamp: number;
}

interface TokensRow {
  marketID: Address;
  outcome: number;
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
  forEachOf(positionInMarket, (numShares: string, outcome: number, nextOutcome: AsyncCallback): void => {
    db("positions").transacting(trx).where({ account, marketID, outcome }).update({
      numShares,
      realizedProfitLoss: realizedProfitLoss[outcome],
      unrealizedProfitLoss: unrealizedProfitLoss[outcome],
      numSharesAdjustedForUserIntention: positionInMarketAdjustedForUserIntention[outcome],
    }).asCallback(nextOutcome);
  }, callback);
}

export function calculateProfitLossInOutcome(augur: Augur, trx: Knex.Transaction, account: Address, marketID: Address, outcome: number, callback: (err: Error|null, profitLossInOutcome?: CalculatedProfitLoss) => void): void {
  getUserTradingHistory(trx, account, marketID, outcome, null, null, null, null, null, (err: Error|null, userTradingHistory?: Array<UITrade>): void => {
    if (err) return callback(err);
    trx.select("price").from("outcomes").where({ marketID, outcome }).asCallback((err: Error|null, outcomesRows?: Array<OutcomesRow>): void => {
      if (err) return callback(err);
      if (!outcomesRows || !outcomesRows.length) return callback(null);
      const { price } = outcomesRows![0];
      callback(null, augur.trading.calculateProfitLoss({ trades: userTradingHistory, lastPrice: price }));
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

export function processOrderFilledLog(db: Knex, augur: Augur, trx: Knex.Transaction, log: FormattedLog, callback: ErrorCallback): void {
  trx.select("blockTimestamp").from("blocks").where({ blockNumber: log.blockNumber }).asCallback((err: Error|null, blocksRows?: Array<BlocksRow>): void => {
    if (err) return callback(err);
    if (!blocksRows || !blocksRows.length) return callback(new Error("block timestamp not found"));
    const timestamp = blocksRows![0]!.blockTimestamp;
    trx.select(["marketID", "outcome"]).from("tokens").where({ contractAddress: log.shareToken }).asCallback((err: Error|null, tokensRows?: Array<TokensRow>): void => {
      if (err) return callback(err);
      if (!tokensRows || !tokensRows.length) return callback(new Error("market and outcome not found"));
      const { marketID, outcome } = tokensRows[0];
      trx.select(["minPrice", "maxPrice", "numTicks"]).from("markets").where({ marketID }).asCallback((err: Error|null, marketsRows?: Array<MarketsRow>): void => {
        if (err) return callback(err);
        if (!marketsRows || !marketsRows.length) return callback(new Error("market min price, max price, and/or num ticks not found"));
        const { minPrice, maxPrice, numTicks } = marketsRows[0];
        const price = denormalizePrice(minPrice, maxPrice, convertFixedPointToDecimal(log.price, numTicks));
        const numCreatorTokens = convertFixedPointToDecimal(log.numCreatorTokens, WEI_PER_ETHER);
        const numCreatorShares = convertFixedPointToDecimal(log.numCreatorShares, numTicks);
        const numFillerTokens = convertFixedPointToDecimal(log.numFillerTokens, WEI_PER_ETHER);
        const numFillerShares = convertFixedPointToDecimal(log.numFillerShares, numTicks);
        const settlementFees = convertFixedPointToDecimal(log.settlementFees, WEI_PER_ETHER);
        const orderID = log.orderId;
        const dataToInsert: {} = {
          marketID,
          outcome,
          orderID,
          creator: log.creator,
          filler: log.filler,
          tradeBlockNumber: log.blockNumber,
          tradeGroupID: log.tradeGroupID,
          numCreatorTokens,
          numCreatorShares,
          numFillerTokens,
          numFillerShares,
          price,
          shares: calculateNumberOfSharesTraded(numCreatorShares, numCreatorTokens, price),
          settlementFees,
          tradeTime: timestamp,
        };
        db.transacting(trx).insert(dataToInsert).into("trades").asCallback((err: Error|null): void => {
          if (err) return callback(err);
          const shareTokenPayload: {} = { tx: { to: log.shareToken } };
          parallel({
            amount: (next: AsyncCallback): void => augur.api.Orders.getAmount(orderID, next),
            creatorPositionInMarket: (next: AsyncCallback): void => augur.trading.getPositionInMarket({ market: marketID, address: log.creator }, next),
            fillerPositionInMarket: (next: AsyncCallback): void => augur.trading.getPositionInMarket({ market: marketID, address: log.filler }, next),
          }, (err: Error|null, onContractData: OrderFilledOnContractData): void => {
            if (err) return callback(err);
            const { amount, creatorPositionInMarket, fillerPositionInMarket } = onContractData!;
            const amountRemainingInOrder = new BigNumber(amount!, 16).toFixed();
            let updateOrdersQuery = db("orders").transacting(trx).where({ orderID });
            if (amountRemainingInOrder === "0") {
              updateOrdersQuery = updateOrdersQuery.del();
            } else {
              updateOrdersQuery = updateOrdersQuery.update({ amount });
            }
            updateOrdersQuery.asCallback((err: Error|null): void => {
              if (err) return callback(err);
              parallel([
                (next: AsyncCallback): void => upsertPositionInMarket(db, augur, trx, log.creator, marketID, creatorPositionInMarket, next),
                (next: AsyncCallback): void => upsertPositionInMarket(db, augur, trx, log.filler, marketID, fillerPositionInMarket, next),
              ], callback);
            });
          });
        });
      });
    });
  });
}
