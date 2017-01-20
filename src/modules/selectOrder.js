"use strict";

module.exports = {

  selectOrder: function (orderID, orderBooks) {
    var marketIDs = Object.keys(orderBooks);
    var numMarkets = marketIDs.length;
    for (var i = 0; i < numMarkets; ++i) {
      var orderBook = orderBooks[marketIDs[i]];
      var order = this.selectOrderInOrderBookSide(orderID, orderBook.buy) ||
        this.selectOrderInOrderBookSide(orderID, orderBook.sell);
      if (order) return order;
    }
  },

  selectOrderInOrderBookSide: function (orderID, orderBookSide) {
    var orderIDs = Object.keys(orderBookSide);
    var numOrderIDs = orderIDs.length;
    for (var j = 0; j < numOrderIDs; ++j) {
      if (orderBookSide[orderID]) return orderBookSide[orderID];
    }
  }

};
