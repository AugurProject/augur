import { eachOfSeries, eachOfLimit } from "async";
import { augur } from "services/augurjs";
import { loadMarketsInfo } from "src/modules/markets/actions/load-markets-info";

import { BID } from "modules/transactions/constants/types";
import { CATEGORICAL } from "modules/markets/constants/market-types";

export const UPDATE_LIQUIDITY_ORDER = "UPDATE_LIQUIDITY_ORDER";
export const ADD_MARKET_LIQUIDITY_ORDERS = "ADD_MARKET_LIQUIDITY_ORDERS";
export const REMOVE_LIQUIDITY_ORDER = "REMOVE_LIQUIDITY_ORDER";
export const LOAD_PENDING_LIQUIDITY_ORDERS = "LOAD_PENDING_LIQUIDITY_ORDERS";
export const CLEAR_ALL_MARKET_ORDERS = "CLEAR_ALL_MARKET_ORDERS";
// liquidity should be an orderbook, example with yesNo:
// { 1: [{ type, quantity, price, orderEstimate }, ...], ... }

export const loadPendingLiquidityOrders = data => ({
  type: LOAD_PENDING_LIQUIDITY_ORDERS,
  data
});

export const addMarketLiquidityOrders = data => ({
  type: ADD_MARKET_LIQUIDITY_ORDERS,
  data
});

export const clearMarketLiquidityOrders = data => ({
  type: CLEAR_ALL_MARKET_ORDERS,
  data
});

export const updateLiquidityOrder = data => ({
  type: UPDATE_LIQUIDITY_ORDER,
  data
});

export const removeLiquidityOrder = data => ({
  type: REMOVE_LIQUIDITY_ORDER,
  data
});

export const startOrderSending = options => (dispatch, getState) => {
  const { marketId } = options;
  const { loginAccount, marketsData, pendingLiquidityOrders } = getState();
  const market = marketsData[marketId];
  const orderBook = Object.assign({}, pendingLiquidityOrders[marketId]);
  // if market is undefined (marketsData not loaded yet), try again...
  if (!market) {
    return dispatch(
      loadMarketsInfo([marketId], () =>
        dispatch(startOrderSending({ marketId }))
      )
    );
  }
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
          const outcomeIndex = marketType === CATEGORICAL ? index : 1; // NOTE -- Both Scalar + Binary only trade against one outcome, that of outcomeId 1
          const outcomeId = marketType === CATEGORICAL ? outcome : 1;
          const orderType = order.type === BID ? 0 : 1;
          const tradeCost = augur.trading.calculateTradeCost({
            displayPrice: order.price,
            displayAmount: order.quantity,
            sharesProvided: "0",
            numTicks,
            orderType,
            minDisplayPrice: minPrice || 0,
            maxDisplayPrice: maxPrice || 1
          });
          const { onChainAmount, onChainPrice, cost } = tradeCost;
          augur.api.CreateOrder.publicCreateOrder({
            meta: loginAccount.meta,
            tx: { value: augur.utils.convertBigNumberToHexString(cost) },
            _type: orderType,
            _attoshares: augur.utils.convertBigNumberToHexString(onChainAmount),
            _displayPrice: augur.utils.convertBigNumberToHexString(
              onChainPrice
            ),
            _market: marketId,
            _outcome: outcomeIndex,
            _tradeGroupId: augur.trading.generateTradeGroupId(),
            onSent: res => {
              dispatch(
                updateLiquidityOrder({
                  marketId,
                  order,
                  orderId,
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
            onSuccess: res => {
              dispatch(removeLiquidityOrder({ marketId, orderId, outcomeId }));
            },
            onFailed: err => {
              console.error(
                "ERROR creating order in initial market liquidity: ",
                err
              );
              orderCB();
            }
          });
        },
        err => {
          if (err !== null) console.error("ERROR: ", err);
          seriesCB();
        }
      );
    },
    err => {
      if (err !== null) console.error("ERROR: ", err);
    }
  );
};
