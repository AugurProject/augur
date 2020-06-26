import memoize from 'memoizee';
import { createBigNumber } from 'utils/create-big-number';

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
 TXEventName
} from '@augurproject/sdk-lite';
import { convertUnixToFormattedDate, convertSaltToFormattedDate } from 'utils/format-date';
import { formatNone, formatDai, formatMarketShares } from 'utils/format-number';
import { cancelOrder } from 'modules/orders/actions/cancel-order';
import { CANCELORDER } from 'modules/common/constants';
import { AppStatus } from 'modules/app/store/app-status';
import { PendingOrders } from 'modules/app/store/pending-orders';
import { Markets } from 'modules/markets/store/markets';
import getPrecision from 'utils/get-number-precision';

export default function(marketId) {
  if (!marketId) return [];
  return findUserOpenOrders(marketId);
}

export const findUserOpenOrders = (marketId) => {
  const { marketInfos } = Markets.get();
  const { pendingQueue, userOpenOrders: stateUserOpenOrders } = AppStatus.get();
  const { pendingOrders: allMarketsPendingOrders } = PendingOrders.get();
  const userMarketOpenOrders = stateUserOpenOrders[marketId];
  const pendingOrders = allMarketsPendingOrders[marketId];
  const orderCancellation = pendingQueue[CANCELORDER];
  const market = marketInfos[marketId];
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
    const formatted = pendingOrders.map(o => {
      if (!userOpenOrders.find(order => o.id === order.id)) {
        return ({
          ...o,
          unmatchedShares: formatMarketShares(market.marketType, o.amount),
          avgPrice: formatDai(o.fullPrecisionPrice),
          tokensEscrowed: formatDai(0, {zeroStyled: true}),
          sharesEscrowed: formatMarketShares(market.marketType, 0, { zeroStyled: true }),
          pending: !!o.status, // TODO: can show status of transaction in the future
          status: o.status,
        });
      }
    });
    userOpenOrders = formatted.concat(userOpenOrders);
  }
  return userOpenOrders || [];
};

function selectUserOpenOrdersInternal(
  marketId,
  outcomeId,
  userMarketOpenOrders,
  orderCancellation,
  marketDescription,
  name,
  marketType
) {
  const { loginAccount } = AppStatus.get();
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
      cancelOrder: order => cancelOrder(order),
    }));
}
