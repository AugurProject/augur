import {
  UPDATE_LIQUIDITY_ORDER,
  ADD_MARKET_LIQUIDITY_ORDERS,
  REMOVE_LIQUIDITY_ORDER,
  CLEAR_LIQUIDITY_ORDER,
  LOAD_PENDING_LIQUIDITY_ORDERS,
  CLEAR_ALL_MARKET_ORDERS,
  UPDATE_TX_PARAM_HASH_TX_HASH,
  UPDATE_LIQUIDITY_ORDER_STATUS,
  DELETE_SUCCESSFUL_LIQUIDITY_ORDER,
} from 'modules/orders/actions/liquidity-management';
import { LiquidityOrders, LiquidityOrder, BaseAction } from 'modules/types';

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
  { type, data }: BaseAction
): LiquidityOrders {
  switch (type) {
    case LOAD_PENDING_LIQUIDITY_ORDERS:
      return {
        ...data.pendingLiquidityOrders,
      };
    case ADD_MARKET_LIQUIDITY_ORDERS: {
      const { liquidityOrders, txParamHash } = data;
      const updatedOrderBook = Object.keys(liquidityOrders).reduce(
        (acc, key) => {
          acc[key] = liquidityOrders[key].map((order, index, array) => ({
            ...array[index],
            index,
          }));
          return acc;
        },
        {}
      );
      return {
        ...pendingLiquidityOrders,
        [txParamHash]: updatedOrderBook,
      };
    }
    case DELETE_SUCCESSFUL_LIQUIDITY_ORDER: {
      const { txParamHash, outcomeId, type, price } = data;
      if (!pendingLiquidityOrders[txParamHash]) return pendingLiquidityOrders;
      if (!pendingLiquidityOrders[txParamHash][outcomeId])
        return pendingLiquidityOrders;

      const outcomeOrderBook = pendingLiquidityOrders[txParamHash][
        outcomeId
      ].reduce((p, order: LiquidityOrder) => {
        if (order.type === type && order.price === price) return p;
        return [...p, order];
      }, []);
      pendingLiquidityOrders[txParamHash][outcomeId] = outcomeOrderBook;
      if (pendingLiquidityOrders[txParamHash][outcomeId].length == 0) {
        delete pendingLiquidityOrders[txParamHash][outcomeId];
      }
      if (Object.keys(pendingLiquidityOrders[txParamHash]).length == 0) {
        delete pendingLiquidityOrders[txParamHash];
      }
      return {
        ...pendingLiquidityOrders
      };
    }
    case UPDATE_TX_PARAM_HASH_TX_HASH: {
      const { txParamHash, txHash } = data;
      const orderBook = pendingLiquidityOrders[txParamHash];
      if (!orderBook) return pendingLiquidityOrders;
      delete pendingLiquidityOrders[txParamHash];
      return {
        ...pendingLiquidityOrders,
        [txHash]: orderBook,
      };
    }
    case CLEAR_ALL_MARKET_ORDERS: {
      delete pendingLiquidityOrders[data.txParamHash];
      return { ...pendingLiquidityOrders };
    }
    case UPDATE_LIQUIDITY_ORDER_STATUS: {
      const { txParamHash, outcomeId, type, price, eventName } = data;
      if (!pendingLiquidityOrders[txParamHash]) return pendingLiquidityOrders;
      if (!pendingLiquidityOrders[txParamHash][outcomeId])
        return pendingLiquidityOrders;

      pendingLiquidityOrders[txParamHash][outcomeId].map(order => {
        if (order.type === type && parseFloat(order.price) === parseFloat(price)) {
          order.status = eventName;
        }
      });
      return {
        ...pendingLiquidityOrders
      };
    }
    case UPDATE_LIQUIDITY_ORDER: {
      const { order, updates, txParamHash, outcomeId } = data;
      const updatedOrder = {
        ...order,
        ...updates,
      };
      const updatedOutcomeArray = pendingLiquidityOrders[txParamHash][
        outcomeId
      ].map(outcomeOrder => {
        if (outcomeOrder.index !== updatedOrder.index) return outcomeOrder;
        return updatedOrder;
      });
      pendingLiquidityOrders[txParamHash][outcomeId] = updatedOutcomeArray;
      return { ...pendingLiquidityOrders };
    }
    case REMOVE_LIQUIDITY_ORDER: {
      // data: txParamHash, outcomeId, orderId (index)
      const { txParamHash, outcomeId, orderId } = data;
      if (!pendingLiquidityOrders[txParamHash]) return pendingLiquidityOrders;
      if (!pendingLiquidityOrders[txParamHash][outcomeId])
        return pendingLiquidityOrders;
      const updatedOutcomeOrders = pendingLiquidityOrders[txParamHash][
        outcomeId
      ].reduce((acc: LiquidityOrder[], order) => {
        if (order.index === orderId) return acc;
        acc.push(order);
        return acc;
      }, []);
      pendingLiquidityOrders[txParamHash][outcomeId] = updatedOutcomeOrders;
      if (pendingLiquidityOrders[txParamHash][outcomeId].length === 0)
        delete pendingLiquidityOrders[txParamHash][outcomeId];
      if (Object.keys(pendingLiquidityOrders[txParamHash]).length === 0)
        delete pendingLiquidityOrders[txParamHash];
      return { ...pendingLiquidityOrders };
    }
    case CLEAR_LIQUIDITY_ORDER: {
      return DEFAULT_STATE;
    }
    default:
      return pendingLiquidityOrders;
  }
}
