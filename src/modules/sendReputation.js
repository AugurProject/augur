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
        if (branchId && branchId.branchId) {
            to = branchId.to;
            value = branchId.value;
            onSent = branchId.onSent;
            onSuccess = branchId.onSuccess;
            onFailed = branchId.onFailed;
            branchId = branchId.branchId;
        }
        var tx = clone(this.tx.SendReputation.sendReputation);
        tx.params = [branchId, to, abi.fix(value, "hex")];
        return this.transact(tx, onSent, onSuccess, onFailed);
    }
};
