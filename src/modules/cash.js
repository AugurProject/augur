/**
 * Augur JavaScript API
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var clone = require("clone");
var abi = require("augur-abi");
var utils = require("../utilities");
var constants = require("../constants");

module.exports = {

    sendEther: function (to, value, from, onSent, onSuccess, onFailed) {
        if (to && to.constructor === Object) {
            value = to.value;
            if (to.from) from = to.from;
            if (to.onSent) onSent = to.onSent;
            if (to.onSuccess) onSuccess = to.onSuccess;
            if (to.onFailed) onFailed = to.onFailed;
            to = to.to;
        }
        return this.transact({
            description: "Send Ether to " + to,
            label: "Send Ether",
            from: from,
            to: to,
            value: abi.fix(value, "hex"),
            returns: "null",
            gas: "0xcf08"
        }, onSent, onSuccess, onFailed);
    },

    depositEther: function (value, onSent, onSuccess, onFailed) {
        var tx = clone(this.tx.Cash.depositEther);
        var unpacked = utils.unpack(value, utils.labels(this.depositEther), arguments);
        tx.value = abi.fix(unpacked.params[0], "hex");
        return this.transact.apply(this, [tx].concat(unpacked.cb));
    },

    getCashBalance: function (account, callback) {
        return this.Cash.balance(account, callback);
    },

    sendCash: function (recver, value, onSent, onSuccess, onFailed) {
        return this.Cash.send(recver, value, onSent, onSuccess, onFailed);
    },

    sendCashFrom: function (recver, value, from, onSent, onSuccess, onFailed) {
        return this.Cash.sendFrom(recver, value, from, onSent, onSuccess, onFailed);
    }
};
