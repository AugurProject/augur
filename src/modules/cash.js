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
        var tx = clone(this.tx.setCash);
        var unpacked = utils.unpack(address, utils.labels(this.setCash), arguments);
        tx.params = unpacked.params;
        tx.params[1] = abi.fix(tx.params[1], "hex");
        return this.transact.apply(this, [tx].concat(unpacked.cb));
    },
    
    addCash: function (ID, amount, onSent, onSuccess, onFailed) {
        var tx = clone(this.tx.addCash);
        var unpacked = utils.unpack(ID, utils.labels(this.addCash), arguments);
        tx.params = unpacked.params;
        tx.params[1] = abi.fix(tx.params[1], "hex");
        return this.transact.apply(this, [tx].concat(unpacked.cb));
    },
    
    initiateOwner: function (account, onSent, onSuccess, onFailed) {
        // account: ethereum account
        if (account && account.account) {
            if (account.onSent) onSent = account.onSent;
            if (account.onSuccess) onSuccess = account.onSuccess;
            if (account.onFailed) onFailed = account.onFailed;
            account = account.account;
        }
        var tx = clone(this.tx.initiateOwner);
        tx.params = account;
        return this.transact(tx, onSent, onSuccess, onFailed);
    },

    getCashBalance: function (account, callback) {
        // account: ethereum account
        var tx = clone(this.tx.getCashBalance);
        tx.params = account || this.from;
        return this.fire(tx, callback);
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
        var tx = clone(this.tx.sendCash);
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
        var tx = clone(this.tx.sendCashFrom);
        tx.params = [to, abi.fix(value, "hex"), from];
        return this.transact(tx, onSent, onSuccess, onFailed);
    },

    depositEther: function (value, onSent, onSuccess, onFailed) {
        // value: amount of ether to exchange for cash (in ETHER, not wei!)
        if (value && value.value) {
            if (value.onSent) onSent = value.onSent;
            if (value.onSuccess) onSuccess = value.onSuccess;
            if (value.onFailed) onFailed = value.onFailed;
            value = value.value;
        }
        var tx = clone(this.tx.depositEther);
        tx.value = abi.prefix_hex(abi.bignum(value).mul(this.rpc.ETHER).toString(16));
        return this.transact(tx, onSent, onSuccess, onFailed);
    },

    withdrawEther: function (to, value, onSent, onSuccess, onFailed) {
        var tx = clone(this.tx.withdrawEther);
        var unpacked = utils.unpack(to, utils.labels(this.withdrawEther), arguments);
        tx.params = unpacked.params;
        tx.params[1] = abi.prefix_hex(abi.bignum(tx.params[1]).mul(this.rpc.ETHER).toString(16));
        return this.transact.apply(this, [tx].concat(unpacked.cb));
    }
};
