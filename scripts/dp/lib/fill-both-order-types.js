"use strict";

var async = require("async");
var fillOrder = require("./fill-order");

function fillBothOrderTypes(augur, universe, fillerAddress, outcomeToTrade, sharesToTrade, auth, callback) {
  async.series([
    function (next) { fillOrder(augur, universe, fillerAddress, outcomeToTrade, sharesToTrade, "sell", auth, next); },
    function (next) { fillOrder(augur, universe, fillerAddress, outcomeToTrade, sharesToTrade, "buy", auth, next); },
  ], callback);
}

module.exports = fillBothOrderTypes;
