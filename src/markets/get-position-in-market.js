"use strict";

var api = require("../api");

// { market, account }
function getPositionInMarket(p, callback) {
  return api().CompositeGetters.getPositionInMarket({
    market: p.market,
    account: p.account
  }, callback);
}

module.exports = getPositionInMarket;
