import { createBigNumber } from 'utils/create-big-number';

import { BUY, MAX_BULK_ORDER_COUNT, ZERO } from 'modules/common/constants';
import { LiquidityOrder, CreateLiquidityOrders } from 'modules/types';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { AppState } from 'appStore';
import {
  createLiquidityOrder,
  isTransactionConfirmed,
  approveToTrade,
  placeTrade,
} from 'modules/contracts/actions/contractCalls';
import { Getters, TXEventName } from '@augurproject/sdk';
import { setLiquidityOrderStatus } from 'modules/events/actions/liquidity-transactions';
import { AppStatus } from 'modules/app/store/app-status';
import { Markets } from 'modules/markets/store/markets';
import { PendingOrders } from 'modules/app/store/pending-orders';
export const UPDATE_LIQUIDITY_ORDER = 'UPDATE_LIQUIDITY_ORDER';
export const ADD_MARKET_LIQUIDITY_ORDERS = 'ADD_MARKET_LIQUIDITY_ORDERS';
export const REMOVE_LIQUIDITY_ORDER = 'REMOVE_LIQUIDITY_ORDER';
export const CLEAR_LIQUIDITY_ORDER = 'CLEAR_LIQUIDITY_ORDER';
export const LOAD_PENDING_LIQUIDITY_ORDERS = 'LOAD_PENDING_LIQUIDITY_ORDERS';
export const CLEAR_ALL_MARKET_ORDERS = 'CLEAR_ALL_MARKET_ORDERS';
export const UPDATE_TX_PARAM_HASH_TX_HASH = 'UPDATE_TX_PARAM_HASH_TX_HASH';
export const UPDATE_LIQUIDITY_ORDER_STATUS = 'UPDATE_LIQUIDITY_ORDER_STATUS';
export const DELETE_SUCCESSFUL_LIQUIDITY_ORDER =
  'DELETE_SUCCESSFUL_LIQUIDITY_ORDER';
// liquidity should be an orderbook, example with yesNo:
// { 1: [{ type, quantity, price, orderEstimate }, ...], ... }

export const loadPendingLiquidityOrders = (
  pendingLiquidityOrders: Getters.Markets.OutcomeOrderBook
) => (dispatch: ThunkDispatch<void, any, Action>) => {
  const ordersWithHashes = [];
  Object.keys(pendingLiquidityOrders).map((txMarketHashId: string) => {
    Object.keys(pendingLiquidityOrders[txMarketHashId]).map(outcomeId => {
      const orders = pendingLiquidityOrders[txMarketHashId][outcomeId];
      orders.map((o: LiquidityOrder) => {
        if (!o.hash && o.status) delete o.status;
        if (o.hash) ordersWithHashes.push({ ...o, txMarketHashId });
      });
      if (pendingLiquidityOrders[txMarketHashId][outcomeId].length === 0)
        delete pendingLiquidityOrders[txMarketHashId][outcomeId];
    });
    if (Object.keys(pendingLiquidityOrders[txMarketHashId]).length === 0)
      delete pendingLiquidityOrders[txMarketHashId];
  });
  dispatch(loadBulkPendingLiquidityOrders(pendingLiquidityOrders));

  // remove orders that have been confirmed
  ordersWithHashes.map(async o => {
    const confirmed = await isTransactionConfirmed(o.hash);
    if (confirmed)
      dispatch(
        removeLiquidityOrder({
          transactionHash: o.txMarketHashId,
          outcomeId: o.outcomeId,
          orderId: o.index,
        })
      );
  });
};

export const loadBulkPendingLiquidityOrders = (
  pendingLiquidityOrders: Getters.Markets.OutcomeOrderBook
) => {
  PendingOrders.actions.loadLiquidity(pendingLiquidityOrders);
  return {
    type: LOAD_PENDING_LIQUIDITY_ORDERS,
    data: { pendingLiquidityOrders },
  };
};

export const clearLiquidityOrders = () => {
  PendingOrders.actions.clearLiquidity();
  return {
    type: CLEAR_LIQUIDITY_ORDER,
  };
};

export const addMarketLiquidityOrders = ({ liquidityOrders, txParamHash }) => {
  PendingOrders.actions.addLiquidity({ liquidityOrders, txParamHash });
  return {
    type: ADD_MARKET_LIQUIDITY_ORDERS,
    data: {
      liquidityOrders,
      txParamHash,
    },
  };
};
export const updateLiqTransactionParamHash = ({ txParamHash, txHash }) => {
  PendingOrders.actions.updateLiquidityHash({ txParamHash, txHash });
  return {
    type: UPDATE_TX_PARAM_HASH_TX_HASH,
    data: {
      txParamHash,
      txHash,
    },
  };
};
export const clearMarketLiquidityOrders = (marketId: string) => {
  PendingOrders.actions.clearAllMarketLiquidity({ txParamHash: marketId });
  return {
    type: CLEAR_ALL_MARKET_ORDERS,
    data: { txParamHash: marketId },
  };
};

export const updateLiquidityOrderStatus = ({
  txParamHash,
  outcomeId,
  type,
  price,
  eventName,
}) => {
  PendingOrders.actions.updateLiquidityStatus({
    txParamHash,
    outcomeId,
    type,
    price,
    eventName,
  });
  return {
    type: UPDATE_LIQUIDITY_ORDER_STATUS,
    data: {
      txParamHash,
      outcomeId,
      type,
      price,
      eventName,
    },
  };
};

