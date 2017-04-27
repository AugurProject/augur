"use strict";

var async = require("async");
var api = require("../../api");
var noop = require("../../utils/noop");

// markets: array of market IDs for which to claim proceeds
function claimMarketsProceeds(branch, markets, callback) {
  var claimedMarkets = [];
  async.eachSeries(markets, function (market, nextMarket) {
    var marketID = market.id;
    api().Markets.getWinningOutcomes({ market: marketID }, function (winningOutcomes) {
      if (!Array.isArray(winningOutcomes) || !winningOutcomes.length || !winningOutcomes[0] || winningOutcomes[0] === "0") {
        return nextMarket(); // market not yet resolved
      }
      api().CloseMarket.claimProceeds({
        branch: branch,
        market: marketID,
        onSent: noop,
        onSuccess: function () {
          claimedMarkets.push(marketID);
          nextMarket();
        },
        onFailed: nextMarket
      });
    });
  }, function (err) {
    if (err) return callback(err);
    callback(null, claimedMarkets);
  });
}

module.exports = claimMarketsProceeds;
