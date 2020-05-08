import memoize from 'memoizee';
import { createBigNumber } from 'utils/create-big-number';
import store, { AppState } from 'appStore';

import { isOrderOfUser } from 'modules/orders/helpers/is-order-of-user';

import {
  BUY_INDEX,
  SELL_INDEX,
  SELL,
  BUY,
  YES_NO,
} from 'modules/common/constants';
import {
  TXEventName
} from '@augurproject/sdk';
import { convertUnixToFormattedDate, convertSaltToFormattedDate } from 'utils/format-date';
import { formatNone, formatShares, formatDai, formatMarketShares } from 'utils/format-number';
import { cancelOrder } from 'modules/orders/actions/cancel-order';
import {
  selectUserMarketOpenOrders,
  selectCancelingOrdersState,
  selectPendingOrdersState,
} from 'appStore/select-state';
import { createSelector } from 'reselect';
import { Markets } from 'modules/markets/store/markets';

function selectMarketsDataStateMarket(marketId) {
  const { marketInfos } = Markets.get();
  return marketInfos[marketId];
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
  (market, userMarketOpenOrders, orderCancellation, pendingOrders) => {
    if (!market) return [];
    let userOpenOrders =
      market.outcomes
        .map(outcome =>
          selectUserOpenOrdersInternal(
            market.id,
            outcome.id,
            userMarketOpenOrders,
            orderCancellation,
            market.description,
            outcome.description,
            market.marketType
          )
        )
        .filter(collection => collection.length !== 0)
        .flat() || [];

    // formatting and add pending orders
    if (pendingOrders && pendingOrders.length > 0) {
      const formatted = pendingOrders.map(o => ({
        ...o,
        unmatchedShares: formatMarketShares(market.marketType, o.amount),
        avgPrice: formatDai(o.fullPrecisionPrice),
        tokensEscrowed: formatDai(0, {zeroStyled: true}),
        sharesEscrowed: formatMarketShares(market.marketType, 0, { zeroStyled: true }),
        pending: !!o.status, // TODO: can show status of transaction in the future
        status: o.status,
      }))
      userOpenOrders = formatted.concat(userOpenOrders);
    }

    return userOpenOrders || [];
  }
);

function selectUserOpenOrdersInternal(
  marketId,
  outcomeId,
  userMarketOpenOrders,
  orderCancellation,
  marketDescription,
  name,
  marketType
) {
  const { loginAccount } = store.getState() as AppState;
  if (!loginAccount.address || userMarketOpenOrders == null) return [];

  return userOpenOrders(
    marketId,
    outcomeId,
    loginAccount,
    userMarketOpenOrders,
    orderCancellation,
    marketDescription,
    name,
    marketType
  );
}

const userOpenOrders = memoize(
  (
    marketId,
    outcomeId,
    loginAccount,
    userMarketOpenOrders,
    orderCancellation,
    marketDescription,
    name,
    marketType
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
            loginAccount.address,
            orderCancellation,
            marketDescription,
            name,
            marketType
          );
    const userAsks =
      orderData == null || orderData[SELL_INDEX] == null
        ? []
        : getUserOpenOrders(
            marketId,
            userMarketOpenOrders[outcomeId],
            SELL_INDEX,
            outcomeId,
            loginAccount.address,
            orderCancellation,
            marketDescription,
            name,
            marketType
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
  userId,
  orderCancellation = {},
  marketDescription = '',
  name = '',
  marketType = YES_NO,
) {
  const typeOrders = orders[orderType];

  return Object.keys(typeOrders)
    .map(orderId => typeOrders[orderId])
    .filter(order => isOrderOfUser(order, userId))
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
      pending: !!orderCancellation[order.orderId] && orderCancellation[order.orderId] !== TXEventName.Failure,
      status: order.orderState,
      orderCancellationStatus: orderCancellation[order.orderId],
      originalShares: formatNone(),
      avgPrice: formatDai(order.fullPrecisionPrice),
      matchedShares: formatNone(),
      unmatchedShares: formatMarketShares(marketType, order.amount),
      tokensEscrowed: formatDai(order.tokensEscrowed),
      sharesEscrowed: formatMarketShares(marketType, order.sharesEscrowed),
      marketDescription,
      name,
      cancelOrder: (order) => store.dispatch(cancelOrder(order))
    }));
}
