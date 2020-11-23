import { useReducer } from 'react';
import {
  PENDING_ORDERS_ACTIONS,
  DEFAULT_PENDING_ORDERS,
  PENDING_ORDERS,
  PENDING_LIQUIDITY_ORDERS,
} from 'modules/app/store/constants';
import { LiquidityOrder } from 'modules/types';
import { windowRef } from 'utils/window-ref';
import { LIQUIDITY_ORDERS } from 'modules/common/constants';
import {
  manageAndUpdatePendingQueue,
} from 'modules/pending-queue/actions/pending-queue-management';

const {
  UPDATE_PENDING_ORDER,
  REMOVE_PENDING_ORDER,
  UPDATE_LIQUIDITY_ORDER,
  ADD_MARKET_LIQUIDITY_ORDERS,
  REMOVE_LIQUIDITY_ORDER,
  CLEAR_LIQUIDITY_ORDERS,
  LOAD_PENDING_LIQUIDITY_ORDERS,
  CLEAR_ALL_MARKET_ORDERS,
  UPDATE_TX_PARAM_HASH_TX_HASH,
  UPDATE_LIQUIDITY_ORDER_STATUS,
  DELETE_SUCCESSFUL_LIQUIDITY_ORDER,
} = PENDING_ORDERS_ACTIONS;

const updatePendingQueueBasedOnOrders = (updatedState, txHash) => {
  const marketOrders = updatedState[PENDING_LIQUIDITY_ORDERS][txHash];
  let pendingQueue = [];
  if (marketOrders) {
    Object.keys(marketOrders).map(outcome =>
      marketOrders[outcome].map(order => {
        pendingQueue.push(order);
      })
    );
    manageAndUpdatePendingQueue(pendingQueue, pendingQueue.length, txHash, LIQUIDITY_ORDERS);
  }
};

export function PendingOrdersReducer(state, action) {
  const updatedState = { ...state };
  switch (action.type) {
    case LOAD_PENDING_LIQUIDITY_ORDERS: {
      updatedState[PENDING_LIQUIDITY_ORDERS] = {
        ...action.pendingLiquidityOrders,
      };
      break;
    }
    case ADD_MARKET_LIQUIDITY_ORDERS: {
      const { liquidityOrders, txParamHash } = action;
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
      updatedState[PENDING_LIQUIDITY_ORDERS] = {
        ...updatedState[PENDING_LIQUIDITY_ORDERS],
        [txParamHash]: updatedOrderBook,
      };
      break;
    }
    case DELETE_SUCCESSFUL_LIQUIDITY_ORDER: {
      const { txParamHash, outcomeId, type, price } = action.data;
      const pendingLiquidityOrders = updatedState[PENDING_LIQUIDITY_ORDERS];
      if (
        !pendingLiquidityOrders[txParamHash] ||
        !pendingLiquidityOrders[txParamHash][outcomeId]
      ) {
        break;
      }
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
      updatedState[PENDING_LIQUIDITY_ORDERS] = {
        ...pendingLiquidityOrders,
      };
      updatePendingQueueBasedOnOrders(updatedState, txParamHash);
      break;
    }
    case UPDATE_TX_PARAM_HASH_TX_HASH: {
      const { txParamHash, txHash } = action;
      const orderBook = updatedState[PENDING_LIQUIDITY_ORDERS][txParamHash];
      if (!orderBook) break;
      delete updatedState[PENDING_LIQUIDITY_ORDERS][txParamHash];
      updatedState[PENDING_LIQUIDITY_ORDERS] = {
        ...updatedState[PENDING_LIQUIDITY_ORDERS],
        [txHash]: orderBook,
      };
      break;
    }
    case UPDATE_LIQUIDITY_ORDER_STATUS: {
      const { txParamHash, outcomeId, type, price, eventName } = action.data;
      const pendingLiquidityOrders = updatedState[PENDING_LIQUIDITY_ORDERS];
      if (
        !pendingLiquidityOrders[txParamHash] ||
        !pendingLiquidityOrders[txParamHash][outcomeId]
      ) {
        break;
      }
      pendingLiquidityOrders[txParamHash][outcomeId].map(order => {
        if (
          order.type === type &&
          parseFloat(order.price) === parseFloat(price)
        ) {
          order.status = eventName;
        }
      });
      updatedState[PENDING_LIQUIDITY_ORDERS] = {
        ...pendingLiquidityOrders,
      };
      updatePendingQueueBasedOnOrders(updatedState, txParamHash);
      break;
    }
    case UPDATE_LIQUIDITY_ORDER: {
      const { order, updates, txParamHash, outcomeId } = action;
      const updatedOrder = {
        ...order,
        ...updates,
      };
      const updatedOutcomeArray = updatedState[PENDING_LIQUIDITY_ORDERS][
        txParamHash
      ][outcomeId].map(outcomeOrder => {
        if (outcomeOrder.index !== updatedOrder.index) return outcomeOrder;
        return updatedOrder;
      });
      break;
    }
    case REMOVE_LIQUIDITY_ORDER: {
      // data: txParamHash, outcomeId, orderId (index)
      const { txParamHash, outcomeId, orderId } = action;
      const pendingLiquidityOrders = updatedState[PENDING_LIQUIDITY_ORDERS];
      if (
        !pendingLiquidityOrders[txParamHash] ||
        !pendingLiquidityOrders[txParamHash][outcomeId]
      ) {
        break;
      }
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
      updatedState[PENDING_LIQUIDITY_ORDERS] = {
        ...pendingLiquidityOrders,
      };
      updatePendingQueueBasedOnOrders(updatedState, txParamHash);
      break;
    }
    case CLEAR_ALL_MARKET_ORDERS: {
      delete updatedState[PENDING_LIQUIDITY_ORDERS][action.txParamHash];
      break;
    }
    case CLEAR_LIQUIDITY_ORDERS: {
      updatedState[PENDING_LIQUIDITY_ORDERS] = {};
      break;
    }
    case UPDATE_PENDING_ORDER: {
      let marketOrders = updatedState[PENDING_ORDERS][action.marketId];
      if (!marketOrders) {
        marketOrders = [];
      }
      let index = -1;
      let currentOrder = marketOrders.find((order, ind) => {
        if (order?.id === action?.order?.id) {
          index = ind;
          return true;
        }
        return false;
      });
      if (!currentOrder) {
        currentOrder = { ...action.order };
        if (currentOrder.id) {
          marketOrders.push(currentOrder);
        }
      } else {
        marketOrders[index] = {
          ...currentOrder,
          ...action.order,
        };
      }
      if (marketOrders.length === 0) {
        delete updatedState[PENDING_ORDERS][action.marketId];
      } else {
        updatedState[PENDING_ORDERS][action.marketId] = marketOrders;
      }
      break;
    }
    case REMOVE_PENDING_ORDER: {
      let orders = updatedState[PENDING_ORDERS][action.marketId];
      if (orders) {
        orders = orders.filter(obj => obj.id !== action.orderId);
        updatedState[PENDING_ORDERS] = {
          ...updatedState[PENDING_ORDERS],
          [action.marketId]: orders,
        };
        if (orders.length === 0) {
          delete updatedState[PENDING_ORDERS][action.marketId];
        }
      }
      break;
    }
    default:
      console.error(`Error: ${action.type} not caught by Pending reducer.`);
  }
  // console.log("pendingOrders", action);
  windowRef.pendingOrders = updatedState;
  windowRef.stores.pendingOrders = updatedState;
  return updatedState;
}

