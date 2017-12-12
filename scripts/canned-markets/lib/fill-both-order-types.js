"use strict";

var async = require("async");
var fillOrder = require("./fill-order");

function fillBothOrderTypes(augur, universe, fillerAddress, outcomeToTrade, sharesToTrade, callback) {
  async.parallel([
    function (next) { fillOrder(augur, universe, fillerAddress, outcomeToTrade, sharesToTrade, "sell", next); },
    function (next) { fillOrder(augur, universe, fillerAddress, outcomeToTrade, sharesToTrade, "buy", next); },
  ], callback);
}

module.exports = fillBothOrderTypes;
