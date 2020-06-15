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
import { processLiquidityOrder } from 'modules/events/actions/liquidity-transactions';
import { AppStatus } from 'modules/app/store/app-status';
import { Markets } from 'modules/markets/store/markets';
import { PendingOrders } from 'modules/app/store/pending-orders';
// liquidity should be an orderbook, example with yesNo:
// { 1: [{ type, quantity, price, orderEstimate }, ...], ... }

export const loadPendingLiquidityOrders = (
  pendingLiquidityOrders: Getters.Markets.OutcomeOrderBook
) => {
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
  PendingOrders.actions.loadLiquidity(pendingLiquidityOrders);

  // remove orders that have been confirmed
  ordersWithHashes.map(async o => {
    const confirmed = await isTransactionConfirmed(o.hash);
    if (confirmed)
      PendingOrders.actions.removeLiquidity({
        txParamHash: o.txMarketHashId,
        outcomeId: o.outcomeId,
        orderId: o.index,
      });
  });
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
  const properties = processLiquidityOrder(
    {
      outcomeId: order.outcomeId,
      orderPrice: order.price,
      orderType: order.type,
      eventName: TXEventName.Pending,
    },
    market
  );
  PendingOrders.actions.updateLiquidityStatus({
    txParamHash: properties.transactionHash,
    ...properties,
    eventName: TXEventName.Pending,
  });

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

export const startOrderSending = ({
  marketId,
}: CreateLiquidityOrders) => async (
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
      if (o.status !== TXEventName.Pending) {
        const properties = processLiquidityOrder(
          {
            outcomeId: o.outcomeId,
            orderPrice: createBigNumber(o.price).toString(),
            orderType: o.type,
            eventName: TXEventName.Pending,
          },
          market
        );
        PendingOrders.actions.updateLiquidityStatus({
          txParamHash: properties.transactionHash,
          ...properties,
          eventName: TXEventName.Pending,
        });
      }
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
          PendingOrders.actions.updateSuccessfulLiquidity({
            txParamHash: market.transactionHash,
            outcomeId: o.outcomeId,
            type: o.type,
            price: o.price,
          });
        })
        .catch(err => {
          const properties = processLiquidityOrder(
            {
              outcomeId: o.outcomeId,
              orderPrice: createBigNumber(o.price).toString(),
              orderType: o.type,
              eventName: TXEventName.Failure,
            },
            market
          );
          PendingOrders.actions.updateLiquidityStatus({
            txParamHash: properties.transactionHash,
            ...properties,
            eventName: TXEventName.Failure,
          });
        });
    }
  } catch (e) {
    console.error(e);
  }
};
