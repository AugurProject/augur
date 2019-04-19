import { createBigNumber } from "utils/create-big-number";
import { BUY, SELL } from "modules/common-elements/constants";
import { convertUnixToFormattedDate } from "utils/format-date";

function findOrders(
  filledOrders,
  accountId,
  outcomesData,
  marketsData,
  openOrders
) {
  const orders = filledOrders.reduce(
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

  const filledOrders = marketTradeHistory.filter(
    trade => trade.creator === accountId || trade.filler === accountId
  );

  const orders = findOrders(
    filledOrders,
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
