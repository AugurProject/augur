/**
 * Augur JavaScript API
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var clone = require("clone");

module.exports = {

    reputationFaucet: function (branch, onSent, onSuccess, onFailed) {
        if (branch && branch.constructor === Object && branch.branch) {
            if (branch.onSuccess) onSuccess = branch.onSuccess;
            if (branch.onFailed) onFailed = branch.onFailed;
            if (branch.onSent) onSent = branch.onSent;
            branch = branch.branch;
        }
        var tx = clone(this.tx.reputationFaucet);
        tx.params = branch;
        return this.transact(tx, onSent, onSuccess, onFailed);
    },

    cashFaucet: function (onSent, onSuccess, onFailed) {
        if (onSent && onSent.constructor === Object && onSent.onSent) {
            if (onSent.onSuccess) onSuccess = onSent.onSuccess;
            if (onSent.onFailed) onFailed = onSent.onFailed;
            if (onSent.onSent) onSent = onSent.onSent;
        }
        return this.transact(clone(this.tx.cashFaucet), onSent, onSuccess, onFailed);
    },

    fundNewAccount: function (branch, onSent, onSuccess, onFailed) {
        if (branch && branch.constructor === Object && branch.branch) {
            if (branch.onSuccess) onSuccess = branch.onSuccess;
            if (branch.onFailed) onFailed = branch.onFailed;
            if (branch.onSent) onSent = branch.onSent;
            branch = branch.branch;
        }
        var tx = clone(this.tx.fundNewAccount);
        tx.params = branch;
        return this.transact(tx, onSent, onSuccess, onFailed);
    }
};
