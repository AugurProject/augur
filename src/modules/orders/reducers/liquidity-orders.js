import {
  UPDATE_LIQUIDITY_ORDER,
  ADD_MARKET_LIQUIDITY_ORDERS,
  REMOVE_LIQUIDITY_ORDER,
  LOAD_PENDING_LIQUIDITY_ORDERS,
  CLEAR_ALL_MARKET_ORDERS
} from "modules/orders/actions/liquidity-management";

const DEFAULT_STATE = () => ({});

/*
Example:
{
  <marketId>: {
    <outcomeId>: [{ quantity, price, type, estCost }, ...],
    ...
  },
  ...
}
*/

export default function(pendingLiquidityOrders = DEFAULT_STATE(), action) {
  const { type, data } = action;
  switch (type) {
    case LOAD_PENDING_LIQUIDITY_ORDERS:
      return {
        ...data.pendingLiquidityOrders
      };
    case ADD_MARKET_LIQUIDITY_ORDERS: {
      const { liquidityOrders, marketId } = data;
      const marketOutcomes = Object.keys(liquidityOrders);
      const updatedOrderBook = marketOutcomes.reduce((acc, outcome) => {
        acc[outcome] = liquidityOrders[outcome].map((order, index, array) => ({
          ...array[index],
          index
        }));
        return acc;
      }, {});
      return {
        ...pendingLiquidityOrders,
        [marketId]: updatedOrderBook
      };
    }
    case CLEAR_ALL_MARKET_ORDERS: {
      delete pendingLiquidityOrders[data.marketId];
      return { ...pendingLiquidityOrders };
    }
    case UPDATE_LIQUIDITY_ORDER: {
      const { order, updates, marketId, outcomeId } = data;
      const updatedOrder = {
        ...order,
        ...updates
      };
      const updatedOutcomeArray = pendingLiquidityOrders[marketId][
        outcomeId
      ].map(outcomeOrder => {
        if (outcomeOrder.index !== updatedOrder.index) return outcomeOrder;
        return updatedOrder;
      });
      pendingLiquidityOrders[marketId][outcomeId] = updatedOutcomeArray;
      return { ...pendingLiquidityOrders };
    }
    case REMOVE_LIQUIDITY_ORDER: {
      // data: marketId, outcomeId, orderId (index)
      const { marketId, outcomeId, orderId } = data;
      const marketOutcomes = Object.keys(pendingLiquidityOrders[marketId]);
      // if removing this order will clear the order array, delete the outcome/market if no other outcomes
      if (pendingLiquidityOrders[marketId][outcomeId].length === 1) {
        if (
          marketOutcomes.length === 1 &&
          marketOutcomes.includes(outcomeId.toString())
        ) {
          // remove market completely as this is the last outcome and it's about to be empty
          delete pendingLiquidityOrders[marketId];
          return { ...pendingLiquidityOrders };
        }
        // just remove the outcome
        delete pendingLiquidityOrders[marketId][outcomeId];
        return { ...pendingLiquidityOrders };
      }
      // just remove a single order
      const updatedOutcomeOrders = pendingLiquidityOrders[marketId][
        outcomeId
      ].reduce((acc, order) => {
        if (order.index === orderId) return acc;
        acc.push(order);
        return acc;
      }, []);
      pendingLiquidityOrders[marketId][outcomeId] = updatedOutcomeOrders;
      return { ...pendingLiquidityOrders };
    }
    default:
      return pendingLiquidityOrders;
  }
}
