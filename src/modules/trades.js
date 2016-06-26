/**
 * Augur JavaScript API
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var clone = require("clone");
var abi = require("augur-abi");
var utils = require("../utilities");

module.exports = {

    makeTradeHash: function (max_value, max_amount, trade_ids, callback) {
        var tx = clone(this.tx.trades.makeTradeHash);
        tx.params = [abi.fix(max_value, "hex"), abi.fix(max_amount, "hex"), trade_ids];
        return this.fire(tx, callback);
    },

    commitTrade: function (hash, onSent, onSuccess, onFailed) {
        var tx = clone(this.tx.trades.commitTrade);
        var unpacked = utils.unpack(arguments[0], utils.labels(this.commitTrade), arguments);
        tx.params = unpacked.params;
        return this.transact.apply(this, [tx].concat(unpacked.cb));
    },

    setInitialTrade: function (id, onSent, onSuccess, onFailed) {
        var tx = clone(this.tx.trades.setInitialTrade);
        var unpacked = utils.unpack(arguments[0], utils.labels(this.setInitialTrade), arguments);
        tx.params = unpacked.params;
        return this.transact.apply(this, [tx].concat(unpacked.cb));
    },

    // getInitialTrade: function (id, callback) {
    //     var tx = clone(this.tx.trades.getInitialTrade);
    //     tx.params = id;
    //     return this.fire(tx, callback);
    // },

    zeroHash: function (onSent, onSuccess, onFailed) {
        var tx = clone(this.tx.trades.zeroHash);
        var unpacked = utils.unpack(arguments[0], utils.labels(this.zeroHash), arguments);
        return this.transact.apply(this, [tx].concat(unpacked.cb));
    },

    // checkHash: function (tradeHash, sender, callback) {
    //     var tx = clone(this.tx.trades.checkHash);
    //     tx.params = [tradeHash, sender];
    //     return this.fire(tx, callback);
    // },

    // getID: function (tradeID, callback) {
    //     var tx = clone(this.tx.trades.getID);
    //     tx.params = tradeID;
    //     return this.fire(tx, callback);
    // },

    saveTrade: function (trade_id, type, market, amount, price, sender, outcome, onSent, onSuccess, onFailed) {
        var tx = clone(this.tx.trades.saveTrade);
        var unpacked = utils.unpack(arguments[0], utils.labels(this.saveTrade), arguments);
        tx.params = unpacked.params;
        tx.params[3] = abi.fix(tx.params[3], "hex");
        tx.params[4] = abi.fix(tx.params[4], "hex");
        return this.transact.apply(this, [tx].concat(unpacked.cb));
    },

    get_trade: function (id, callback) {
        // trade = array(9)
        // trade[0] = self.trades[id].id
        // trade[1] = self.trades[id].type
        // trade[2] = self.trades[id].market
        // trade[3] = self.trades[id].amount
        // trade[4] = self.trades[id].price
        // trade[5] = self.trades[id].owner
        // trade[6] = self.trades[id].block
        // trade[7] = self.trades[id].outcome
        var self = this;
        var tx = clone(this.tx.trades.get_trade);
        tx.params = id;
        if (!utils.is_function(callback)) {
            var trade = this.fire(tx);
            if (!trade || trade.error) return trade;
            return this.parseTradeInfo(trade);
        }
        this.fire(tx, function (trade) {
            if (!trade || trade.error) return callback(trade);
            callback(self.parseTradeInfo(trade));
        });
    },

    // get_amount: function (id, callback) {
    //     var tx = clone(this.tx.trades.get_amount);
    //     tx.params = id;
    //     return this.fire(tx, callback);
    // },

    // get_price: function (id, callback) {
    //     var tx = clone(this.tx.trades.get_price);
    //     tx.params = id;
    //     return this.fire(tx, callback);
    // },

    update_trade: function (id, price, onSent, onSuccess, onFailed) {
        var tx = clone(this.tx.trades.update_trade);
        var unpacked = utils.unpack(arguments[0], utils.labels(this.update_trade), arguments);
        tx.params = unpacked.params;
        tx.params[1] = abi.fix(tx.params[1], "hex");
        return this.transact.apply(this, [tx].concat(unpacked.cb));
    },

    remove_trade: function (id, onSent, onSuccess, onFailed) {
        var tx = clone(this.tx.trades.remove_trade);
        var unpacked = utils.unpack(arguments[0], utils.labels(this.remove_trade), arguments);
        tx.params = unpacked.params;
        return this.transact.apply(this, [tx].concat(unpacked.cb));
    },

    fill_trade: function (id, fill, onSent, onSuccess, onFailed) {
        var tx = clone(this.tx.trades.fill_trade);
        var unpacked = utils.unpack(arguments[0], utils.labels(this.fill_trade), arguments);
        tx.params = unpacked.params;
        tx.params[1] = abi.fix(tx.params[1], "hex");
        return this.transact.apply(this, [tx].concat(unpacked.cb));
    }
};
