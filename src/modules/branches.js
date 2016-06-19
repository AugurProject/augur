/**
 * Augur JavaScript API
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var clone = require("clone");
var utils = require("../utilities");

module.exports = {

    initDefaultBranch: function (onSent, onSuccess, onFailed) {
        var tx = clone(this.tx.initDefaultBranch);
        return this.transact(tx, onSent, onSuccess, onFailed);
    },

    getNumBranches: function (callback) {
        return this.fire(this.tx.getNumBranches, callback);
    },

    getBranches: function (callback) {
        return this.fire(this.tx.getBranches, callback);
    },

    getMarketsInBranch: function (branch, callback) {
        // branch: sha256 hash id
        var tx = clone(this.tx.getMarketsInBranch);
        tx.params = branch;
        return this.fire(tx, callback);
    },

    getPeriodLength: function (branch, callback) {
        // branch: sha256 hash id
        var tx = clone(this.tx.getPeriodLength);
        tx.params = branch;
        return this.fire(tx, callback);
    },

    getVotePeriod: function (branch, callback) {
        // branch: sha256 hash id
        var tx = clone(this.tx.getVotePeriod);
        tx.params = branch;
        return this.fire(tx, callback);
    },

    getReportPeriod: function (branch, callback) {
        // branch: sha256 hash id
        var tx = clone(this.tx.getReportPeriod);
        tx.params = branch;
        return this.fire(tx, callback);
    },

    getNumMarketsBranch: function (branch, callback) {
        // branch: sha256
        var tx = clone(this.tx.getNumMarketsBranch);
        tx.params = branch;
        return this.fire(tx, callback);
    },

    getNumMarkets: function (branch, callback) {
        // branch: sha256
        var tx = clone(this.tx.getNumMarketsBranch);
        tx.params = branch;
        return this.fire(tx, callback);
    },

    getMinTradingFee: function (branch, callback) {
        // branch: sha256
        var tx = clone(this.tx.getMinTradingFee);
        tx.params = branch;
        return this.fire(tx, callback);
    },

    getBranchByNum: function (branchNumber, callback) {
        // branchNumber: integer
        var tx = clone(this.tx.getBranchByNum);
        tx.params = branchNumber;
        return this.fire(tx, callback);
    },

    getCurrentPeriod: function (branch, callback) {
        var self = this;
        if (!utils.is_function(callback)) {
            return this.rpc.blockNumber() / parseInt(this.getPeriodLength(branch));
        }
        this.getPeriodLength(branch, function (periodLength) {
            self.rpc.blockNumber(function (blockNumber) {
                callback(parseInt(blockNumber) / parseInt(periodLength));
            });
        });
    }
};
