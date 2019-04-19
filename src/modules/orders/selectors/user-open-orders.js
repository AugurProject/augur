import memoize from "memoizee";
import { createBigNumber } from "utils/create-big-number";

import store from "src/store";

import { isOrderOfUser } from "modules/orders/helpers/is-order-of-user";

import { BUY, SELL } from "modules/common-elements/constants";

import { convertUnixToFormattedDate } from "utils/format-date";
import { formatNone, formatEther, formatShares } from "utils/format-number";
import { cancelOrder } from "modules/orders/actions/cancel-order";

export function selectUserOpenOrders(
  marketId,
  outcomeId,
  marketOrderBook,
  orderCancellation,
  marketDescription,
  name
) {
  const { loginAccount } = store.getState();
  if (!loginAccount.address || marketOrderBook == null) return [];

  return userOpenOrders(
    marketId,
    outcomeId,
    loginAccount,
    marketOrderBook,
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
    marketOrderBook,
    orderCancellation,
    marketDescription,
    name
  ) => {
    const orderData = marketOrderBook[outcomeId];

    const userBids =
      orderData == null || orderData.buy == null
        ? []
        : getUserOpenOrders(
            marketId,
            marketOrderBook[outcomeId],
            BUY,
            outcomeId,
            loginAccount.address,
            orderCancellation,
            marketDescription,
            name
          );
    const userAsks =
      orderData == null || orderData.sell == null
        ? []
        : getUserOpenOrders(
            marketId,
            marketOrderBook[outcomeId],
            SELL,
            outcomeId,
            loginAccount.address,
            orderCancellation,
            marketDescription,
            name
          );

    const orders = userAsks.concat(userBids);
    return orders.sort(
      (a, b) => a.creationTime.timestamp - b.creationTime.timestamp
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
  marketDescription = "",
  name = ""
) {
  const typeOrders = orders[orderType];

  return Object.keys(typeOrders)
    .map(orderId => typeOrders[orderId])
    .filter(
      order => isOrderOfUser(order, userId) && order.orderState === "OPEN"
    )
    .sort((order1, order2) =>
      createBigNumber(order2.price, 10).comparedTo(
        createBigNumber(order1.price, 10)
      )
    )
    .map(order => ({
      id: order.orderId,
      type: orderType,
      marketId,
      outcomeId,
      creationTime: convertUnixToFormattedDate(order.creationTime),
      pending: !!orderCancellation[order.orderId],
      orderCancellationStatus: orderCancellation[order.orderId],
      originalShares: formatNone(),
      avgPrice: formatEther(order.fullPrecisionPrice),
      matchedShares: formatNone(),
      unmatchedShares: formatShares(order.amount),
      tokensEscrowed: formatEther(order.tokensEscrowed),
      sharesEscrowed: formatShares(order.sharesEscrowed),
      marketDescription,
      name,
      cancelOrder: ({ id, marketId, outcomeId, type }) => {
        store.dispatch(
          cancelOrder({
            orderId: id,
            marketId,
            outcome: outcomeId,
            orderTypeLabel: type
          })
        );
      }
    }));
}
