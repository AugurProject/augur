/**
 * Augur JavaScript API
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var clone = require("clone");
var abi = require("augur-abi");
var contracts = require("augur-contracts");
var utils = require("../utilities");

module.exports = {

    getNumEventsToReport: function (branch, period, callback) {
        var tx = clone(this.tx.getNumEventsToReport);
        tx.params = [branch, period];
        return this.fire(tx, callback);
    },

    getNumReportsActual: function (branch, reportPeriod, callback) {
        var tx = clone(this.tx.getNumReportsActual);
        tx.params = [branch, reportPeriod];
        return this.fire(tx, callback);
    },

    getSubmittedHash: function (branch, period, reporter, callback) {
        var tx = clone(this.tx.getSubmittedHash);
        tx.params = [branch, period, reporter];
        return this.fire(tx, callback);
    },

    getBeforeRep: function (branch, period, callback) {
        var tx = clone(this.tx.getBeforeRep);
        tx.params = [branch, period];
        return this.fire(tx, callback);
    },

    getAfterRep: function (branch, period, callback) {
        var tx = clone(this.tx.getAfterRep);
        tx.params = [branch, period];
        return this.fire(tx, callback);
    },

    getReport: function (branch, period, event, callback) {
        var tx = clone(this.tx.getReport);
        tx.params = [branch, period, event];
        return this.fire(tx, callback);
    },

    getRRUpToDate: function (callback) {
        return this.fire(clone(this.tx.getRRUpToDate), callback);
    },

    getNumReportsExpectedEvent: function (branch, reportPeriod, eventID, callback) {
        var tx = clone(this.tx.getNumReportsExpectedEvent);
        tx.params = [branch, reportPeriod, eventID];
        return this.fire(tx, callback);
    },

    getNumReportsEvent: function (branch, reportPeriod, eventID, callback) {
        var tx = clone(this.tx.getNumReportsEvent);
        tx.params = [branch, reportPeriod, eventID];
        return this.fire(tx, callback);
    },

    makeHash: function (salt, report, event, from, indeterminate, isScalar) {
        var fixedReport;
        if (isScalar && report === "0") {
            fixedReport = "0x1";
        } else {
            fixedReport = abi.fix(report, "hex");
        }
        return utils.sha3([
            from || this.from,
            abi.hex(salt),
            fixedReport,
            event
        ]);
    },

    makeHash_contract: function (salt, report, event, sender, indeterminate, isScalar, callback) {
        if (salt.constructor === Object && salt.salt) {
            report = salt.report;
            event = salt.event;
            if (salt.callback) callback = salt.callback;
            salt = salt.salt;
        }
        var fixedReport;
        if (isScalar && report === "0") {
            fixedReport = "0x1";
        } else {
            fixedReport = abi.fix(report, "hex");
        }
        var tx = clone(this.tx.makeHash);
        tx.params = [abi.hex(salt), fixedReport, event, sender];
        return this.fire(tx, callback);
    },

    calculateReportingThreshold: function (branch, eventID, reportPeriod, callback) {
        var tx = clone(this.tx.calculateReportingThreshold);
        tx.params = [branch, eventID, reportPeriod];
        return this.fire(tx, callback);
    },

    submitReportHash: function (branch, reportHash, reportPeriod, eventID, eventIndex, onSent, onSuccess, onFailed) {
        var self = this;
        if (branch.constructor === Object && branch.branch) {
            reportHash = branch.reportHash;
            reportPeriod = branch.reportPeriod;
            eventID = branch.eventID;
            eventIndex = branch.eventIndex;
            if (branch.onSent) onSent = branch.onSent;
            if (branch.onSuccess) onSuccess = branch.onSuccess;
            if (branch.onFailed) onFailed = branch.onFailed;
            branch = branch.branch;
        }
        onSent = onSent || utils.pass;
        onSuccess = onSuccess || utils.pass;
        onFailed = onFailed || utils.pass;
        var tx = clone(this.tx.submitReportHash);
        if (eventIndex !== null && eventIndex !== undefined) {
            tx.params = [branch, reportHash, reportPeriod, eventID, eventIndex];
            return this.transact(tx, onSent, onSuccess, onFailed);
        }
        this.getEventIndex(reportPeriod, eventID, function (eventIndex) {
            if (!eventIndex) return onFailed("couldn't get event index for " + eventID);
            if (eventIndex.error) return onFailed(eventIndex);
            tx.params = [branch, reportHash, reportPeriod, eventID, eventIndex];
            self.transact(tx, onSent, onSuccess, onFailed);
        });
    },

    submitReport: function (branch, reportPeriod, eventIndex, salt, report, eventID, ethics, isScalar, onSent, onSuccess, onFailed) {
        var self = this;
        if (branch.constructor === Object && branch.branch) {
            reportPeriod = branch.reportPeriod;
            eventIndex = branch.eventIndex;
            salt = branch.salt;
            report = branch.report;
            eventID = branch.eventID;
            ethics = branch.ethics;
            isScalar = branch.isScalar;
            if (branch.onSent) onSent = branch.onSent;
            if (branch.onSuccess) onSuccess = branch.onSuccess;
            if (branch.onFailed) onFailed = branch.onFailed;
            branch = branch.branch;
        }
        onSent = onSent || utils.pass;
        onSuccess = onSuccess || utils.pass;
        onFailed = onFailed || utils.pass;
        var fixedReport;
        if (isScalar && report === "0") {
            fixedReport = "0x1";
        } else {
            fixedReport = abi.fix(report, "hex");
        }
        var tx = clone(this.tx.submitReport);
        if (eventIndex !== null && eventIndex !== undefined) {
            tx.params = [
                branch,
                reportPeriod,
                eventIndex,
                abi.hex(salt),
                fixedReport,
                eventID,
                abi.fix(ethics, "hex")
            ];
            return this.transact(tx, onSent, onSuccess, onFailed);
        }
        this.getEventIndex(reportPeriod, eventID, function (eventIndex) {
            if (!eventIndex) return onFailed("couldn't get event index for " + eventID);
            if (eventIndex.error) return onFailed(eventIndex);
            tx.params = [
                branch,
                reportPeriod,
                eventIndex,
                abi.hex(salt),
                fixedReport,
                eventID,
                abi.fix(ethics, "hex")
            ];
            self.transact(tx, onSent, onSuccess, onFailed);
        });
    },

    checkReportValidity: function (branch, report, reportPeriod, callback) {
        var tx = clone(this.tx.checkReportValidity);
        tx.params = [branch, abi.fix(report, "hex"), reportPeriod];
        return this.fire(tx, callback);
    }
};
