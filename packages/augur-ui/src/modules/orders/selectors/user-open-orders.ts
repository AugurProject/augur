import memoize from 'memoizee';
import { createBigNumber } from 'utils/create-big-number';
import createCachedSelector from 're-reselect';
import store from 'store';

import { isOrderOfUser } from 'modules/orders/helpers/is-order-of-user';

import {
  BUY_INDEX,
  SELL_INDEX,
  SELL,
  BUY,
  OPEN,
} from 'modules/common/constants';

import { convertUnixToFormattedDate } from 'utils/format-date';
import { formatNone, formatEther, formatShares, formatDai } from 'utils/format-number';
import { cancelOrder } from 'modules/orders/actions/cancel-order';
import {
  selectMarketInfosState,
  selectUserMarketOpenOrders,
  selectOrderCancellationState,
  selectPendingOrdersState,
  selectLoginAccountAddress,
} from 'store/select-state';

function selectMarketsDataStateMarket(state, marketId) {
  return selectMarketInfosState(state)[marketId];
}

function selectUserMarketOpenOrdersMarket(state, marketId) {
  return selectUserMarketOpenOrders(state)[marketId];
}

function selectPendingOrdersStateMarket(state, marketId) {
  return selectPendingOrdersState(state)[marketId];
}

export default function(marketId) {
  if (!marketId) return [];

  return selectUserOpenOrders(store.getState(), marketId);
}

export const selectUserOpenOrders = createCachedSelector(
  selectMarketsDataStateMarket,
  selectUserMarketOpenOrdersMarket,
  selectOrderCancellationState,
  selectPendingOrdersStateMarket,
  selectLoginAccountAddress,
  (market, userMarketOpenOrders, orderCancellation, pendingOrders, account) => {
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
            outcome.description
          )
        )
        .filter(collection => collection.length !== 0)
        .flat() || [];

    // add pending orders
    if (pendingOrders && pendingOrders.length > 0) {
      userOpenOrders = pendingOrders.concat(userOpenOrders);
    }

    return userOpenOrders || [];
  }
)((state, marketId) => marketId);

function selectUserOpenOrdersInternal(
  marketId,
  outcomeId,
  userMarketOpenOrders,
  orderCancellation,
  marketDescription,
  name
) {
  const { loginAccount } = store.getState();
  if (!loginAccount.address || userMarketOpenOrders == null) return [];

  return userOpenOrders(
    marketId,
    outcomeId,
    loginAccount,
    userMarketOpenOrders,
    orderCancellation,
    marketDescription,
    name
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
    name
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
            name
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
            name
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
  name = ''
) {
  const typeOrders = orders[orderType];

  return Object.keys(typeOrders)
    .map(orderId => typeOrders[orderId])
    .filter(order => isOrderOfUser(order, userId) && order.orderState === OPEN)
    .sort((order1, order2) =>
      createBigNumber(order2.price, 10).comparedTo(
        createBigNumber(order1.price, 10)
      )
    )
    .map(order => ({
      id: order.orderId,
      type: orderType === BUY_INDEX ? BUY : SELL,
      marketId,
      outcomeId,
      creationTime: convertUnixToFormattedDate(order.creationTime),
      pending: !!orderCancellation[order.orderId],
      orderCancellationStatus: orderCancellation[order.orderId],
      originalShares: formatNone(),
      avgPrice: formatDai(order.fullPrecisionPrice),
      matchedShares: formatNone(),
      unmatchedShares: formatShares(order.amount),
      tokensEscrowed: formatDai(order.tokensEscrowed),
      sharesEscrowed: formatShares(order.sharesEscrowed),
      marketDescription,
      name,
      cancelOrder: ({ id, marketId, outcomeId, type }) => {
        store.dispatch(
          cancelOrder({
            orderId: id,
            marketId,
            outcome: outcomeId,
            orderTypeLabel: type,
          })
        );
      },
    }));
}
