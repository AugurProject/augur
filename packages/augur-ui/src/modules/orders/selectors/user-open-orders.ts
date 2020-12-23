import { TXEventName } from '@augurproject/sdk-lite';
import memoize from 'memoizee';
import {
  BUY,
  BUY_INDEX,
  SELL,
  SELL_INDEX,
  YES_NO,
  CANCELORDER,
  DEFAULT_PARA_TOKEN,
  WETH,
} from 'modules/common/constants';
import { cancelOrder } from 'modules/orders/actions/cancel-order';
import { createBigNumber } from 'utils/create-big-number';
import {
  convertSaltToFormattedDate,
  convertUnixToFormattedDate,
} from 'utils/format-date';
import { formatDai, formatEther, formatMarketShares, formatNone } from 'utils/format-number';
import getPrecision from 'utils/get-number-precision';
import { Markets } from 'modules/markets/store/markets';
import { AppStatus } from 'modules/app/store/app-status';
import { PendingOrders } from 'modules/app/store/pending-orders';

export default function(marketId) {
  if (!marketId) return [];

  return selectUserOpenOrders(marketId);
}

export const selectUserOpenOrders = marketId => {
  const { marketInfos } = Markets.get();
  const {
    pendingQueue,
    userOpenOrders: stateUserOpenOrders,
    loginAccount: { address },
    paraTokenName,
  } = AppStatus.get();
  const { pendingOrders: allMarketsPendingOrders } = PendingOrders.get();
  const userMarketOpenOrders = stateUserOpenOrders[marketId];
  const pendingOrders = allMarketsPendingOrders[marketId];
  const orderCancellation = pendingQueue[CANCELORDER];
  const market = marketInfos[marketId];
  if (
    !market ||
    !address ||
    (!userMarketOpenOrders && !orderCancellation && !pendingOrders)
  )
    return [];
  let userOpenOrderCollection =
    market.outcomes
      .map(outcome => {
        const orderData =
          userMarketOpenOrders && userMarketOpenOrders[outcome.id];
        if (!orderData && !orderCancellation) return [];
        return userOpenOrders(
          market.id,
          outcome.id,
          orderData,
          orderCancellation,
          market.description,
          outcome.description,
          market.marketType,
          market.tickSize,
          paraTokenName
        );
      })
      .filter(collection => collection.length !== 0)
      .flat() || [];

  const decimals = getPrecision(String(market.tickSize), 2);
  // formatting and add pending orders
  if (pendingOrders && pendingOrders.length > 0) {
    const formatted = pendingOrders.map(o => ({
      ...o,
      unmatchedShares: formatMarketShares(market.marketType, o.amount),
      avgPrice: paraTokenName !== WETH ? formatDai(o.fullPrecisionPrice, {
        decimals,
        decimalsRounded: decimals,
      }) : formatEther(o.fullPrecisionPrice, {
        decimals,
        decimalsRounded: decimals,
      }),
      tokensEscrowed: paraTokenName !== WETH ? formatDai(0, { zeroStyled: true }) : formatEther(0, { zeroStyled: true }),
      sharesEscrowed: formatMarketShares(market.marketType, 0, {
        zeroStyled: true,
      }),
      pending: !!o.status, // TODO: can show status of transaction in the future
      status: o.status,
    }));
    userOpenOrderCollection = formatted.concat(userOpenOrderCollection);
  }

  return userOpenOrderCollection || [];
};

const userOpenOrders = memoize(
  (
    marketId,
    outcomeId,
    orderData,
    orderCancellation = {},
    marketDescription,
    name,
    marketType,
    tickSize,
    paraTokenName
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
            tickSize,
            paraTokenName
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
  tickSize = '0.01',
  paraTokenName,
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
      avgPrice: paraTokenName !== WETH ? formatDai(order.fullPrecisionPrice, {
        decimals: getPrecision(String(tickSize), 2),
        decimalsRounded: getPrecision(String(tickSize), 2),
      }) : formatEther(order.fullPrecisionPrice, {
        decimals: getPrecision(String(tickSize), 2),
        decimalsRounded: getPrecision(String(tickSize), 2),
      }),
      matchedShares: formatNone(),
      unmatchedShares: formatMarketShares(marketType, order.amount),
      tokensEscrowed: paraTokenName !== WETH ? formatDai(order.tokensEscrowed) : formatEther(order.tokensEscrowed),
      sharesEscrowed: formatMarketShares(marketType, order.sharesEscrowed),
      marketDescription,
      name,
      cancelOrder: order => cancelOrder(order, marketId),
    }));
}
