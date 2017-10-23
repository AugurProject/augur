import Augur from "augur.js";
import BigNumber from "bignumber.js";
import * as Knex from "knex";
import { Address, Bytes32, Int256, FormattedLog, AsyncCallback, ErrorCallback } from "../../types";
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

export function calculateNumberOfSharesTraded(numShares: string, numTokens: string, price: string): string {
  return new BigNumber(numShares, 10).plus(new BigNumber(numTokens, 10).dividedBy(new BigNumber(price, 10))).toFixed();
}

export function processOrderFilledLog(db: Knex, augur: Augur, trx: Knex.Transaction, log: FormattedLog, callback: ErrorCallback): void {
  trx.select("blockTimestamp").from("blocks").where({ blockNumber: log.blockNumber }).asCallback((err: Error|null, blocksRows?: Array<BlocksRow>): void => {
    if (err) return callback(err);
    if (!blocksRows || !blocksRows.length) return callback(new Error("block timestamp not found"));
    const timestamp = blocksRows![0]!.blockTimestamp;
    const shareTokenPayload: {} = { tx: { to: log.shareToken } };
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
        const orderID = log.orderId;
        const dataToInsert: {} = {
          marketID,
          outcome,
          orderID,
          tradeBlockNumber: log.blockNumber,
          tradeGroupID: log.tradeGroupID,
          numCreatorTokens,
          numCreatorShares,
          numFillerTokens,
          numFillerShares,
          price,
          shares: calculateNumberOfSharesTraded(numCreatorShares, numCreatorTokens, price),
          tradeTime: timestamp,
        };
        db.transacting(trx).insert(dataToInsert).into("trades").asCallback((err: Error|null): void => {
          if (err) return callback(err);
          augur.api.Orders.getAmount(orderID, (err: Error|null, amount?: Int256): void => {
            if (err) return callback(err);
            const amountRemainingInOrder = new BigNumber(amount!, 16).toFixed();
            if (amountRemainingInOrder === "0") {
              db("orders").transacting(trx).del().where({ orderID }).asCallback((err: Error|null): void => {
                if (err) return callback(err);
                callback(null);
              });
            } else {
              db("orders").transacting(trx).update({ amount }).where({ orderID }).asCallback((err: Error|null): void => {
                if (err) return callback(err);
                callback(null);
              });
            }
          });
        });
      });
    });
  });
}
