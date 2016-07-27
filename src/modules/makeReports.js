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

    submitReportHash: function (event, reportHash, encryptedSaltyHash, branch, period, periodLength, onSent, onSuccess, onFailed, onConfirmed) {
        var self = this;
        if (event.constructor === Object && event.event) {
            reportHash = event.reportHash;
            encryptedSaltyHash = event.encryptedSaltyHash;
            branch = event.branch;
            period = event.period;
            periodLength = event.periodLength;
            onSent = event.onSent;
            onSuccess = event.onSuccess;
            onFailed = event.onFailed;
            onConfirmed = event.onConfirmed;
            event = event.event;
        }
        if (this.getCurrentPeriodProgress(periodLength) >= 50) {
            return onFailed({"-2": "not in first half of period (commit phase)"});
        }
        var tx = clone(this.tx.MakeReports.submitReportHash);
        tx.params = [event, reportHash, encryptedSaltyHash || 0];
        return this.transact(tx, onSent, function (res) {
            res.callReturn = abi.bignum(res.callReturn, "string", true);
            if (res.callReturn === "0") {
                return self.checkVotePeriod(branch, periodLength, function (err, newPeriod) {
                    if (err) return onFailed(err);
                    return self.submitReportHash({
                        event: event,
                        reportHash: reportHash,
                        encryptedSaltyHash: encryptedSaltyHash,
                        branch: branch,
                        period: period,
                        periodLength: periodLength,
                        onSent: onSent,
                        onSuccess: onSuccess,
                        onFailed: onFailed,
                        onConfirmed: onConfirmed
                    });
                });
            }
            if (res.callReturn !== "-2") return onSuccess(res);
            self.ExpiringEvents.getReportHash({
                branch: branch,
                expDateIndex: period,
                reporter: res.from,
                event: event,
                callback: function (storedReportHash) {
                    if (parseInt(storedReportHash, 16)) {
                        res.callReturn = "1";
                    }
                    onSuccess(res);
                }
            });
        }, onFailed, onConfirmed);
    },

    submitReport: function (event, salt, report, ethics, isScalar, onSent, onSuccess, onFailed, onConfirmed) {
        if (event.constructor === Object && event.event) {
            salt = event.salt;
            report = event.report;
            ethics = event.ethics;
            isScalar = event.isScalar;
            onSent = event.onSent;
            onSuccess = event.onSuccess;
            onFailed = event.onFailed;
            onConfirmed = event.onConfirmed;
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
        var tx = clone(this.tx.MakeReports.submitReport);
        tx.params = [
            event,
            abi.hex(salt),
            fixedReport,
            abi.fix(ethics, "hex")
        ];
        return this.transact(tx, onSent, onSuccess, onFailed, onConfirmed);
    },

    validateReport: function (eventID, branch, votePeriod, report, forkedOverEthicality, forkedOverThisEvent, roundTwo, balance, callback) {
        var tx = clone(this.tx.MakeReports.validateReport);
        tx.params = [
            eventID,
            branch,
            votePeriod,
            abi.fix(report, "hex"),
            forkedOverEthicality,
            forkedOverThisEvent,
            roundTwo,
            abi.fix(balance, "hex")
        ];
        return this.fire(tx, callback);
    }
};
