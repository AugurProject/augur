"use strict";

module.exports = {

  selectOrder: function (orderID, orderBooks) {
    var marketIDs, numMarkets, i, orderBook, order;
    marketIDs = Object.keys(orderBooks);
    numMarkets = marketIDs.length;
    for (i = 0; i < numMarkets; ++i) {
      orderBook = orderBooks[marketIDs[i]];
      order = this.selectOrderInOrderBookSide(orderID, orderBook.buy) || this.selectOrderInOrderBookSide(orderID, orderBook.sell);
      if (order) return order;
    }
  },

  selectOrderInOrderBookSide: function (orderID, orderBookSide) {
    var orderIDs, numOrderIDs, j;
    if (orderBookSide) {
      orderIDs = Object.keys(orderBookSide);
      numOrderIDs = orderIDs.length;
      for (j = 0; j < numOrderIDs; ++j) {
        if (orderBookSide[orderID]) return orderBookSide[orderID];
      }
    }
  }

};
