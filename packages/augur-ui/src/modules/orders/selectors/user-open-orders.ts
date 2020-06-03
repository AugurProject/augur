import memoize from 'memoizee';
import { createBigNumber } from 'utils/create-big-number';
import store, { AppState } from 'appStore';
import {
  BUY_INDEX,
  SELL_INDEX,
  SELL,
  BUY,
  YES_NO,
} from 'modules/common/constants';
import { TXEventName } from '@augurproject/sdk';
import {
  convertUnixToFormattedDate,
  convertSaltToFormattedDate,
} from 'utils/format-date';
import { formatNone, formatDai, formatMarketShares } from 'utils/format-number';
import { cancelOrder } from 'modules/orders/actions/cancel-order';
import {
  selectMarketInfosState,
  selectUserMarketOpenOrders,
  selectCancelingOrdersState,
  selectPendingOrdersState,
  selectLoginAccountAddress,
} from 'appStore/select-state';
import { createSelector } from 'reselect';
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
    if (!market || !address || (userMarketOpenOrders === undefined && orderCancellation.lenth === 0 && pendingOrders === undefined)) return [];
    let userOpenOrderCollection =
      market.outcomes
        .map(outcome =>
          userOpenOrders(
            market.id,
            outcome.id,
            userMarketOpenOrders,
            orderCancellation,
            market.description,
            outcome.description,
            market.marketType,
            market.tickSize
          )
        )
        .filter(collection => collection.length !== 0)
        .flat() || [];

    const decimals = getPrecision(String(market.tickSize), 2);
    // formatting and add pending orders
    if (pendingOrders && pendingOrders.length > 0) {
      const formatted = pendingOrders.map(o => ({
        ...o,
        unmatchedShares: formatMarketShares(market.marketType, o.amount),
        avgPrice: formatDai(o.fullPrecisionPrice, {
          decimals,
          decimalsRounded: decimals,
        }),
        tokensEscrowed: formatDai(0, { zeroStyled: true }),
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
    userMarketOpenOrders = {},
    orderCancellation = {},
    marketDescription,
    name,
    marketType,
    tickSize
  ) => {
    const orderData = userMarketOpenOrders[outcomeId];

    const userBids =
      orderData == null || orderData[BUY_INDEX] == null
        ? []
        : getUserOpenOrders(
            marketId,
            userMarketOpenOrders[outcomeId],
            BUY_INDEX,
            outcomeId,
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
            userMarketOpenOrders[outcomeId],
            SELL_INDEX,
            outcomeId,
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
  orders,
  orderType,
  outcomeId,
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
      creationTime: convertSaltToFormattedDate(order.salt),
      expiry: convertUnixToFormattedDate(order.expirationTimeSeconds),
      pending:
        !!orderCancellation[order.orderId] &&
        orderCancellation[order.orderId] !== TXEventName.Failure,
      status: order.orderState,
      orderCancellationStatus: orderCancellation[order.orderId],
      originalShares: formatNone(),
      avgPrice: formatDai(order.fullPrecisionPrice, {
        decimals: getPrecision(String(tickSize), 2),
        decimalsRounded: getPrecision(String(tickSize), 2),
      }),
      matchedShares: formatNone(),
      unmatchedShares: formatMarketShares(marketType, order.amount),
      tokensEscrowed: formatDai(order.tokensEscrowed),
      sharesEscrowed: formatMarketShares(marketType, order.sharesEscrowed),
      marketDescription,
      name,
      cancelOrder: order => store.dispatch(cancelOrder(order)),
    }));
}
