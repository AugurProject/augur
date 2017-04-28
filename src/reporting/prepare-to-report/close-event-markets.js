"use strict";

var assign = require("lodash.assign");
var async = require("async");
var api = require("../../api");
var noop = require("../../utils/noop");

function closeEventMarkets(p, branch, event, sender, callback) {
  api().Events.getMarkets({ event: event }, function (markets) {
    if (!Array.isArray(markets) || !markets.length) {
      return callback("no markets found for " + event);
    }
    if (markets && markets.error) return callback(markets);
    async.eachSeries(markets, function (market, nextMarket) {
      api().Markets.getWinningOutcomes({ market: market }, function (winningOutcomes) {
        // console.log("winning outcomes for", market, winningOutcomes);
        if (!winningOutcomes || winningOutcomes.error) return nextMarket(winningOutcomes);
        if (Array.isArray(winningOutcomes) && winningOutcomes.length && !parseInt(winningOutcomes[0], 10)) {
          api().CloseMarket.closeMarket(assign({}, p, {
            branch: branch,
            market: market,
            sender: sender,
            onSent: noop,
            onSuccess: function () { nextMarket(null); },
            onFailed: function (e) {
              api().Markets.getWinningOutcomes({ market: market }, function (winningOutcomes) {
                if (!winningOutcomes) return nextMarket(e);
                if (winningOutcomes.error) return nextMarket(winningOutcomes);
                if (Array.isArray(winningOutcomes) && winningOutcomes.length && !parseInt(winningOutcomes[0], 10)) {
                  return nextMarket(winningOutcomes);
                }
                nextMarket(null);
              });
            }
          }));
        } else {
          nextMarket(null);
        }
      });
    }, callback);
  });
}

module.exports = closeEventMarkets;
