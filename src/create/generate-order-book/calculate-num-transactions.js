"use strict";

function calculateNumTransactions(numOutcomes, orders) {
  var i, numTransactions = 0;
  for (i = 0; i < numOutcomes; ++i) {
    numTransactions += orders.numBuyOrders[i] + orders.numSellOrders[i] + 3;
  }
  return numTransactions;
}

module.exports = calculateNumTransactions;
