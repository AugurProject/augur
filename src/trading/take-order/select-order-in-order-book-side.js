"use strict";

function selectOrderInOrderBookSide(orderID, orderBookSide) {
  var orderIDs, numOrderIDs, j;
  if (orderBookSide) {
    orderIDs = Object.keys(orderBookSide);
    numOrderIDs = orderIDs.length;
    for (j = 0; j < numOrderIDs; ++j) {
      if (orderBookSide[orderID]) return orderBookSide[orderID];
    }
  }
}

module.exports = selectOrderInOrderBookSide;
