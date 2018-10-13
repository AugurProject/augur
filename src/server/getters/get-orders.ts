import * as t from "io-ts";
import * as _ from "lodash";
import * as Knex from "knex";
import { BigNumber } from "bignumber.js";
import { OrdersRow, OrderState, UIOrder, UIOrders, Bytes32, SortLimitParams } from "../../types";
import { queryModifierParams } from "./database";
import { formatBigNumberAsFixed } from "../../utils/format-big-number-as-fixed";

export const OrdersParamsSpecific = t.type({
  universe: t.union([t.string, t.null, t.undefined]),
  marketId: t.union([t.string, t.null, t.undefined]),
  outcome: t.union([t.string, t.null, t.undefined]),
  orderType: t.union([t.string, t.null, t.undefined]),
  creator: t.union([t.string, t.null, t.undefined]),
  orderState: t.union([t.string, t.null, t.undefined]),
  orphaned: t.union([t.boolean, t.null, t.undefined]),
  earliestCreationTime: t.union([t.number, t.null, t.undefined]),
  latestCreationTime: t.union([t.number, t.null, t.undefined]),
});

export const OrdersParams = t.intersection([
  OrdersParamsSpecific,
  SortLimitParams,
]);

interface OrdersRowWithCreationTimeAndCanceled extends OrdersRow<BigNumber> {
  creationTime: number;
  canceledBlockNumber: Bytes32|null;
  canceledTransactionHash: Bytes32|null;
  canceledTime: number;
}

export async function getOrders(db: Knex, augur: {}, params: t.TypeOf<typeof OrdersParams>): Promise<UIOrders<string>> {
  if (params.universe == null && params.marketId == null) throw new Error("Must provide universe, either via universe or marketId");
  const queryData: {} = _.omitBy({
    "universe": params.universe,
    "outcome": params.outcome,
    "orderType": params.orderType,
    "orderCreator": params.creator,
    "orders.marketId": params.marketId,
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
  query.where("orphaned", !!params.orphaned ? 1 : 0);
  if (params.earliestCreationTime != null) query.where("creationTime", ">=", params.earliestCreationTime);
  if (params.latestCreationTime != null) query.where("creationTime", "<=", params.latestCreationTime);
  if (params.orderState != null && params.orderState !== OrderState.ALL) query.where("orderState", params.orderState);
  const ordersRows = await queryModifierParams<OrdersRowWithCreationTimeAndCanceled>(db, query, "volume", "desc", params);
  if (!ordersRows) throw new Error("Unexpected error fetching order rows");
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
        originalAmount: row.originalAmount,
        fullPrecisionPrice: row.fullPrecisionPrice,
        fullPrecisionAmount: row.fullPrecisionAmount,
        originalFullPrecisionAmount: row.originalFullPrecisionAmount,
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
  return orders;
}
