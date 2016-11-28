/**
 * Augur JavaScript API
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var BigNumber = require("bignumber.js");
var clone = require("clone");
var abi = require("augur-abi");
var utils = require("../utilities");

module.exports = {

    collectFees: function (branch, sender, periodLength, onSent, onSuccess, onFailed) {
        var self = this;
        if (branch && branch.constructor === Object) {
            sender = branch.sender;
            periodLength = branch.periodLength;
            onSent = branch.onSent;
            onSuccess = branch.onSuccess;
            onFailed = branch.onFailed;
            branch = branch.branch;
        }
        if (this.getCurrentPeriodProgress(periodLength) < 50) {
            return onFailed({
                "-2": "needs to be second half of reporting period to claim rep"
            });
        }
        var tx = clone(this.tx.CollectFees.collectFees);
        tx.params = [branch, sender];
        this.rpc.getGasPrice(function (gasPrice) {
            tx.gasPrice = gasPrice;
            tx.value = abi.prefix_hex(new BigNumber("500000", 10).times(new BigNumber(gasPrice, 16)).toString(16));
            var prepare = function (res, cb) {
                // if (self.options.debug.reporting) {
                    console.log("collectFees success:", JSON.stringify(res, null, 2));
                // }
                if (res && (res.callReturn === "1" || res.callReturn === "2")) {
                    return cb(res);
                }
                self.Branches.getVotePeriod(branch, function (period) {
                    self.ConsensusData.getFeesCollected(branch, sender, period - 1, function (feesCollected) {
                        if (feesCollected !== "1") {
                            res.callReturn = "2";
                            return cb(res);
                        }
                        self.ExpiringEvents.getAfterRep(branch, period - 1, sender, function (afterRep) {
                            if (parseInt(afterRep, 10) <= 1) {
                                res.callReturn = "2";
                                return cb(res);
                            }
                            res.callReturn = "1";
                            return cb(res);
                        });
                    });
                });
            };
            // if (self.options.debug.reporting) {
                console.log("collectFees tx:", JSON.stringify(tx, null, 2));
            // }
            return self.transact(tx, onSent, utils.compose(prepare, onSuccess), onFailed);
        });
    }
};
