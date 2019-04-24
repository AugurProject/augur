import { createBigNumber } from "utils/create-big-number";
import { BUY, SELL } from "modules/common-elements/constants";
import { convertUnixToFormattedDate } from "utils/format-date";

function findOrders(
  tradesCreatedOrFilledByThisAccount,
  accountId,
  outcomesData,
  marketsData,
  openOrders
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
      .filter(trade => trade.creator === trade.filler)
      .map(selfFilledTrade =>
        Object.assign({}, selfFilledTrade, {
          orderId: `${selfFilledTrade.transactionHash}-${
            selfFilledTrade.logIndex
          }-fake-order-for-self-filled-trade`, // fake order id (must be unique per trade) for the fake order that will be used only for this single self-filled trade
          type: selfFilledTrade.type === BUY ? SELL : BUY // flip BUY/SELL to show other side of self-filled trade
        })
      )
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
        type,
        timestamp,
        transactionHash,
        marketId,
        logIndex
      }
    ) => {
      const foundOrder = order.find(({ id }) => id === orderId);
      const amountBN = createBigNumber(amount);
      const priceBN = createBigNumber(price);
      let typeOp = type;

      const outcomeName = outcomesData[outcome].name;

      let originalQuantity = amountBN;
      if (accountId === creator && !foundOrder) {
        typeOp = type === BUY ? SELL : BUY; // marketTradingHistory is from filler perspective

        const matchingOpenOrder = openOrders.find(
          openOrder => openOrder.id === orderId
        );
        originalQuantity =
          (matchingOpenOrder &&
            matchingOpenOrder.unmatchedShares &&
            createBigNumber(
              matchingOpenOrder.unmatchedShares.fullPrecision
            ).plus(amountBN)) ||
          amountBN;
      }

      const timestampFormatted = convertUnixToFormattedDate(timestamp);
      const marketDescription = marketsData.description;

      if (foundOrder) {
        foundOrder.trades.push({
          outcome: outcomeName,
          amount: amountBN,
          price: priceBN,
          type: typeOp,
          timestamp: timestampFormatted,
          transactionHash,
          marketId,
          marketDescription,
          logIndex
        });

        foundOrder.originalQuantity = foundOrder.originalQuantity.plus(
          amountBN
        );
        // amount has been format-number'ed
        foundOrder.amount = createBigNumber(foundOrder.amount).plus(amountBN);
        foundOrder.trades
          .sort((a, b) => b.logIndex - a.logIndex)
          .sort((a, b) => b.timestamp - a.timestamp);

        foundOrder.timestamp = foundOrder.trades[0].timestamp;

        if (accountId !== creator) {
          foundOrder.originalQuantity = foundOrder.amount;
        }
      } else {
        order.push({
          id: orderId,
          timestamp: timestampFormatted,
          outcome: outcomeName,
          type: typeOp,
          price: priceBN,
          amount: amountBN,
          marketId,
          marketDescription,
          originalQuantity,
          logIndex,
          trades: [
            {
              outcome: outcomeName,
              amount: amountBN,
              price: priceBN,
              type: typeOp,
              timestamp: timestampFormatted,
              transactionHash,
              marketId,
              marketDescription,
              logIndex
            }
          ]
        });
      }
      return order
        .sort((a, b) => b.logIndex - a.logIndex)
        .sort((a, b) => b.timestamp.timestamp - a.timestamp.timestamp);
    },
    []
  );

  return orders;
}
export function selectFilledOrders(
  marketTradeHistory,
  accountId,
  outcomesData,
  marketsData,
  openOrders
) {
  if (!marketTradeHistory || marketTradeHistory.length < 1) {
    return [];
  }

  const tradesCreatedOrFilledByThisAccount = marketTradeHistory.filter(
    trade => trade.creator === accountId || trade.filler === accountId
  );

  const orders = findOrders(
    tradesCreatedOrFilledByThisAccount,
    accountId,
    outcomesData,
    marketsData,
    openOrders
  );
  orders
    .sort((a, b) => b.logIndex - a.logIndex)
    .sort((a, b) => b.timestamp - a.timestamp);

  return orders;
}
