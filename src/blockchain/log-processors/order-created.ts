import Augur from "augur.js";
import BigNumber from "bignumber.js";
import * as Knex from "knex";
import { Address, FormattedLog, OrdersRow, ErrorCallback } from "../../types";
import { convertFixedPointToDecimal } from "../../utils/convert-fixed-point-to-decimal";
import { denormalizePrice } from "../../utils/denormalize-price";
import { formatOrderAmount, formatOrderPrice } from "../../utils/format-order";
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

export function processOrderCreatedLog(db: Knex, augur: Augur, trx: Knex.Transaction, log: FormattedLog, callback: ErrorCallback): void {
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
        const fullPrecisionPrice = denormalizePrice(minPrice, maxPrice, convertFixedPointToDecimal(log.price, numTicks));
        const fullPrecisionAmount = convertFixedPointToDecimal(log.amount, numTicks);
        const dataToInsert: OrdersRow = {
          orderID: log.orderID,
          marketID,
          outcome,
          shareToken: log.shareToken,
          orderType: log.orderType,
          orderCreator: log.creator,
          creationTime: timestamp,
          creationBlockNumber: log.blockNumber,
          price: formatOrderPrice(log.orderType, minPrice, maxPrice, fullPrecisionPrice),
          amount: formatOrderAmount(minPrice, maxPrice, fullPrecisionAmount),
          fullPrecisionPrice,
          fullPrecisionAmount,
          tokensEscrowed: convertFixedPointToDecimal(log.tokensEscrowed, WEI_PER_ETHER),
          sharesEscrowed: convertFixedPointToDecimal(log.sharesEscrowed, numTicks),
          betterOrderID: log.betterOrderID,
          worseOrderID: log.worseOrderID,
          tradeGroupID: log.tradeGroupID,
        };
        db.transacting(trx).insert(dataToInsert).into("orders").asCallback(callback);
      });
    });
  });
}
