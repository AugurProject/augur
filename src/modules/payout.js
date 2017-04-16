/**
 * Cash payouts from closed markets
 */

"use strict";

var async = require("async");
var parseLogMessage = require("../filters/parse-message/parse-log-message");
var store = require("../store");

module.exports = {

  // markets: array of market IDs for which to claim proceeds
  claimMarketsProceeds: function (branch, markets, callback) {
    var claimedMarkets, self = this;
    if (this.options.debug.reporting) {
      console.log("claimMarketsProceeds:", branch, markets);
    }
    claimedMarkets = [];
    async.eachSeries(markets, function (market, nextMarket) {
      if (self.options.debug.reporting) {
        console.log("claimMarketsProceeds", market);
      }
      self.getWinningOutcomes(market.id, function (winningOutcomes) {
        // market not yet resolved
        if (self.options.debug.reporting) {
          console.log("got winning outcomes:", winningOutcomes);
        }
        if (!winningOutcomes || !winningOutcomes.length || !winningOutcomes[0] || winningOutcomes[0] === "0") {
          if (self.options.debug.reporting) {
            console.log("market not yet resolved", market.id);
          }
          return nextMarket();
        }
        self.claimProceeds({
          branch: branch,
          market: market.id,
          onSent: function (res) {
            if (self.options.debug.reporting) {
              console.log("claim proceeds sent:", market.id, res);
            }
          },
          onSuccess: function (res) {
            if (self.options.debug.reporting) {
              console.log("claim proceeds success:", market.id, res);
            }
            claimedMarkets.push(market.id);
            nextMarket();
          },
          onFailed: nextMarket
        });
      });
    }, function (err) {
      if (err) return callback(err);
      callback(null, claimedMarkets);
    });
  },

  claimProceeds: function (branch, market, onSent, onSuccess, onFailed) {
    var self = this;
    if (branch.constructor === Object) {
      market = branch.market;
      onSent = branch.onSent;
      onSuccess = branch.onSuccess;
      onFailed = branch.onFailed;
      branch = branch.branch;
    }
    self.CloseMarket.claimProceeds(branch, market, onSent, function (res) {
      if (self.options.debug.reporting) {
        console.log("claimProceeds success:", market, res);
      }
      if (res.callReturn !== "1") return onFailed(res.callReturn);
      self.rpc.getTransactionReceipt(res.hash, function (receipt) {
        var logs, sig, i, numLogs, eventAPI;
        if (receipt && receipt.logs && receipt.logs.constructor === Array && receipt.logs.length) {
          logs = receipt.logs;
          eventAPI = store.getState().contractsAPI.events.payout;
          sig = eventAPI.signature;
          for (i = 0, numLogs = logs.length; i < numLogs; ++i) {
            if (logs[i].topics[0] === sig) {
              res.callReturn = parseLogMessage("payout", logs[i], eventAPI.inputs);
              break;
            }
          }
        }
        onSuccess(res);
      });
    }, onFailed);
  }
};
