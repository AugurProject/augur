"use strict";

var assign = require("lodash.assign");
var async = require("async");
var immutableDelete = require("immutable-delete");
var api = require("../api");

/**
 * @param {Object} p Parameters object.
 * @param {string} p.markets Array of market addresses for which to claim proceeds.
 * @param {{signer: buffer|function, accountType: string}=} p.meta Authentication metadata for raw transactions.
 * @param {function} p.onSent Called if/when each transaction is broadcast to the network.
 * @param {function} p.onSuccess Called if/when all transactions are sealed and confirmed.
 * @param {function} p.onFailed Called if/when any of the transactions fail.
 */
function claimMarketsProceeds(p) {
  var claimProceedsPayload = immutableDelete(p, "markets");
  var claimedMarkets = [];
  async.eachSeries(p.markets, function (market, nextMarket) {
    api().Markets.getFinalizationTime({ tx: { to: market } }, function (err, finalizationTime) {
      if (err) return nextMarket(err);
      if (parseInt(finalizationTime, 16) === 0) return nextMarket(); // market not yet finalized
      api().ClaimProceeds.claimProceeds(assign({}, claimProceedsPayload, {
        _market: market,
        onSuccess: function () {
          claimedMarkets.push(market);
          nextMarket();
        },
        onFailed: nextMarket
      }));
    });
  }, function (err) {
    if (err) return p.onFailed(err);
    p.onSuccess(claimedMarkets);
  });
}

module.exports = claimMarketsProceeds;