export const deleteSuccessfulLiquidityOrder = ({
  txParamHash,
  outcomeId,
  type,
  price,
}) => {
  PendingOrders.actions.updateSuccessfulLiquidity({
    txParamHash,
    outcomeId,
    type,
    price,
  });
  return {
    type: DELETE_SUCCESSFUL_LIQUIDITY_ORDER,
    data: {
      txParamHash,
      outcomeId,
      type,
      price,
    },
  };
};

export const updateLiquidityOrder = ({
  order,
  updates,
  marketId,
  outcomeId,
}) => {
  PendingOrders.actions.updateLiquidity({
    order,
    updates,
    txParamHash: marketId,
    outcomeId,
  });
  return {
    type: UPDATE_LIQUIDITY_ORDER,
    data: {
      order,
      updates,
      txParamHash: marketId,
      outcomeId,
    },
  };
};
export const removeLiquidityOrder = ({
  transactionHash,
  outcomeId,
  orderId,
}) => {
  PendingOrders.actions.removeLiquidity({
    txParamHash: transactionHash,
    outcomeId,
    orderId,
  });
  return {
    type: REMOVE_LIQUIDITY_ORDER,
    data: { txParamHash: transactionHash, outcomeId, orderId },
  };
};
export const sendLiquidityOrder = (options: any) => async (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  const { order, bnAllowance, marketId } = options;
  const { marketInfos } = Markets.get();
  const market = marketInfos[marketId];
  const isZeroX = options.zeroXEnabled;
  const { orderEstimate } = order;

  dispatch(
    setLiquidityOrderStatus(
      {
        outcomeId: order.outcomeId,
        orderPrice: order.price,
        orderType: order.type,
        eventName: TXEventName.Pending,
      },
      market
    )
  );

  if (bnAllowance.lte(0) || bnAllowance.lte(createBigNumber(orderEstimate))) {
    await approveToTrade();
    isZeroX
      ? createZeroXLiquidityOrders(market, [options.order], dispatch)
      : sendOrder(options);
  } else {
    isZeroX
      ? createZeroXLiquidityOrders(market, [options.order], dispatch)
      : sendOrder(options);
  }
};

const sendOrder = async options => {
  const { marketId, order, minPrice, maxPrice, numTicks, orderCB } = options;
  const orderType = order.type === BUY ? 0 : 1;
  try {
    createLiquidityOrder({
      ...order,
      orderType,
      minPrice,
      maxPrice,
      numTicks,
      marketId,
    });
  } catch (e) {
    console.error('could not create order', e);
  }
  orderCB();
};

export const startOrderSending = ({ marketId }: CreateLiquidityOrders) => async (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  const { marketInfos } = Markets.get();
  const { pendingLiquidityOrders } = PendingOrders.get();
  const { loginAccount, gsnEnabled, zeroXEnabled } = AppStatus.get();
  const chunkOrders = !zeroXEnabled;
  // If GSN is enabled no need to call the below since this will be handled by the proxy contract during initalization
  if (!gsnEnabled && loginAccount.allowance.lte(ZERO)) await approveToTrade();

  const market = marketInfos[marketId];
  let orders = [];
  const liquidity = pendingLiquidityOrders[market.transactionHash];
  Object.keys(liquidity).map(outcomeId => {
    orders = [...orders, ...liquidity[outcomeId]];
  });

  if (!chunkOrders) {
    createZeroXLiquidityOrders(market, orders, dispatch);
  } else {
    // MAX_BULK_ORDER_COUNT number of orders in each creation bulk group
    let i = 0;
    const groups = [];
    for (i; i < orders.length; i += MAX_BULK_ORDER_COUNT) {
      groups.push(orders.slice(i, i + MAX_BULK_ORDER_COUNT));
    }
    try {
      groups.map(group => createZeroXLiquidityOrders(market, group, dispatch));
    } catch (e) {
      console.error(e);
    }
  }
};

const createZeroXLiquidityOrders = async (
  market: Getters.Markets.MarketInfo,
  orders: LiquidityOrder[],
  dispatch
) => {
  try {
    const fingerprint = undefined; // TODO: get this from state
    let i = 0;
    // set all orders to pending before processing them.
    for (i; i < orders.length; i++) {
      const o: LiquidityOrder = orders[i];
      dispatch(
        setLiquidityOrderStatus(
          {
            outcomeId: o.outcomeId,
            orderPrice: createBigNumber(o.price).toString(),
            orderType: o.type,
            eventName: TXEventName.Pending,
          },
          market
        )
      );
    }
    for (i = 0; i < orders.length; i++) {
      const o: LiquidityOrder = orders[i];
      await placeTrade(
        o.type === BUY ? 0 : 1,
        market.id,
        market.numOutcomes,
        o.outcomeId,
        false,
        market.numTicks,
        market.minPrice,
        market.maxPrice,
        o.quantity,
        o.price,
        '0',
        undefined
      )
        .then(() => {
          dispatch(
            deleteSuccessfulLiquidityOrder({
              txParamHash: market.transactionHash,
              outcomeId: o.outcomeId,
              type: o.type,
              price: o.price,
            })
          );
        })
        .catch(err => {
          dispatch(
            setLiquidityOrderStatus(
              {
                outcomeId: o.outcomeId,
                orderPrice: createBigNumber(o.price).toString(),
                orderType: o.type,
                eventName: TXEventName.Failure,
              },
              market
            )
          );
        });
    }
  } catch (e) {
    console.error(e);
  }
};
