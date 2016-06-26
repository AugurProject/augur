/**
 * Augur JavaScript API
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var clone = require("clone");
var abi = require("augur-abi");

module.exports = {

    sendReputation: function (branchId, to, value, onSent, onSuccess, onFailed) {
        // branchId: hash id
        // to: ethereum address of recipient
        // value: number -> fixed-point
        if (branchId && branchId.branchId && branchId.to && branchId.value) {
            to = branchId.to;
            value = branchId.value;
            if (branchId.onSent) onSent = branchId.onSent;
            if (branchId.onSuccess) onSuccess = branchId.onSuccess;
            if (branchId.onFailed) onFailed = branchId.onFailed;
            branchId = branchId.branchId;
        }
        var tx = clone(this.tx.sendReputation.sendReputation);
        tx.params = [branchId, to, abi.fix(value, "hex")];
        return this.transact(tx, onSent, onSuccess, onFailed);
    }
};
