import { Augur } from "augur.js";
import { parallel } from "async";
import * as Knex from "knex";
import { BigNumber } from "bignumber.js";
import { ZERO } from "../../../constants";
import { Address, Bytes32, AsyncCallback, ErrorCallback } from "../../../types";
import { formatOrderAmount } from "../../../utils/format-order";
import { formatBigNumberAsFixed } from "../../../utils/format-big-number-as-fixed";
import { refreshPositionInMarket } from "./refresh-position-in-market";

interface OrderFilledOnContractData {
  amount: string;
}

export function updateOrdersAndPositions(db: Knex, augur: Augur, marketId: Address, orderId: Bytes32, creator: Address, filler: Address, tickSize: BigNumber, callback: ErrorCallback): void {
  parallel({
    amount: (next: AsyncCallback): void => augur.api.Orders.getAmount({ _orderId: orderId }, next),
    creatorPositionInMarket: (next: AsyncCallback): void => refreshPositionInMarket(db, augur, marketId, creator, next),
    fillerPositionInMarket: (next: AsyncCallback): void => refreshPositionInMarket(db, augur, marketId, filler, next),
  }, (err: Error|null, onContractData: OrderFilledOnContractData): void => {
    if (err) return callback(err);
    const amount: BigNumber = new BigNumber(onContractData.amount, 10);
    const fullPrecisionAmountRemainingInOrder = augur.utils.convertOnChainAmountToDisplayAmount(amount, tickSize);
    const amountRemainingInOrder = formatOrderAmount(fullPrecisionAmountRemainingInOrder);
    const updateAmountsParams = { fullPrecisionAmount: fullPrecisionAmountRemainingInOrder, amount: amountRemainingInOrder };
    const updateParams = fullPrecisionAmountRemainingInOrder.eq(ZERO) ? Object.assign({}, updateAmountsParams, { isRemoved: 1 }) : updateAmountsParams;
    db("orders").where({ orderId }).update(formatBigNumberAsFixed(updateParams)).asCallback(callback);
  });
}
