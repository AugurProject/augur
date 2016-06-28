/**
 * Augur JavaScript API
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var clone = require("clone");
var abi = require("augur-abi");
var utils = require("../utilities");

module.exports = {
    
    setCash: function (address, balance, onSent, onSuccess, onFailed) {
        var tx = clone(this.tx.Cash.setCash);
        var unpacked = utils.unpack(address, utils.labels(this.setCash), arguments);
        tx.params = unpacked.params;
        tx.params[1] = abi.fix(tx.params[1], "hex");
        return this.transact.apply(this, [tx].concat(unpacked.cb));
    },
    
    addCash: function (ID, amount, onSent, onSuccess, onFailed) {
        var tx = clone(this.tx.Cash.addCash);
        var unpacked = utils.unpack(ID, utils.labels(this.addCash), arguments);
        tx.params = unpacked.params;
        tx.params[1] = abi.fix(tx.params[1], "hex");
        return this.transact.apply(this, [tx].concat(unpacked.cb));
    },
    
    getCashBalance: function (account, callback) {
        return this.Cash.balance(account, callback);
    },

    sendCash: function (to, value, onSent, onSuccess, onFailed) {
        // to: ethereum account
        // value: number -> fixed-point
        if (to && to.value !== null && to.value !== undefined) {
            value = to.value;
            if (to.onSent) onSent = to.onSent;
            if (to.onSuccess) onSuccess = to.onSuccess;
            if (to.onFailed) onFailed = to.onFailed;
            to = to.to;
        }
        var tx = clone(this.tx.Cash.send);
        tx.params = [to, abi.fix(value, "hex")];
        return this.transact(tx, onSent, onSuccess, onFailed);
    },

    sendCashFrom: function (to, value, from, onSent, onSuccess, onFailed) {
        // to: ethereum account
        // value: number -> fixed-point
        // from: ethereum account
        if (to && to.value) {
            value = to.value;
            from = to.from;
            if (to.onSent) onSent = to.onSent;
            if (to.onSuccess) onSuccess = to.onSuccess;
            if (to.onFailed) onFailed = to.onFailed;
            to = to.to;
        }
        var tx = clone(this.tx.Cash.sendFrom);
        tx.params = [to, abi.fix(value, "hex"), from];
        return this.transact(tx, onSent, onSuccess, onFailed);
    }
};
