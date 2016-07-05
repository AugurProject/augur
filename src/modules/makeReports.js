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

    submitReport: function (event, salt, report, ethics, isScalar, onSent, onSuccess, onFailed) {
        var self = this;
        if (event.constructor === Object && event.event) {
            salt = event.salt;
            report = event.report;
            ethics = event.ethics;
            isScalar = event.isScalar;
            onSent = event.onSent;
            onSuccess = event.onSuccess;
            onFailed = event.onFailed;
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
        console.log("submitReport tx:", tx.params);
        return this.transact(tx, onSent, onSuccess, onFailed);
    },

    validateReport: function (eventID, branch, reportPeriod, report, forkedOverEthicality, forkedOverThisEvent, roundTwo, balance, callback) {
        var tx = clone(this.tx.MakeReports.validateReport);
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
