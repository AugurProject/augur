import memoize from 'memoizee';
import { createBigNumber } from 'utils/create-big-number';
import store, { AppState } from 'store';

import { isOrderOfUser } from 'modules/orders/helpers/is-order-of-user';

import {
  BUY_INDEX,
  SELL_INDEX,
  SELL,
  BUY,
  SCALAR,
  BINARY_CATEGORICAL_FORMAT_OPTIONS,
  CANCELORDER
} from 'modules/common/constants';
import getUserOpenOrder from 'modules/orders/selectors/select-user-open-order';
import {
  TXEventName
} from '@augurproject/sdk';
import { convertUnixToFormattedDate } from 'utils/format-date';
import { formatNone, formatShares, formatDai } from 'utils/format-number';
import { cancelOrder } from 'modules/orders/actions/cancel-order';
import {
  selectMarketInfosState,
  selectUserMarketOpenOrders,
  selectOrderCancellationState,
  selectPendingOrdersState,
} from 'store/select-state';
import { createSelector } from 'reselect';
import { addAlert } from 'modules/alerts/actions/alerts';

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
  selectOrderCancellationState,
  selectPendingOrdersStateMarket,
  (market, userMarketOpenOrders, orderCancellation, pendingOrders) => {
    if (!market) return [];
    const isScalar = market.marketType === SCALAR;
    const shareOptions = isScalar ? {} : { ...BINARY_CATEGORICAL_FORMAT_OPTIONS };
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
            shareOptions
          )
        )
        .filter(collection => collection.length !== 0)
        .flat() || [];

    // formatting and add pending orders
    if (pendingOrders && pendingOrders.length > 0) {
      const formatted = pendingOrders.map(o => ({
        ...o,
        unmatchedShares: formatShares(o.amount, shareOptions),
        avgPrice: formatDai(o.fullPrecisionPrice),
        tokensEscrowed: formatDai(0, {zeroStyled: true}),
        sharesEscrowed: formatShares(0, { ...shareOptions, zeroStyled: true }),
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
  shareOptions
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
    shareOptions
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
    shareOptions
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
            shareOptions
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
            shareOptions
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
  shareOptions = {},
) {
  const typeOrders = orders[orderType];

  return Object.keys(typeOrders)
    .map(orderId => typeOrders[orderId])
    .filter(order => isOrderOfUser(order, userId))
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
      expiry: convertUnixToFormattedDate(order.expirationTimeSeconds),
      pending: !!orderCancellation[order.orderId] && orderCancellation[order.orderId] !== TXEventName.Failure,
      status: order.orderState,
      orderCancellationStatus: orderCancellation[order.orderId],
      originalShares: formatNone(),
      avgPrice: formatDai(order.fullPrecisionPrice),
      matchedShares: formatNone(),
      unmatchedShares: formatShares(order.amount, shareOptions),
      tokensEscrowed: formatDai(order.tokensEscrowed),
      sharesEscrowed: formatShares(order.sharesEscrowed, shareOptions),
      marketDescription,
      name,
      cancelOrder: (order) => {
        const { id } = order;
        store.dispatch(
          addAlert({
            id,
            uniqueId: id,
            name: CANCELORDER,
            status: '',
            params: {
              ...order,
            },
          })
        );
        cancelOrder(id);
      }
    }));
}
