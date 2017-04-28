"use strict";

var async = require("async");
var generateOrder = require("./generate-order");
var PARALLEL_LIMIT = require("../../constants").PARALLEL_LIMIT;

function generateOrdersForOutcomeOfType(type, market, outcome, prices, bestStartingQuantity, startingQuantity, scalarMinMax, onSetupOrder, callback) {
  async.forEachOfLimit(prices, PARALLEL_LIMIT, function (price, i, nextPrice) {
    var amount = (!i) ? bestStartingQuantity : startingQuantity;
    generateOrder(type, market, outcome, amount.toFixed(), price.toFixed(), scalarMinMax, function (err, order) {
      if (err) return nextPrice(err);
      onSetupOrder(order);
      nextPrice();
    });
  }, callback);
}

module.exports = generateOrdersForOutcomeOfType;
