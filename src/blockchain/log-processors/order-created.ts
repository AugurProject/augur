import BigNumber from "bignumber.js";
import Augur from "augur.js";
import * as Knex from "knex";
import { Address, Bytes32, FormattedEventLog, MarketsRow, OrdersRow, TokensRow, OrderState, ErrorCallback} from "../../types";
import { augurEmitter } from "../../events";
import { convertNumTicksToTickSize, convertFixedPointToDecimal } from "../../utils/convert-fixed-point-to-decimal";
import { denormalizePrice } from "../../utils/denormalize-price";
import { formatOrderAmount, formatOrderPrice } from "../../utils/format-order";
import { WEI_PER_ETHER} from "../../constants";
import { QueryBuilder } from "knex";

interface OrderCreatedOnContractData {
  orderType: string;
  price: string;
  amount: string;
  sharesEscrowed: string;
  moneyEscrowed: string;
  creator: Address;
  betterOrderId: Bytes32;
  worseOrderId: Bytes32;
}

export function processOrderCreatedLog(db: Knex, augur: Augur, log: FormattedEventLog, callback: ErrorCallback): void {
  const amount: string = log.amount;
  const price: string = log.price;
  const orderType: string = log.orderType;
  const moneyEscrowed: string = log.moneyEscrowed;
  const sharesEscrowed: string = log.sharesEscrowed;
  const shareToken: Address = log.shareToken;
  db.first("marketId", "outcome").from("tokens").where({ contractAddress: shareToken }).asCallback((err: Error|null, tokensRow?: TokensRow): void => {
    if (err) return callback(err);
    if (!tokensRow) return callback(new Error("market and outcome not found"));
    const marketId = tokensRow.marketId!;
    const outcome = tokensRow.outcome!;
    db.first("minPrice", "maxPrice", "numTicks").from("markets").where({ marketId }).asCallback((err: Error|null, marketsRow?: MarketsRow): void => {
      if (err) return callback(err);
      if (!marketsRow) return callback(new Error("market min price, max price, and/or num ticks not found"));
      const minPrice = marketsRow.minPrice!;
      const maxPrice = marketsRow.maxPrice!;
      const numTicks = marketsRow.numTicks!;
      const tickSize = convertNumTicksToTickSize(numTicks, minPrice, maxPrice);
      const fullPrecisionAmount = augur.utils.convertOnChainAmountToDisplayAmount(new BigNumber(amount, 10), new BigNumber(tickSize, 10)).toFixed();
      const fullPrecisionPrice = augur.utils.convertOnChainPriceToDisplayPrice(new BigNumber(price, 10), new BigNumber(minPrice, 10), new BigNumber(tickSize, 10)).toFixed();
      const orderTypeLabel = orderType === "0" ? "buy" : "sell";
      const orderData: OrdersRow = {
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
        fullPrecisionPrice,
        fullPrecisionAmount,
        tokensEscrowed: convertFixedPointToDecimal(moneyEscrowed, WEI_PER_ETHER),
        sharesEscrowed: augur.utils.convertOnChainAmountToDisplayAmount(new BigNumber(sharesEscrowed, 10), new BigNumber(tickSize, 10)).toFixed(),
      };
      const orderId = { orderId: log.orderId };
      db.select("marketId").from("orders").where(orderId).asCallback((err: Error|null, ordersRows?: Array<Partial<OrdersRow>>): void => {
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
