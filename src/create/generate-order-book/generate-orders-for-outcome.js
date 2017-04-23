"use strict";

var async = require("async");
var generateOrdersForOutcomeOfType = require("./generate-orders-for-outcome-of-type");
var PARALLEL_LIMIT = require("../../constants").PARALLEL_LIMIT;

function generateOrdersForOutcome(index, market, outcome, orders, bestStartingQuantity, startingQuantity, scalarMinMax, onSetupOutcome, onSetupOrder, callback) {
  async.parallelLimit([
    function (next) {
      generateOrdersForOutcomeOfType("buy", market, outcome, orders.buyPrices[index], bestStartingQuantity, startingQuantity, scalarMinMax, onSetupOrder, next);
    },
    function (next) {
      generateOrdersForOutcomeOfType("sell", market, outcome, orders.sellPrices[index], bestStartingQuantity, startingQuantity, scalarMinMax, onSetupOrder, next);
    }
  ], PARALLEL_LIMIT, function (err) {
    onSetupOutcome({ market: market, outcome: outcome });
    callback(err);
  });
}

module.exports = generateOrdersForOutcome;
