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

    // getNumEventsToReport: function (branch, period, callback) {
    //     var tx = clone(this.tx.getNumEventsToReport);
    //     tx.params = [branch, period];
    //     return this.fire(tx, callback);
    // },

    // getNumReportsActual: function (branch, reportPeriod, callback) {
    //     var tx = clone(this.tx.getNumReportsActual);
    //     tx.params = [branch, reportPeriod];
    //     return this.fire(tx, callback);
    // },

    // getSubmittedHash: function (branch, period, reporter, callback) {
    //     var tx = clone(this.tx.getSubmittedHash);
    //     tx.params = [branch, period, reporter];
    //     return this.fire(tx, callback);
    // },

    // getBeforeRep: function (branch, period, callback) {
    //     var tx = clone(this.tx.getBeforeRep);
    //     tx.params = [branch, period];
    //     return this.fire(tx, callback);
    // },

    // getAfterRep: function (branch, period, callback) {
    //     var tx = clone(this.tx.getAfterRep);
    //     tx.params = [branch, period];
    //     return this.fire(tx, callback);
    // },

    // getReport: function (branch, period, event, callback) {
    //     var tx = clone(this.tx.getReport);
    //     tx.params = [branch, period, event];
    //     return this.fire(tx, callback);
    // },

    // getRRUpToDate: function (callback) {
    //     return this.fire(clone(this.tx.getRRUpToDate), callback);
    // },

    // getNumReportsExpectedEvent: function (branch, reportPeriod, eventID, callback) {
    //     var tx = clone(this.tx.getNumReportsExpectedEvent);
    //     tx.params = [branch, reportPeriod, eventID];
    //     return this.fire(tx, callback);
    // },

    // getNumReportsEvent: function (branch, reportPeriod, eventID, callback) {
    //     var tx = clone(this.tx.getNumReportsEvent);
    //     tx.params = [branch, reportPeriod, eventID];
    //     return this.fire(tx, callback);
    // },

    makeHash: function (salt, report, event, from, isScalar) {
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

    makeHash_contract: function (salt, report, event, sender, isScalar, callback) {
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
        var tx = clone(this.tx.makeReports.makeHash);
        tx.params = [abi.hex(salt), fixedReport, event, sender];
        return this.fire(tx, callback);
    },

    submitReportHash: function (event, reportHash, onSent, onSuccess, onFailed) {
        var self = this;
        if (event.constructor === Object && event.event) {
            reportHash = event.reportHash;
            if (event.onSent) onSent = event.onSent;
            if (event.onSuccess) onSuccess = event.onSuccess;
            if (event.onFailed) onFailed = event.onFailed;
            event = event.event;
        }
        onSent = onSent || utils.pass;
        onSuccess = onSuccess || utils.pass;
        onFailed = onFailed || utils.pass;
        var tx = clone(this.tx.makeReports.submitReportHash);
        tx.params = [event, reportHash];
        return this.transact(tx, onSent, onSuccess, onFailed);
    },

    submitReport: function (event, salt, report, ethics, isScalar, onSent, onSuccess, onFailed) {
        var self = this;
        if (event.constructor === Object && event.event) {
            salt = event.salt;
            report = event.report;
            ethics = event.ethics;
            isScalar = event.isScalar;
            if (event.onSent) onSent = event.onSent;
            if (event.onSuccess) onSuccess = event.onSuccess;
            if (event.onFailed) onFailed = event.onFailed;
            event = event.event;
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
        var tx = clone(this.tx.makeReports.submitReport);
        tx.params = [
            event,
            abi.hex(salt),
            fixedReport,
            abi.fix(ethics, "hex")
        ];
        return this.transact(tx, onSent, onSuccess, onFailed);
    },

    validateReport: function (eventID, branch, reportPeriod, report, forkedOverEthicality, forkedOverThisEvent, roundTwo, balance, callback) {
        var tx = clone(this.tx.makeReports.validateReport);
        tx.params = [
            eventID,
            branch,
            reportPeriod,
            abi.fix(report, "hex"),
            forkedOverEthicality,
            forkedOverThisEvent,
            roundTwo,
            abi.fix(balance, "hex")
        ];
        return this.fire(tx, callback);
    }
};
