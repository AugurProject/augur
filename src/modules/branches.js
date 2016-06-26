/**
 * Augur JavaScript API
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var clone = require("clone");
var utils = require("../utilities");

module.exports = {

    initDefaultBranch: function (onSent, onSuccess, onFailed) {
        var tx = clone(this.tx.branches.initDefaultBranch);
        return this.transact(tx, onSent, onSuccess, onFailed);
    },

    // getNumBranches: function (callback) {
    //     return this.fire(this.tx.branches.getNumBranches, callback);
    // },

    // getBranches: function (callback) {
    //     return this.fire(this.tx.branches.getBranches, callback);
    // },

    // getMarketsInBranch: function (branch, callback) {
    //     // branch: sha256 hash id
    //     var tx = clone(this.tx.branches.getMarketsInBranch);
    //     tx.params = branch;
    //     return this.fire(tx, callback);
    // },

    // getPeriodLength: function (branch, callback) {
    //     // branch: sha256 hash id
    //     var tx = clone(this.tx.branches.getPeriodLength);
    //     tx.params = branch;
    //     return this.fire(tx, callback);
    // },

    // getVotePeriod: function (branch, callback) {
    //     // branch: sha256 hash id
    //     var tx = clone(this.tx.branches.getVotePeriod);
    //     tx.params = branch;
    //     return this.fire(tx, callback);
    // },

    // getReportPeriod: function (branch, callback) {
    //     // branch: sha256 hash id
    //     var tx = clone(this.tx.branches.getReportPeriod);
    //     tx.params = branch;
    //     return this.fire(tx, callback);
    // },

    // getNumMarketsBranch: function (branch, callback) {
    //     // branch: sha256
    //     var tx = clone(this.tx.branches.getNumMarketsBranch);
    //     tx.params = branch;
    //     return this.fire(tx, callback);
    // },

    // getNumMarkets: function (branch, callback) {
    //     // branch: sha256
    //     var tx = clone(this.tx.branches.getNumMarketsBranch);
    //     tx.params = branch;
    //     return this.fire(tx, callback);
    // },

    // getMinTradingFee: function (branch, callback) {
    //     // branch: sha256
    //     var tx = clone(this.tx.branches.getMinTradingFee);
    //     tx.params = branch;
    //     return this.fire(tx, callback);
    // },

    // getBranchByNum: function (branchNumber, callback) {
    //     // branchNumber: integer
    //     var tx = clone(this.tx.branches.getBranchByNum);
    //     tx.params = branchNumber;
    //     return this.fire(tx, callback);
    // },

    getCurrentPeriod: function (branch, callback) {
        var self = this;
        if (!utils.is_function(callback)) {
            return new Date().getTime() / 1000 / parseInt(this.getPeriodLength(branch));
        }
        this.getPeriodLength(branch, function (periodLength) {
            callback(new Date().getTime() / 1000 / parseInt(periodLength));
        });
    }
};