export const usePendingOrders = (defaultState = DEFAULT_PENDING_ORDERS) => {
  const [state, dispatch] = useReducer(PendingOrdersReducer, defaultState);
  windowRef.pendingOrders = state;
  windowRef.stores.pendingOrders = state;
  return {
    ...state,
    actions: {
      addLiquidity: ({ liquidityOrders, txParamHash }) =>
        dispatch({
          type: ADD_MARKET_LIQUIDITY_ORDERS,
          liquidityOrders,
          txParamHash,
        }),
      updateLiquidity: ({ order, updates, txParamHash, outcomeId }) =>
        dispatch({
          type: UPDATE_LIQUIDITY_ORDER,
          order,
          updates,
          txParamHash,
          outcomeId,
        }),
      removeLiquidity: ({ txParamHash, outcomeId, orderId }) =>
        dispatch({
          type: REMOVE_LIQUIDITY_ORDER,
          txParamHash,
          outcomeId,
          orderId,
        }),
      clearLiquidity: () => dispatch({ type: CLEAR_LIQUIDITY_ORDERS }),
      loadLiquidity: pendingLiquidityOrders =>
        dispatch({
          type: LOAD_PENDING_LIQUIDITY_ORDERS,
          pendingLiquidityOrders,
        }),
      clearAllMarketLiquidity: ({ txParamHash }) =>
        dispatch({ type: CLEAR_ALL_MARKET_ORDERS, txParamHash }),
      updateLiquidityHash: ({ txParamHash, txHash }) =>
        dispatch({ type: UPDATE_TX_PARAM_HASH_TX_HASH, txParamHash, txHash }),
      updateLiquidityStatus: ({
        txParamHash,
        outcomeId,
        type,
        price,
        eventName,
      }) =>
        dispatch({
          type: UPDATE_LIQUIDITY_ORDER_STATUS,
          data: { txParamHash, outcomeId, type, price, eventName },
        }),
      updateSuccessfulLiquidity: ({ txParamHash, outcomeId, type, price }) =>
        dispatch({
          type: DELETE_SUCCESSFUL_LIQUIDITY_ORDER,
          data: {
            txParamHash,
            outcomeId,
            type,
            price,
          },
        }),
      updatePendingOrder: (marketId, order) =>
        dispatch({ type: UPDATE_PENDING_ORDER, marketId, order }),
      removePendingOrder: (marketId, orderId) =>
        dispatch({ type: REMOVE_PENDING_ORDER, marketId, orderId }),
    },
  };
};
