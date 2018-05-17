"use strict";

var assign = require("lodash").assign;
var async = require("async");
var immutableDelete = require("immutable-delete");
var claimTradingProceeds = require("./claim-trading-proceeds");
var PARALLEL_LIMIT = require("../constants").PARALLEL_LIMIT;

/**
 * @param {Object} p Parameters object.
 * @param {string} p.markets Array of market addresses for which to claim proceeds.
 * @param {string} p._shareHolder User address that holds the shares.
 * @param {{signer: buffer|function, accountType: string}=} p.meta Authentication metadata for raw transactions.
 * @param {function} p.onSent Called if/when each transaction is broadcast to the network.
 * @param {function} p.onSuccess Called if/when all transactions are sealed and confirmed.
 * @param {function} p.onFailed Called if/when any of the transactions fail.
 */
function claimMarketsTradingProceeds(p) {
  var claimTradingProceedsPayload = immutableDelete(p, "markets");
  var claimedMarkets = [];
  async.eachLimit(p.markets, PARALLEL_LIMIT, function (market, nextMarket) {
    claimTradingProceeds(assign({}, claimTradingProceedsPayload, {
      _market: market,
      onSuccess: function () {
        claimedMarkets.push(market);
        nextMarket();
      },
      onFailed: nextMarket,
    }));
  }, function (err) {
    if (err) return p.onFailed(err);
    p.onSuccess(claimedMarkets);
  });
}

module.exports = claimMarketsTradingProceeds;
