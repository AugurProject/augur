/**
 * Augur JavaScript API
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var clone = require("clone");
var abi = require("augur-abi");
var keys = require("keythereum");
var contracts = require("augur-contracts");
var utils = require("../utilities");
var constants = require("../constants");

module.exports = {

    // rules: http://docs.augur.net/#reporting-outcomes
    fixReport: function (report, isScalar, isIndeterminate) {
        var fixedReport;
        if (isIndeterminate) {
            fixedReport = constants.INDETERMINATE;
        } else {
            if (isScalar && report === "0") {
                fixedReport = "0x1";
            } else {
                fixedReport = abi.fix(report, "hex");
            }

            // if report is equal to fix(1.5) but is not indeterminate,
            // then set report to fix(1.5) + 1
            if (fixedReport === constants.INDETERMINATE) {
                fixedReport = constants.INDETERMINATE_PLUS_ONE;
            }
        }
        return fixedReport;
    },

    // report in fixed-point
    makeHash: function (salt, report, event, from) {
        return utils.sha3([from || this.from, abi.hex(salt), report, event]);
    },

    // report in fixed-point
    encryptReport: function (report, key, salt) {
        if (!Buffer.isBuffer(report)) report = new Buffer(abi.pad_left(abi.hex(report)), "hex");
        if (!Buffer.isBuffer(key)) key = new Buffer(abi.pad_left(abi.hex(key)), "hex");
        if (!Buffer.isBuffer(salt)) salt = new Buffer(abi.pad_left(abi.hex(salt)), "hex");
        return abi.prefix_hex(new Buffer(keys.encrypt(report, key, salt.slice(0, 16), constants.REPORT_CIPHER), "base64").toString("hex"));
    },

    // returns plaintext fixed-point report
    decryptReport: function (encryptedReport, key, salt) {
        if (!Buffer.isBuffer(encryptedReport)) encryptedReport = new Buffer(abi.pad_left(abi.hex(encryptedReport)), "hex");
        if (!Buffer.isBuffer(key)) key = new Buffer(abi.pad_left(abi.hex(key)), "hex");
        if (!Buffer.isBuffer(salt)) salt = new Buffer(abi.pad_left(abi.hex(salt)), "hex");
        return abi.prefix_hex(keys.decrypt(encryptedReport, key, salt.slice(0, 16), constants.REPORT_CIPHER));
    },

    parseAndDecryptReport: function (arr, secret) {
        if (!arr || arr.constructor !== Array || arr.length < 2) return null;
        var salt = this.decryptReport(arr[1], secret.derivedKey, secret.salt);
        return {
            salt: salt,
            report: abi.string(this.decryptReport(arr[0], secret.derivedKey, salt))
        };
    },

    getAndDecryptReport: function (branch, expDateIndex, reporter, event, secret, callback) {
        var self = this;
        if (branch.constructor === Object) {
            expDateIndex = branch.expDateIndex;
            reporter = branch.reporter;
            event = branch.event;
            secret = branch.secret;
            callback = callback || branch.callback;
            branch = branch.branch;
        }
        var tx = clone(this.tx.ExpiringEvents.getEncryptedReport);
        tx.params = [branch, expDateIndex, reporter, event];
        return this.fire(tx, callback, this.parseAndDecryptReport, secret);
    },

    submitReportHash: function (event, reportHash, encryptedReport, encryptedSalt, branch, period, periodLength, onSent, onSuccess, onFailed, onConfirmed) {
        var self = this;
        if (event.constructor === Object) {
            reportHash = event.reportHash;
            encryptedReport = event.encryptedReport;
            encryptedSalt = event.encryptedSalt;
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
        tx.params = [event, reportHash, encryptedReport || 0, encryptedSalt || 0];
        return this.transact(tx, onSent, function (res) {
            res.callReturn = abi.bignum(res.callReturn, "string", true);
            if (res.callReturn === "0") {
                return self.checkVotePeriod(branch, periodLength, function (err, newPeriod) {
                    if (err) return onFailed(err);
                    return self.submitReportHash({
                        event: event,
                        reportHash: reportHash,
                        encryptedReport: encryptedReport,
                        encryptedSalt: encryptedSalt,
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

    submitReport: function (event, salt, report, ethics, isScalar, isIndeterminate, onSent, onSuccess, onFailed, onConfirmed) {
        if (event.constructor === Object) {
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
        var tx = clone(this.tx.MakeReports.submitReport);
        tx.params = [
            event,
            abi.hex(salt),
            this.fixReport(report, isScalar, isIndeterminate),
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
