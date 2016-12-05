/**
 * Cash payouts from closed markets
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var clone = require("clone");
var abi = require("augur-abi");
var async = require("async");
var constants = require("../constants");

module.exports = {

    closeMarket: function (branch, market, sender, description, onSent, onSuccess, onFailed) {
        if (branch.constructor === Object) {
            market = branch.market;
            sender = branch.sender;
            description = branch.description;
            onSent = branch.onSent;
            onSuccess = branch.onSuccess;
            onFailed = branch.onFailed;
            branch = branch.branch;
        }
        var tx = clone(this.tx.CloseMarket.closeMarket);
        tx.params = [branch, market, sender];
        tx.description = description;
        this.transact(tx, onSent, onSuccess, onFailed);
    },

    // markets: array of market IDs for which to claim proceeds
    claimMarketsProceeds: function (branch, markets, callback, onSent, onSuccess) {
        if (this.options.debug.reporting) {
            console.log("claimMarketsProceeds:", branch, markets);
        }
        var self = this;
        var claimedMarkets = [];
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
                    description: market.description,
                    onSent: function (res) {
                        if (self.options.debug.reporting) {
                            console.log("claim proceeds sent:", market.id, res);
                        }
                        if (onSent) onSent(res.hash, market.id);
                    },
                    onSuccess: function (res) {
                        if (self.options.debug.reporting) {
                            console.log("claim proceeds success:", market.id, res);
                        }
                        if (onSuccess) {
                            onSuccess(res.hash, market.id, {
                                cash: res.callReturn.cash,
                                shares: res.callReturn.shares
                            });
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

    claimProceeds: function (branch, market, description, onSent, onSuccess, onFailed) {
        var self = this;
        if (branch.constructor === Object) {
            market = branch.market;
            description = branch.description;
            onSent = branch.onSent;
            onSuccess = branch.onSuccess;
            onFailed = branch.onFailed;
            branch = branch.branch;
        }
        var tx = clone(self.tx.CloseMarket.claimProceeds);
        tx.params = [branch, market];
        tx.description = description;
        if (self.options.debug.reporting) {
            console.log("claimProceeds:", branch, market, description);
            console.log("claimProceeds tx:", JSON.stringify(tx, null, 2));
        }
        self.transact(tx, onSent, function (res) {
            if (self.options.debug.reporting) {
                console.log("claimProceeds success:", market, res);
            }
            if (res.callReturn !== "1") return onFailed(res.callReturn);
            self.rpc.receipt(res.hash, function (receipt) {
                var logdata;
                var cashPayout = constants.ZERO;
                var shares = constants.ZERO;
                if (receipt && receipt.logs && receipt.logs.constructor === Array && receipt.logs.length) {
                    var logs = receipt.logs;
                    var sig = self.api.events.payout.signature;
                    for (var i = 0, numLogs = logs.length; i < numLogs; ++i) {
                        if (logs[i].topics[0] === sig) {
                            logdata = self.rpc.unmarshal(logs[i].data);
                            if (logdata && logdata.constructor === Array && logdata.length > 1) {
                                cashPayout = abi.unfix(abi.hex(logdata[0], true));
                                shares = abi.unfix(logdata[1]);
                            }
                        }
                    }
                }
                res.callReturn = {cash: cashPayout.toFixed(), shares: shares.toFixed()};
                onSuccess(res);
            });
        }, onFailed);
    }
};
