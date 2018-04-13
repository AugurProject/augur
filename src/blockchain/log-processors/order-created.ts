import Augur from "augur.js";
import * as Knex from "knex";
import { BigNumber } from "bignumber.js";
import { Address, FormattedEventLog, MarketsRow, OrdersRow, TokensRow, OrderState, ErrorCallback} from "../../types";
import { augurEmitter } from "../../events";
import { fixedPointToDecimal, numTicksToTickSize } from "../../utils/convert-fixed-point-to-decimal";
import { formatOrderAmount, formatOrderPrice } from "../../utils/format-order";
import { BN_WEI_PER_ETHER} from "../../constants";
import { QueryBuilder } from "knex";

export function processOrderCreatedLog(db: Knex, augur: Augur, log: FormattedEventLog, callback: ErrorCallback): void {
  const amount: BigNumber = new BigNumber(log.amount, 10);
  const price: BigNumber = new BigNumber(log.price, 10);
  const orderType: string = log.orderType;
  const moneyEscrowed: BigNumber = new BigNumber(log.moneyEscrowed, 10);
  const sharesEscrowed: BigNumber = new BigNumber(log.sharesEscrowed, 10);
  const shareToken: Address = log.shareToken;
  db.first("marketId", "outcome").from("tokens").where({ contractAddress: shareToken }).asCallback((err: Error|null, tokensRow?: TokensRow): void => {
    if (err) return callback(err);
    if (!tokensRow) return callback(new Error("market and outcome not found"));
    const marketId = tokensRow.marketId!;
    const outcome = tokensRow.outcome!;
    db.first("minPrice", "maxPrice", "numTicks").from("markets").where({ marketId }).asCallback((err: Error|null, marketsRow?: MarketsRow<BigNumber>): void => {
      if (err) return callback(err);
      if (!marketsRow) return callback(new Error("market min price, max price, and/or num ticks not found"));
      const minPrice = marketsRow.minPrice!;
      const maxPrice = marketsRow.maxPrice!;
      const numTicks = marketsRow.numTicks!;
      const tickSize = numTicksToTickSize(numTicks, minPrice, maxPrice);
      const fullPrecisionAmount = augur.utils.convertOnChainAmountToDisplayAmount(amount, tickSize);
      const fullPrecisionPrice = augur.utils.convertOnChainPriceToDisplayPrice(price, minPrice, tickSize);
      const orderTypeLabel = orderType === "0" ? "buy" : "sell";
      const orderData: OrdersRow<string> = {
        marketId,
        blockNumber: log.blockNumber,
        transactionHash: log.transactionHash,
        logIndex: log.logIndex,
        outcome,
        shareToken,
        orderCreator: log.creator,
        orderState: OrderState.OPEN,
        tradeGroupId: log.tradeGroupId,
        orderType: orderTypeLabel,
        price: formatOrderPrice(orderTypeLabel, minPrice, maxPrice, fullPrecisionPrice),
        amount: formatOrderAmount(fullPrecisionAmount),
        fullPrecisionPrice: fullPrecisionPrice.toFixed(),
        fullPrecisionAmount: fullPrecisionAmount.toFixed(),
        tokensEscrowed: fixedPointToDecimal(moneyEscrowed, BN_WEI_PER_ETHER).toFixed(),
        sharesEscrowed: augur.utils.convertOnChainAmountToDisplayAmount(sharesEscrowed, tickSize).toFixed(),
      };
      const orderId = { orderId: log.orderId };
      db.select("marketId").from("orders").where(orderId).asCallback((err: Error|null, ordersRows?: Array<Partial<OrdersRow<BigNumber>>>): void => {
        if (err) return callback(err);
        let upsertOrder: QueryBuilder;
        if (!ordersRows || !ordersRows.length) {
          upsertOrder = db.insert(Object.assign(orderData, orderId)).into("orders");
        } else {
          upsertOrder = db.from("orders").where(orderId).update(orderData);
        }
        upsertOrder.asCallback((err: Error|null): void => {
          if (err) return callback(err);
          augurEmitter.emit("OrderCreated", Object.assign({}, log, orderData));
          callback(null);
        });
      });
    });
  });
}

export function processOrderCreatedLogRemoval(db: Knex, augur: Augur, log: FormattedEventLog, callback: ErrorCallback): void {
  db.from("orders").where("orderId", log.orderId).update({ isRemoved: 1 }).asCallback((err: Error|null): void => {
    if (err) return callback(err);
    augurEmitter.emit("OrderCreated", log);
    callback(null);
  });
}
