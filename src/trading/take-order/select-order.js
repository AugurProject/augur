"use strict";

var selectOrderInOrderBookSide = require("./select-order-in-order-book-side");

function selectOrder(orderID, orderBooks) {
  var marketIDs, numMarkets, i, orderBook, order;
  marketIDs = Object.keys(orderBooks);
  numMarkets = marketIDs.length;
  for (i = 0; i < numMarkets; ++i) {
    orderBook = orderBooks[marketIDs[i]];
    order = selectOrderInOrderBookSide(orderID, orderBook.buy) ||
      selectOrderInOrderBookSide(orderID, orderBook.sell);
    if (order) return order;
  }
}

module.exports = selectOrder;
