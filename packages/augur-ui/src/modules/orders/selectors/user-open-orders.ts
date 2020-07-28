import { TXEventName } from '@augurproject/sdk-lite';
import store, { AppState } from 'appStore';
import {
  selectCancelingOrdersState,
  selectLoginAccountAddress,
  selectMarketInfosState,
  selectPendingOrdersState,
  selectUserMarketOpenOrders,
} from 'appStore/select-state';
import memoize from 'memoizee';
import {
  BUY,
  BUY_INDEX,
  SELL,
  SELL_INDEX,
  YES_NO,
} from 'modules/common/constants';
import { cancelOrder } from 'modules/orders/actions/cancel-order';
import { createSelector } from 'reselect';
import { createBigNumber } from 'utils/create-big-number';
import {
  convertSaltToFormattedDate,
  convertUnixToFormattedDate,
} from 'utils/format-date';
import { formatDaiPrice, formatMarketShares, formatNone } from 'utils/format-number';
import getPrecision from 'utils/get-number-precision';

function selectMarketsDataStateMarket(state, marketId) {
  return selectMarketInfosState(state)[marketId];
}

function selectUserMarketOpenOrdersMarket(state, marketId) {
  return selectUserMarketOpenOrders(state)[marketId];
}

function selectPendingOrdersStateMarket(state, marketId) {
  const pending = selectPendingOrdersState(state)[marketId];
  return !!pending ? [...pending] : pending;
}

export default function(marketId) {
  if (!marketId) return [];

  return selectUserOpenOrders(store.getState() as AppState, marketId);
}

export const selectUserOpenOrders = createSelector(
  selectMarketsDataStateMarket,
  selectUserMarketOpenOrdersMarket,
  selectCancelingOrdersState,
  selectPendingOrdersStateMarket,
  selectLoginAccountAddress,
  (market, userMarketOpenOrders, orderCancellation, pendingOrders, address) => {
    if (!market || !address || (!userMarketOpenOrders && !orderCancellation && !pendingOrders)) return [];
    let userOpenOrderCollection =
      market.outcomes
        .map(outcome => {
          const orderData = userMarketOpenOrders && userMarketOpenOrders[outcome.id];
          if (!orderData && !orderCancellation) return [];
          return userOpenOrders(
            market.id,
            outcome.id,
            orderData,
            orderCancellation,
            market.description,
            outcome.description,
            market.marketType,
            market.tickSize
          )
        })
        .filter(collection => collection.length !== 0)
        .flat() || [];

    const decimals = getPrecision(String(market.tickSize), 2);
    // formatting and add pending orders
    if (pendingOrders && pendingOrders.length > 0) {
      const formatted = pendingOrders.map(o => ({
        ...o,
        unmatchedShares: formatMarketShares(market.marketType, o.amount),
        avgPrice: formatDaiPrice(o.fullPrecisionPrice, {
          decimals,
          decimalsRounded: decimals,
        }),
        tokensEscrowed: formatDaiPrice(0, { zeroStyled: true }),
        sharesEscrowed: formatMarketShares(market.marketType, 0, {
          zeroStyled: true,
        }),
        pending: !!o.status, // TODO: can show status of transaction in the future
        status: o.status,
      }));
      userOpenOrderCollection = formatted.concat(userOpenOrderCollection);
    }

    return userOpenOrderCollection || [];
  }
);

const userOpenOrders = memoize(
  (
    marketId,
    outcomeId,
    orderData,
    orderCancellation = {},
    marketDescription,
    name,
    marketType,
    tickSize
  ) => {
    const userBids =
      orderData == null || orderData[BUY_INDEX] == null
        ? []
        : getUserOpenOrders(
            marketId,
            outcomeId,
            orderData,
            BUY_INDEX,
            orderCancellation,
            marketDescription,
            name,
            marketType,
            tickSize
          );
    const userAsks =
      orderData == null || orderData[SELL_INDEX] == null
        ? []
        : getUserOpenOrders(
            marketId,
            outcomeId,
            orderData,
            SELL_INDEX,
            orderCancellation,
            marketDescription,
            name,
            marketType,
            tickSize
          );

    const orders = userAsks.concat(userBids);
    return orders.sort(
      (a, b) => b.creationTime.timestamp - a.creationTime.timestamp
    );
  },
  { max: 10 }
);

function getUserOpenOrders(
  marketId,
  outcomeId,
  orders,
  orderType,
  orderCancellation = {},
  marketDescription = '',
  name = '',
  marketType = YES_NO,
  tickSize = '0.01'
) {
  const typeOrders = orders[orderType];

  return Object.keys(typeOrders)
    .map(orderId => typeOrders[orderId])
    .sort((order1, order2) =>
      createBigNumber(order2.salt, 10).comparedTo(
        createBigNumber(order1.salt, 10)
      )
    )
    .map(order => ({
      id: order.orderId,
      type: orderType === BUY_INDEX ? BUY : SELL,
      marketId,
      outcomeId,
      creationTime: convertSaltToFormattedDate(Number(order.salt)),
      expiry: convertUnixToFormattedDate(order.expirationTimeSeconds),
      pending:
        !!orderCancellation[order.orderId] &&
        orderCancellation[order.orderId] !== TXEventName.Failure,
      status: order.orderState,
      orderCancellationStatus: orderCancellation[order.orderId],
      originalShares: formatNone(),
      avgPrice: formatDaiPrice(order.fullPrecisionPrice, {
        decimals: getPrecision(String(tickSize), 2),
        decimalsRounded: getPrecision(String(tickSize), 2),
      }),
      matchedShares: formatNone(),
      unmatchedShares: formatMarketShares(marketType, order.amount),
      tokensEscrowed: formatDaiPrice(order.tokensEscrowed),
      sharesEscrowed: formatMarketShares(marketType, order.sharesEscrowed),
      marketDescription,
      name,
      cancelOrder: order => store.dispatch(cancelOrder(order)),
    }));
}
