import {
  UPDATE_LIQUIDITY_ORDER,
  ADD_MARKET_LIQUIDITY_ORDERS,
  REMOVE_LIQUIDITY_ORDER,
  LOAD_PENDING_LIQUIDITY_ORDERS,
  CLEAR_ALL_MARKET_ORDERS,
  UPDATE_TX_PARAM_HASH_TX_HASH,
} from "modules/orders/actions/liquidity-management";
import { LiquidityOrders, LiquidityOrder, BaseAction } from "modules/types";

const DEFAULT_STATE: LiquidityOrders = {};

/*
Example:
{
  <txParamHash>: {
    <outcomeId>: [{ quantity, price, type, estCost }, ...],
    ...
  },
  ...
}
*/

export default function(
  pendingLiquidityOrders: LiquidityOrders = DEFAULT_STATE,
  { type, data }: BaseAction,
): LiquidityOrders {
  switch (type) {
    case LOAD_PENDING_LIQUIDITY_ORDERS:
      return {
        ...data.pendingLiquidityOrders,
      };
    case ADD_MARKET_LIQUIDITY_ORDERS: {
      const { liquidityOrders, txParamHash } = data;
      const outcomesFormatted = Object.keys(liquidityOrders);
      const updatedOrderBook = outcomesFormatted.reduce((acc, outcome) => {
        acc[outcome] = liquidityOrders[outcome].map((order, index, array) => ({
          ...array[index],
          index,
        }));
        return acc;
      }, {});
      return {
        ...pendingLiquidityOrders,
        [txParamHash]: updatedOrderBook,
      };
    }
    case UPDATE_TX_PARAM_HASH_TX_HASH: {
      const { txParamHash, txHash } = data;
      const orderbook = pendingLiquidityOrders[txParamHash]
      if (!orderbook) return pendingLiquidityOrders;
      delete pendingLiquidityOrders[txParamHash];
      return {
        ...pendingLiquidityOrders,
        [txHash]: orderbook
      }
    }
    case CLEAR_ALL_MARKET_ORDERS: {
      delete pendingLiquidityOrders[data.txParamHash];
      return { ...pendingLiquidityOrders };
    }
    case UPDATE_LIQUIDITY_ORDER: {
      const { order, updates, txParamHash, outcomeId } = data;
      const updatedOrder = {
        ...order,
        ...updates,
      };
      const updatedOutcomeArray = pendingLiquidityOrders[txParamHash][
        outcomeId
      ].map((outcomeOrder) => {
        if (outcomeOrder.index !== updatedOrder.index) return outcomeOrder;
        return updatedOrder;
      });
      pendingLiquidityOrders[txParamHash][outcomeId] = updatedOutcomeArray;
      return { ...pendingLiquidityOrders };
    }
    case REMOVE_LIQUIDITY_ORDER: {
      // data: txParamHash, outcomeId, orderId (index)
      const { txParamHash, outcomeId, orderId } = data;
      const outcomesFormatted = Object.keys(pendingLiquidityOrders[txParamHash]);
      // if removing this order will clear the order array, delete the outcome/market if no other outcomes
      if (pendingLiquidityOrders[txParamHash][outcomeId].length === 1) {
        if (
          outcomesFormatted.length === 1 &&
          outcomesFormatted.includes(outcomeId.toString())
        ) {
          // remove market completely as this is the last outcome and it's about to be empty
          delete pendingLiquidityOrders[txParamHash];
          return { ...pendingLiquidityOrders };
        }
        // just remove the outcome
        delete pendingLiquidityOrders[txParamHash][outcomeId];
        return { ...pendingLiquidityOrders };
      }
      // just remove a single order
      const updatedOutcomeOrders = pendingLiquidityOrders[txParamHash][
        outcomeId
      ].reduce((acc: Array<LiquidityOrder>, order) => {
        if (order.index === orderId) return acc;
        acc.push(order);
        return acc;
      }, []);
      pendingLiquidityOrders[txParamHash][outcomeId] = updatedOutcomeOrders;
      return { ...pendingLiquidityOrders };
    }
    default:
      return pendingLiquidityOrders;
  }
}
