import { createBigNumber } from 'utils/create-big-number';

import { BUY, MAX_BULK_ORDER_COUNT, ZERO } from 'modules/common/constants';
import { LiquidityOrder, CreateLiquidityOrders } from 'modules/types';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { AppState } from 'appStore';
import {
  createLiquidityOrder,
  isTransactionConfirmed,
  createLiquidityOrders,
  approveToTrade,
  placeTrade,
} from 'modules/contracts/actions/contractCalls';
import { Getters, TXEventName } from '@augurproject/sdk';
import { setLiquidityOrderStatus } from 'modules/events/actions/liquidity-transactions';
export const UPDATE_LIQUIDITY_ORDER = 'UPDATE_LIQUIDITY_ORDER';
export const ADD_MARKET_LIQUIDITY_ORDERS = 'ADD_MARKET_LIQUIDITY_ORDERS';
export const REMOVE_LIQUIDITY_ORDER = 'REMOVE_LIQUIDITY_ORDER';
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
) => ({
  type: LOAD_PENDING_LIQUIDITY_ORDERS,
  data: { pendingLiquidityOrders },
});

export const addMarketLiquidityOrders = ({ liquidityOrders, txParamHash }) => ({
  type: ADD_MARKET_LIQUIDITY_ORDERS,
  data: {
    liquidityOrders,
    txParamHash,
  },
});

export const updateLiqTransactionParamHash = ({ txParamHash, txHash }) => ({
  type: UPDATE_TX_PARAM_HASH_TX_HASH,
  data: {
    txParamHash,
    txHash,
  },
});

export const clearMarketLiquidityOrders = (marketId: string) => ({
  type: CLEAR_ALL_MARKET_ORDERS,
  data: { txParamHash: marketId },
});

export const updateLiquidityOrderStatus = ({
  txParamHash,
  outcomeId,
  type,
  price,
  eventName,
}) => ({
  type: UPDATE_LIQUIDITY_ORDER_STATUS,
  data: {
    txParamHash,
    outcomeId,
    type,
    price,
    eventName,
  },
});

export const deleteSuccessfulLiquidityOrder = ({
  txParamHash,
  outcomeId,
  type,
  price,
}) => ({
  type: DELETE_SUCCESSFUL_LIQUIDITY_ORDER,
  data: {
    txParamHash,
    outcomeId,
    type,
    price,
  },
});

export const updateLiquidityOrder = ({
  order,
  updates,
  marketId,
  outcomeId,
}) => ({
  type: UPDATE_LIQUIDITY_ORDER,
  data: {
    order,
    updates,
    txParamHash: marketId,
    outcomeId,
  },
});

export const removeLiquidityOrder = ({
  transactionHash,
  outcomeId,
  orderId,
}) => ({
  type: REMOVE_LIQUIDITY_ORDER,
  data: { txParamHash: transactionHash, outcomeId, orderId },
});

export const sendLiquidityOrder = (options: any) => async (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  const { order, bnAllowance, marketId } = options;
  const { appStatus, marketInfos } = getState();
  const market = marketInfos[marketId];
  const isZeroX = appStatus.zeroXEnabled;
  const { orderEstimate } = order;

  dispatch(
    setLiquidityOrderStatus(
      {
        outcomeId: order.outcomeId,
        orderPrice: order.price,
        orderType: order.type,
        eventName: TXEventName.Pending,
      },
      market,
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

export const startOrderSending = (options: CreateLiquidityOrders) => async (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  const { marketId, chunkOrders } = options;
  const { loginAccount, marketInfos, pendingLiquidityOrders } = getState();

  if (loginAccount.allowance.lte(ZERO)) await approveToTrade();

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
          market,
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
        fingerprint,
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
              market,
            )
          );
        });
    }
  } catch (e) {
    console.error(e);
  }
};
