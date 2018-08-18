import {
  UPDATE_LIQUIDITY_ORDER,
  ADD_MARKET_LIQUIDITY_ORDERS,
  REMOVE_LIQUIDITY_ORDER,
  LOAD_PENDING_LIQUIDITY_ORDERS,
  CLEAR_ALL_MARKET_ORDERS
} from "modules/create-market/actions/liquidity-management";

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
        ...data
      };
    case ADD_MARKET_LIQUIDITY_ORDERS: {
      const marketOutcomes = Object.keys(data.liquidityOrders);
      const updatedOrderBook = marketOutcomes.reduce((acc, outcome) => {
        acc[outcome] = data.liquidityOrders[outcome].map(
          (order, index, array) => ({
            ...array[index],
            index
          })
        );
        return acc;
      }, {});
      return {
        ...pendingLiquidityOrders,
        [data.marketId]: updatedOrderBook
      };
    }
    case CLEAR_ALL_MARKET_ORDERS: {
      delete pendingLiquidityOrders[data];
      return { ...pendingLiquidityOrders };
    }
    case UPDATE_LIQUIDITY_ORDER: {
      const updatedOrder = {
        ...data.order,
        ...data.updates
      };
      const updatedOutcomeArray = pendingLiquidityOrders[data.marketId][
        data.outcomeId
      ].map(outcomeOrder => {
        if (outcomeOrder.index !== updatedOrder.index) return outcomeOrder;
        return updatedOrder;
      });
      pendingLiquidityOrders[data.marketId][
        data.outcomeId
      ] = updatedOutcomeArray;
      return { ...pendingLiquidityOrders };
    }
    case REMOVE_LIQUIDITY_ORDER: {
      // data: marketId, outcomeId, orderId (index)
      const marketOutcomes = Object.keys(pendingLiquidityOrders[data.marketId]);
      // if removing this order will clear the order array, delete the outcome/market if no other outcomes
      if (pendingLiquidityOrders[data.marketId][data.outcomeId].length === 1) {
        if (
          marketOutcomes.length === 1 &&
          marketOutcomes.includes(data.outcomeId.toString())
        ) {
          // remove market completely as this is the last outcome and it's about to be empty
          delete pendingLiquidityOrders[data.marketId];
          return { ...pendingLiquidityOrders };
        }
        // just remove the outcome
        delete pendingLiquidityOrders[data.marketId][data.outcomeId];
        return { ...pendingLiquidityOrders };
      }
      // just remove a single order
      const updatedOutcomeOrders = pendingLiquidityOrders[data.marketId][
        data.outcomeId
      ].reduce((acc, order) => {
        if (order.index === data.orderId) return acc;
        acc.push(order);
        return acc;
      }, []);
      pendingLiquidityOrders[data.marketId][
        data.outcomeId
      ] = updatedOutcomeOrders;
      return { ...pendingLiquidityOrders };
    }
    default:
      return pendingLiquidityOrders;
  }
}
