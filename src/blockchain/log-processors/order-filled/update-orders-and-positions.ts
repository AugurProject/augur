import { Augur } from "augur.js";
import { parallel, series } from "async";
import * as Knex from "knex";
import { BigNumber } from "bignumber.js";
import { ZERO } from "../../../constants";
import { Address, Bytes32, AsyncCallback, ErrorCallback, OrderState } from "../../../types";
import { formatOrderAmount } from "../../../utils/format-order";
import { formatBigNumberAsFixed } from "../../../utils/format-big-number-as-fixed";
import { refreshPositionInMarket } from "./refresh-position-in-market";

interface OrderFilledOnContractData {
  amount: { fullPrecisionAmount?: BigNumber };
}

function noop(db: Knex, augur: Augur, marketId: Address, account: Address, callback: (err: Error|null, positions?: Array<string>) => void) {
  callback(null);
}

export function updateOrdersAndPositions(db: Knex, augur: Augur, marketId: Address, orderId: Bytes32, amount: BigNumber, creator: Address, filler: Address, tickSize: BigNumber, callback: ErrorCallback): void {
  // If the user is taking their own order we don't refresh twice
  const fillerRefresh = creator === filler ? noop : refreshPositionInMarket;
  const flow = db.client.config.client === "sqlite3" ? parallel : series;
  flow({
    amount: (next: AsyncCallback) => db("orders").first("fullPrecisionAmount").where({orderId}).asCallback(next),
    creatorPositionInMarket: (next: AsyncCallback): void => refreshPositionInMarket(db, augur, marketId, creator, next),
    fillerPositionInMarket: (next: AsyncCallback): void => fillerRefresh(db, augur, marketId, filler, next),
  }, (err: Error|null, onContractData: OrderFilledOnContractData): void => {
    if (err) return callback(err);
    if (onContractData.amount.fullPrecisionAmount == null) return callback(new Error(`Could not fetch order amount for order ${orderId}`));
    const fullPrecisionAmountRemainingInOrder = new BigNumber(onContractData.amount.fullPrecisionAmount, 10).minus(amount);
    const amountRemainingInOrder = formatOrderAmount(fullPrecisionAmountRemainingInOrder);
    const updateAmountsParams = { fullPrecisionAmount: fullPrecisionAmountRemainingInOrder, amount: amountRemainingInOrder };
    const orderState = fullPrecisionAmountRemainingInOrder.eq(ZERO) ? OrderState.FILLED : OrderState.OPEN;
    const updateParams = Object.assign({ orderState }, updateAmountsParams);
    db("orders").where({ orderId }).update(formatBigNumberAsFixed(updateParams)).asCallback(callback);
  });
}
