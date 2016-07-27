/**
 * Augur JavaScript API
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var clone = require("clone");
var abi = require("augur-abi");

module.exports = {

    sendReputation: function (branch, recver, value, onSent, onSuccess, onFailed, onConfirmed) {
        // branch: hash id
        // recver: ethereum address of recipient
        // value: number -> fixed-point
        if (branch && branch.branch) {
            recver = branch.recver;
            value = branch.value;
            onSent = branch.onSent;
            onSuccess = branch.onSuccess;
            onFailed = branch.onFailed;
            onConfirmed = branch.onConfirmed;
            branch = branch.branch;
        }
        var tx = clone(this.tx.SendReputation.sendReputation);
        tx.params = [branch, recver, abi.fix(value, "hex")];
        return this.transact(tx, onSent, onSuccess, onFailed, onConfirmed);
    }
};
