import * as _ from "lodash";
import * as Knex from "knex";
import { BigNumber } from "bignumber.js";
import { Address, OrdersRow, OrderState, UIOrder, UIOrders, GenericCallback, Bytes32 } from "../../types";
import { queryModifier } from "./database";
import { formatBigNumberAsFixed } from "../../utils/format-big-number-as-fixed";

interface OrdersRowWithCreationTimeAndCanceled extends OrdersRow<BigNumber> {
  creationTime: number;
  canceledBlockNumber: Bytes32|null;
  canceledTransactionHash: Bytes32|null;
  canceledTime: number;
}

// market, outcome, creator, orderType, limit, sort
export function getOrders(db: Knex, universe: Address|null, marketId: Address|null, outcome: number|null, orderType: string|null, creator: Address|null, orderState: OrderState|null, earliestCreationTime: number|null, latestCreationTime: number|null, sortBy: string|null|undefined, isSortDescending: boolean|null|undefined, limit: number|null|undefined, offset: number|null|undefined, callback: GenericCallback<UIOrders<string>>): void {
  if (universe == null && marketId == null) return callback(new Error("Must provide universe, either via universe or marketId"));
  const queryData: {} = _.omitBy({
    universe,
    outcome,
    orderType,
    "orderCreator": creator,
    "orders.marketId": marketId,
  }, _.isNil);
  const query: Knex.QueryBuilder = db.select([
    "orders.*",
    "blocks.blockHash",
    "blocks.timestamp as creationTime",
    "orders_canceled.transactionHash as canceledTransactionHash",
    "orders_canceled.blockNumber as canceledBlockNumber",
    "canceledBlock.timestamp as canceledTime",
  ]).from("orders");
  query.join("blocks", "orders.blockNumber", "blocks.blockNumber");
  query.join("markets", "orders.marketId", "markets.marketId");
  query.leftJoin("orders_canceled", "orders_canceled.orderId", "orders.orderId");
  query.leftJoin("blocks as canceledBlock", "orders_canceled.blockNumber", "canceledBlock.blockNumber");
  query.where(queryData);
  if (earliestCreationTime != null) query.where("creationTime", ">=", earliestCreationTime);
  if (latestCreationTime != null) query.where("creationTime", "<=", latestCreationTime);
  query.whereNull("isRemoved");
  if (orderState != null && orderState !== OrderState.ALL) query.where("orderState", orderState);
  queryModifier(db, query, "volume", "desc", sortBy, isSortDescending, limit, offset, (err: Error|null, ordersRows?: Array<OrdersRowWithCreationTimeAndCanceled>): void => {
    if (err) return callback(err);
    if (!ordersRows) return callback(new Error("Unexpected error fetching order rows"));
    const orders: UIOrders<string> = {};
    ordersRows.forEach((row: OrdersRowWithCreationTimeAndCanceled): void => {
      if (!orders[row.marketId]) orders[row.marketId] = {};
      if (!orders[row.marketId][row.outcome]) orders[row.marketId][row.outcome] = {};
      if (!orders[row.marketId][row.outcome][row.orderType]) orders[row.marketId][row.outcome][row.orderType] = {};
      orders[row.marketId][row.outcome][row.orderType][row.orderId!] = Object.assign(
        formatBigNumberAsFixed<UIOrder<BigNumber>, UIOrder<string>>({
          orderId: row.orderId!,
          creationBlockNumber: row.blockNumber,
          transactionHash: row.transactionHash,
          logIndex: row.logIndex,
          shareToken: row.shareToken,
          owner: row.orderCreator,
          creationTime: row.creationTime,
          orderState: row.orderState,
          price: row.price,
          amount: row.amount,
          fullPrecisionPrice: row.fullPrecisionPrice,
          fullPrecisionAmount: row.fullPrecisionAmount,
          tokensEscrowed: row.tokensEscrowed,
          sharesEscrowed: row.sharesEscrowed,
        }),
        row.orderState !== OrderState.CANCELED ? {} : {
          canceledTransactionHash: row.canceledTransactionHash,
          canceledBlockNumber: row.canceledBlockNumber,
          canceledTime: row.canceledTime,
        },
      );
    });
    callback(null, orders);
  });
}
