import { eachOfSeries, eachOfLimit } from 'async-es';
import { loadMarketsInfo } from 'modules/markets/actions/load-markets-info';
import { updateModal } from 'modules/modal/actions/update-modal';
import { checkAccountAllowance } from 'modules/auth/actions/approve-account';
import { createBigNumber } from 'utils/create-big-number';

import {
  MODAL_ACCOUNT_APPROVAL,
  BUY,
} from 'modules/common/constants';
import { OrderBook, BaseAction } from 'modules/types';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { AppState } from 'store';
import {
  placeTrade,
  createLiquidityOrder,
} from 'modules/contracts/actions/contractCalls';
export const UPDATE_LIQUIDITY_ORDER = 'UPDATE_LIQUIDITY_ORDER';
export const ADD_MARKET_LIQUIDITY_ORDERS = 'ADD_MARKET_LIQUIDITY_ORDERS';
export const REMOVE_LIQUIDITY_ORDER = 'REMOVE_LIQUIDITY_ORDER';
export const LOAD_PENDING_LIQUIDITY_ORDERS = 'LOAD_PENDING_LIQUIDITY_ORDERS';
export const CLEAR_ALL_MARKET_ORDERS = 'CLEAR_ALL_MARKET_ORDERS';
// liquidity should be an orderbook, example with yesNo:
// { 1: [{ type, quantity, price, orderEstimate }, ...], ... }

export const loadPendingLiquidityOrders = (
  pendingLiquidityOrders: OrderBook
) => ({
  type: LOAD_PENDING_LIQUIDITY_ORDERS,
  data: { pendingLiquidityOrders },
});

export const addMarketLiquidityOrders = ({ liquidityOrders, marketId }) => ({
  type: ADD_MARKET_LIQUIDITY_ORDERS,
  data: {
    liquidityOrders,
    marketId,
  },
});

export const clearMarketLiquidityOrders = (marketId: string) => ({
  type: CLEAR_ALL_MARKET_ORDERS,
  data: { marketId },
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
    marketId,
    outcomeId,
  },
});

export const removeLiquidityOrder = ({
  marketId,
  outcomeId,
  orderId,
}: BaseAction) => ({
  type: REMOVE_LIQUIDITY_ORDER,
  data: { marketId, outcomeId, orderId },
});

export const sendLiquidityOrder = (options: any) => (
  dispatch: ThunkDispatch<void, any, Action>
) => {
  const {
    marketId,
    order,
    minPrice,
    maxPrice,
    numTicks,
    bnAllowance,
    orderCB,
    seriesCB,
  } = options;
  const orderType = order.type === BUY ? 0 : 1;
  const { orderEstimate } = order;
  const sendOrder = async () => {
    try {
      createLiquidityOrder({ ...order, orderType, minPrice, maxPrice, numTicks, marketId });
    } catch (e) {
      console.error('could not create order', e);
    }
    orderCB();
    // TODO: handle update liquidity when pending tx has been added.
    /*
    augur.api.CreateOrder.publicCreateOrder({
      meta: loginAccount.meta,
      tx: { value: augur.utils.convertBigNumberToHexString(cost) },
      _type: orderType,
      _attoshares: augur.utils.convertBigNumberToHexString(onChainAmount),
      _displayPrice: augur.utils.convertBigNumberToHexString(onChainPrice),
      _market: marketId,
      _outcome: outcomeIndex,
      _tradeGroupId: augur.trading.generateTradeGroupId(),
      onSent: (res: any) => {
        dispatch(
          updateLiquidityOrder({
            marketId,
            order,
            outcomeId,
            updates: {
              onSent: true,
              orderId: res.callReturn,
              txhash: res.hash
            }
          })
        );
        orderCB();
      },
      onSuccess: (res: any) => {
        dispatch(removeLiquidityOrder({ marketId, orderId, outcomeId }));
      },
      onFailed: (err: any) => {
        console.error(
          "ERROR creating order in initial market liquidity: ",
          err
        );
        orderCB();
      }
    });
    */
  };

  const promptApprovalandSend = () => {
    dispatch(
      updateModal({
        type: MODAL_ACCOUNT_APPROVAL,
        approveOnSent: () => {
          sendOrder();
        },
        approveCallback: (err: any, res: any) => {
          if (err) return seriesCB(err);
        },
      })
    );
  };

  if (bnAllowance.lte(0) || bnAllowance.lte(createBigNumber(orderEstimate))) {
    dispatch(
      checkAccountAllowance((err: any, allowance: string) => {
        if (allowance === '0') {
          promptApprovalandSend();
        } else {
          sendOrder();
        }
      })
    );
  } else {
    sendOrder();
  }
};
export const startOrderSending = (options: any) => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  const { marketId } = options;
  const { loginAccount, marketInfos, pendingLiquidityOrders } = getState();
  const bnAllowance = createBigNumber(loginAccount.allowance, 10);
  const market = marketInfos[marketId];
  const orderBook = Object.assign({}, pendingLiquidityOrders[marketId]);
  // if market is undefined (marketsData not loaded yet), try again...
  if (!market) {
    return dispatch(
      loadMarketsInfo([marketId], () =>
        dispatch(startOrderSending({ marketId }))
      )
    );
  }
  // create a marketOutcomesArray which is an array of descriptions to match categorical outcomes to their proper index
  const marketOutcomesArray = market.outcomes.reduce(
    (acc: any, outcome: any) => {
      acc.push(outcome.description);
      return acc;
    },
    []
  );

  eachOfSeries(
    Object.keys(orderBook),
    (outcome, index, seriesCB) => {
      // Set the limit for simultaneous async calls to 1 so orders will have to be signed in order, one at a time.
      // (This is done so the gas cost doesn't increase as orders are created, due to having to traverse the
      // order book and insert each order in the appropriate spot.)
      const { numTicks, marketType, minPrice, maxPrice } = market;
      eachOfLimit(
        orderBook[outcome],
        1,
        (order, orderId, orderCB) => {
          dispatch(
            sendLiquidityOrder({
              marketId,
              marketType,
              order,
              marketOutcomesArray,
              minPrice,
              maxPrice,
              numTicks,
              orderId,
              bnAllowance,
              loginAccount,
              orderCB,
              seriesCB,
              outcome,
            })
          );
        },
        err => {
          if (err !== null) console.error('ERROR: ', err);
          seriesCB();
        }
      );
    },
    err => {
      if (err !== null) console.error('ERROR: ', err);
    }
  );
};
