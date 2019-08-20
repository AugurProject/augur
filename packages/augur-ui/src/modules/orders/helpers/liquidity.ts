import { BID } from "modules/common/constants";
import { createBigNumber } from "utils/create-big-number";

export function sortOrders(orderBook) {
  const sortedOrderBook = {};
  const bids = [];
  const asks = [];
  Object.keys(orderBook).forEach((outcome) => {
    Object.keys(orderBook[outcome]).forEach((index) => {
      if (orderBook[outcome][index].type === BID) {
        if (!bids[outcome]) {
          bids[outcome] = [];
        }
        bids[outcome].push(orderBook[outcome][index]);
      } else {
        if (!asks[outcome]) {
          asks[outcome] = [];
        }
        asks[outcome].push(orderBook[outcome][index]);
      }
    });
    if (!sortedOrderBook[outcome]) {
      sortedOrderBook[outcome] = [];
    }
    if (bids[outcome]) {
      bids[outcome].sort(compareBidPrices);
      Object.keys(bids[outcome]).forEach((index) => {
        sortedOrderBook[outcome].push(bids[outcome][index]);
      });
    }
    if (asks[outcome]) {
      asks[outcome].sort(compareAskPrices);
      Object.keys(asks[outcome]).forEach((index) => {
        sortedOrderBook[outcome].push(asks[outcome][index]);
      });
    }
  });

  return sortedOrderBook;
}

function compareBidPrices(a, b) {
  if (createBigNumber(a.price).lt(createBigNumber(b.price))) {
    return -1;
  }
  if (createBigNumber(a.price).gt(createBigNumber(b.price))) {
    return 1;
  }
  return 0;
}

function compareAskPrices(a, b) {
  if (createBigNumber(a.price).gt(createBigNumber(b.price))) {
    return -1;
  }
  if (createBigNumber(a.price).lt(createBigNumber(b.price))) {
    return 1;
  }
  return 0;
}
