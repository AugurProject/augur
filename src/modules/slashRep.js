/**
 * Augur JavaScript API
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var clone = require("clone");
var abi = require("augur-abi");
var utils = require("../utilities");

module.exports = {
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
        var tx = clone(this.tx.SlashRep.slashRep);
        tx.params = [branchId, salt, abi.fix(report, "hex"), reporter, eventID];
        return this.transact(tx, onSent, onSuccess, onFailed);
    }
};
