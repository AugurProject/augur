/**
 * Augur JavaScript API
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var clone = require("clone");
var abi = require("augur-abi");
var utils = require("../utilities");

module.exports = {

    proportionCorrect: function (event, branch, period, callback) {
        var tx = clone(this.tx.proportionCorrect);
        tx.params = [event, branch, period];
        return this.fire(tx, callback);
    },

    moveEventsToCurrentPeriod: function (branch, currentVotePeriod, currentPeriod, onSent, onSuccess, onFailed) {
        var tx = clone(this.tx.moveEventsToCurrentPeriod);
        var unpacked = utils.unpack(branch, utils.labels(this.moveEventsToCurrentPeriod), arguments);
        tx.params = unpacked.params;
        return this.transact.apply(this, [tx].concat(unpacked.cb));
    },

    incrementPeriodAfterReporting: function (branch, onSent, onSuccess, onFailed) {
        var tx = clone(this.tx.incrementPeriodAfterReporting);
        var unpacked = utils.unpack(branch, utils.labels(this.incrementPeriodAfterReporting), arguments);
        tx.params = unpacked.params;
        return this.transact.apply(this, [tx].concat(unpacked.cb));
    },

    penalizeNotEnoughReports: function (branch, onSent, onSuccess, onFailed) {
        var tx = clone(this.tx.penalizeNotEnoughReports);
        var unpacked = utils.unpack(branch, utils.labels(this.penalizeNotEnoughReports), arguments);
        tx.params = unpacked.params;
        return this.transact.apply(this, [tx].concat(unpacked.cb));
    },

    penalizeWrong: function (branch, event, onSent, onSuccess, onFailed) {
        var tx = clone(this.tx.penalizeWrong);
        var unpacked = utils.unpack(branch, utils.labels(this.penalizeWrong), arguments);
        tx.params = unpacked.params;
        return this.transact.apply(this, [tx].concat(unpacked.cb));
    },

    collectFees: function (branch, onSent, onSuccess, onFailed) {
        var tx = clone(this.tx.collectFees);
        var unpacked = utils.unpack(branch, utils.labels(this.collectFees), arguments);
        tx.params = unpacked.params;
        return this.transact.apply(this, [tx].concat(unpacked.cb));
    },

    penalizationCatchup: function (branch, onSent, onSuccess, onFailed) {
        var tx = clone(this.tx.penalizationCatchup);
        var unpacked = utils.unpack(branch, utils.labels(this.penalizationCatchup), arguments);
        tx.params = unpacked.params;
        return this.transact.apply(this, [tx].concat(unpacked.cb));
    },

    slashRep: function (branchId, salt, report, reporter, eventID, onSent, onSuccess, onFailed) {
        if (branchId.constructor === Object && branchId.branchId) {
            eventID = branchId.eventID;
            salt = branchId.salt;
            report = branchId.report;
            reporter = branchId.reporter;
            onSent = branchId.onSent;
            onSuccess = branchId.onSuccess;
            onFailed = branchId.onFailed;
            branchId = branchId.branchId;
        }
        var tx = clone(this.tx.slashRep);
        tx.params = [branchId, salt, abi.fix(report, "hex"), reporter, eventID];
        return this.transact(tx, onSent, onSuccess, onFailed);
    }
};
