/**
 * Augur JavaScript API
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var clone = require("clone");
var utils = require("../utilities");

module.exports = {

    getFees: function (market, callback) {
        var tx = clone(this.tx.getFees);
        tx.params = market;
        return this.fire(tx, callback);
    },

    getMakerFees: function (market, callback) {
        var tx = clone(this.tx.getMakerFees);
        tx.params = market;
        return this.fire(tx, callback);
    },

    getgasSubsidy: function (market, callback) {
        var tx = clone(this.tx.getgasSubsidy);
        tx.params = market;
        return this.fire(tx, callback);
    },

    getSharesValue: function (market, callback) {
        var tx = clone(this.tx.getSharesValue);
        tx.params = market;
        return this.fire(tx, callback);
    },

    get_total_trades: function (market_id, callback) {
        var tx = clone(this.tx.get_total_trades);
        tx.params = market_id;
        return this.fire(tx, callback);
    },

    get_trade_ids: function (market_id, callback) {
        var tx = clone(this.tx.get_trade_ids);
        tx.params = market_id;
        return this.fire(tx, callback);
    },

    getVolume: function (market, callback) {
        var tx = clone(this.tx.getVolume);
        tx.params = market;
        return this.fire(tx, callback);
    },

    getCreationTime: function (market, callback) {
        var tx = clone(this.tx.getCreationTime);
        tx.params = market;
        return this.fire(tx, callback);
    },

    getForkSelection: function (market, callback) {
        var tx = clone(this.tx.getForkSelection);
        tx.params = market;
        return this.fire(tx, callback);
    },

    getMarketEvents: function (market, callback) {
        // market: sha256 hash id
        var tx = clone(this.tx.getMarketEvents);
        tx.params = market;
        return this.fire(tx, callback);
    },

    getNumEvents: function (market, callback) {
        // market: sha256 hash id
        var tx = clone(this.tx.getNumEvents);
        tx.params = market;
        return this.fire(tx, callback);
    },

    getBranchID: function (market, callback) {
        // market: sha256 hash id
        var tx = clone(this.tx.getBranchID);
        tx.params = market;
        return this.fire(tx, callback);
    },

    // Get the current number of participants in this market
    getCurrentParticipantNumber: function (market, callback) {
        // market: hash id
        var tx = clone(this.tx.getCurrentParticipantNumber);
        tx.params = market;
        return this.fire(tx, callback);
    },

    getMarketNumOutcomes: function (market, callback) {
        // market: hash id
        var tx = clone(this.tx.getMarketNumOutcomes);
        tx.params = market;
        return this.fire(tx, callback);
    },

    getCumScale: function (market, callback) {
        // market: hash id
        var tx = clone(this.tx.getCumScale);
        tx.params = market;
        return this.fire(tx, callback);
    },

    getTradingPeriod: function (market, callback) {
        // market: hash id
        var tx = clone(this.tx.getTradingPeriod);
        tx.params = market;
        return this.fire(tx, callback);
    },

    getTradingFee: function (market, callback) {
        // market: hash id
        var tx = clone(this.tx.getTradingFee);
        tx.params = market;
        return this.fire(tx, callback);
    },

    getWinningOutcomes: function (market, callback) {
        // market: hash id
        var self = this;
        var tx = clone(this.tx.getWinningOutcomes);
        tx.params = market;
        if (!utils.is_function(callback)) {
            var winningOutcomes = this.fire(tx);
            if (!winningOutcomes) return null;
            if (winningOutcomes.error || winningOutcomes.constructor !== Array) {
                return winningOutcomes;
            }
            return winningOutcomes.slice(0, this.getMarketNumOutcomes(market));
        }
        this.fire(tx, function (winningOutcomes) {
            if (!winningOutcomes) return callback(null);
            if (winningOutcomes.error || winningOutcomes.constructor !== Array) {
                return callback(winningOutcomes);
            }
            self.getMarketNumOutcomes(market, function (numOutcomes) {
                if (numOutcomes && numOutcomes.error) {
                    return callback(numOutcomes);
                }
                callback(winningOutcomes.slice(0, numOutcomes));
            });
        });
    },

    initialLiquidityAmount: function (market, outcome, callback) {
        var tx = clone(this.tx.initialLiquidityAmount);
        tx.params = [market, outcome];
        return this.fire(tx, callback);
    },

    getSharesPurchased: function (market, outcome, callback) {
        // market: hash id
        var tx = clone(this.tx.getSharesPurchased);
        tx.params = [market, outcome];
        return this.fire(tx, callback);
    },

    getParticipantSharesPurchased: function (market, participantNumber, outcome, callback) {
        // market: hash id
        var tx = clone(this.tx.getParticipantSharesPurchased);
        tx.params = [market, participantNumber, outcome];
        return this.fire(tx, callback);
    },

    // Get the participant number (the array index) for specified address
    getParticipantNumber: function (market, address, callback) {
        // market: hash id
        // address: ethereum account
        var tx = clone(this.tx.getParticipantNumber);
        tx.params = [market, address];
        return this.fire(tx, callback);
    },

    // Get the address for the specified participant number (array index) 
    getParticipantID: function (market, participantNumber, callback) {
        // market: hash id
        var tx = clone(this.tx.getParticipantID);
        tx.params = [market, participantNumber];
        return this.fire(tx, callback);
    }
};
