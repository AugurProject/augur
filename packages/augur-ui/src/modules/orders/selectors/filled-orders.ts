import store, { AppState } from "appStore";
import { createBigNumber } from "utils/create-big-number";
import { BUY, SELL, ZERO } from "modules/common/constants";
import { convertUnixToFormattedDate } from "utils/format-date";
import {
  selectMarketInfosState,
  selectLoginAccountAddress,
  selectFilledOrders,
} from "appStore/select-state";
import createCachedSelector from "re-reselect";
import { selectUserOpenOrders } from "modules/orders/selectors/user-open-orders";
import { isSameAddress } from "utils/isSameAddress";
import { formatDaiPrice } from "utils/format-number";

function findOrders(
  tradesCreatedOrFilledByThisAccount,
  accountId,
  marketInfos,
  openOrders,
) {
  // Each input tradesCreatedOrFilledByThisAccount will be associated with exactly
  // one order. But if tradesCreatedOrFilledByThisAccount includes self-filled trades
  // (ie. creator == filler) then our business logic is to show both BUY and SELL
  // sides of each self-filled trade by using a separate "fake self-filled order",
  // such that the self-filled trade is accounted for in two separate orders: the
  // self-filled trade still becomes one extra fill on its pre-existing associated
  // trade (like normal for non-self-filled trades); and the self-fill trade also
  // becomes a single fill in a new, fake order to represent the other side (ie.
  // BUY or SELL) of the self-fill. The fake order is created by first creating
  // a fake trade here which then automatically creates the fake order below. A
  // fake order is never reused, it's only used for the single self-filled trade.
  const tradesIncludingSelfTrades = tradesCreatedOrFilledByThisAccount.concat(
    tradesCreatedOrFilledByThisAccount
      .filter((trade) => isSameAddress(trade.creator, trade.filler))
      .map((selfFilledTrade) =>
        Object.assign({}, selfFilledTrade, {
          orderId: `${selfFilledTrade.transactionHash}-${
            selfFilledTrade.logIndex
          }-fake-order-for-self-filled-trade`, // fake order id (must be unique per trade) for the fake order that will be used only for this single self-filled trade
          type: selfFilledTrade.type === BUY ? SELL : BUY, // flip BUY/SELL to show other side of self-filled trade
        }),
      ),
  );

  const orders = tradesIncludingSelfTrades.reduce(
    (
      order,
      {
        creator,
        orderId,
        outcome,
        amount,
        price,
        type: orderType,
        timestamp,
        transactionHash,
        marketId,
        logIndex,
        tradeGroupId: orderTradeGroupId,
      },
    ) => {
      const foundOrder = order.find(({ id, tradeGroupId, type }) => id === orderId || (tradeGroupId === orderTradeGroupId && type == orderType));
      const amountBN = createBigNumber(amount);
      const priceBN = createBigNumber(price);

      let originalQuantity = amountBN;
      if (isSameAddress(creator, accountId) && !foundOrder) {
        const matchingOpenOrder = openOrders.find(
          (openOrder) => openOrder.id === orderId,
        );
        originalQuantity =
          (matchingOpenOrder &&
            matchingOpenOrder.unmatchedShares &&
            createBigNumber(
              matchingOpenOrder.unmatchedShares.fullPrecision,
            ).plus(amountBN)) ||
          amountBN;
      }

      const timestampFormatted = convertUnixToFormattedDate(timestamp);
      const { marketType, description: marketDescription } = marketInfos;
      const outcomeValue = marketInfos.outcomes.find(o => o.id === outcome);
      if (foundOrder) {
        foundOrder.trades.push({
          id: orderId,
          outcome: outcomeValue.description,
          amount: amountBN,
          price: priceBN,
          type: orderType,
          timestamp: timestampFormatted,
          transactionHash,
          marketId,
          marketDescription,
          marketType,
          logIndex,
          tradeGroupId: orderTradeGroupId,
        });

        foundOrder.originalQuantity = foundOrder.originalQuantity.plus(
          amountBN,
        );
        // amount has been format-number'ed
        foundOrder.amount = createBigNumber(foundOrder.amount).plus(amountBN);
        foundOrder.price = formatDaiPrice(foundOrder.trades
          .reduce(
            (p, t) => p.plus(createBigNumber(t.price).times(t.amount)),
            ZERO
          )
          .div(foundOrder.amount).toFixed(8)).formattedValue;
        foundOrder.trades
          .sort((a, b) => b.logIndex - a.logIndex)
          .sort((a, b) => b.timestamp.timestamp - a.timestamp.timestamp);

        foundOrder.timestamp = foundOrder.trades[0].timestamp;

        if (!isSameAddress(creator, accountId)) {
          foundOrder.originalQuantity = foundOrder.amount;
        }
      } else if (outcomeValue !== undefined) {
        order.push({
          id: orderId,
          timestamp: timestampFormatted,
          outcome: outcomeValue.description,
          type: orderType,
          price: priceBN,
          amount: amountBN,
          marketId,
          marketDescription,
          marketType,
          originalQuantity,
          logIndex,
          tradeGroupId: orderTradeGroupId,
          trades: [
            {
              outcome: outcomeValue.description,
              amount: amountBN,
              price: priceBN,
              type: orderType,
              timestamp: timestampFormatted,
              transactionHash,
              marketId,
              marketDescription,
              marketType,
              logIndex,
            },
          ],
        });
      }
      return order
        .sort((a, b) => b.logIndex - a.logIndex)
        .sort((a, b) => b.timestamp.timestamp - a.timestamp.timestamp);
    },
    [],
  );

  return orders;
}

function selectMarketsDataStateMarket(state, marketId) {
  return selectMarketInfosState(state)[marketId];
}

function selectMarketUserFilledHistoryState(state: AppState, marketId) {
  const filledOrders = selectFilledOrders(state);
  const usersFilled = (filledOrders[state.loginAccount.address] || {})
  return usersFilled[marketId] || [];
}

export default function(marketId) {
  if (!marketId) return [];
  return selectUserFilledOrders(store.getState(), marketId);
}

export const selectUserFilledOrders = createCachedSelector(
  selectLoginAccountAddress,
  selectMarketsDataStateMarket,
  selectUserOpenOrders,
  selectMarketUserFilledHistoryState,
  (accountId, marketInfos, openOrders, filledMarketOrders) => {
    if (
      !filledMarketOrders ||
      filledMarketOrders.length < 1 ||
      marketInfos === undefined
    ) {
      return [];
    }

    const orders = findOrders(
      filledMarketOrders,
      accountId,
      marketInfos,
      openOrders,
    );
    orders
      .sort((a, b) => b.logIndex - a.logIndex)
      .sort((a, b) => b.timestamp.timestamp - a.timestamp.timestamp);

    return orders || [];
  },
)((state, marketId) => marketId);

