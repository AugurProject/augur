/**
 * Augur JavaScript API
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var clone = require("clone");
var abi = require("augur-abi");
var utils = require("../utilities");

module.exports = {

    getmode: function (event, callback) {
        // event: sha256 hash id
        var tx = clone(this.tx.getmode);
        tx.params = event;
        return this.fire(tx, callback);
    },

    getUncaughtOutcome: function (event, callback) {
        // event: sha256 hash id
        var tx = clone(this.tx.getUncaughtOutcome);
        tx.params = event;
        return this.fire(tx, callback);
    },

    getMarkets: function (eventID, callback) {
        // eventID: sha256 hash id
        var tx = clone(this.tx.getMarkets);
        tx.params = eventID;
        return this.fire(tx, callback);
    },

    getReportingThreshold: function (event, callback) {
        var tx = clone(this.tx.getReportingThreshold);
        tx.params = event;
        return this.fire(tx, callback);
    },

    getEventInfo: function (eventId, callback) {
        // eventId: sha256 hash id
        var self = this;
        var parse_info = function (info) {
            // eventinfo = string(7*32 + length)
            // eventinfo[0] = self.Events[event].branch
            // eventinfo[1] = self.Events[event].expirationDate 
            // eventinfo[2] = self.Events[event].outcome
            // eventinfo[3] = self.Events[event].minValue
            // eventinfo[4] = self.Events[event].maxValue
            // eventinfo[5] = self.Events[event].numOutcomes
            // eventinfo[6] = self.Events[event].bond
            // mcopy(eventinfo + 7*32, load(self.Events[event].resolutionSource[0], chars=length), length)
            if (info && info.length) {
                info[0] = abi.hex(info[0]);
                info[1] = abi.bignum(info[1]).toFixed();
                info[2] = abi.unfix(info[2], "string");
                info[3] = abi.unfix(info[3], "string");
                info[4] = abi.unfix(info[4], "string");
                info[5] = parseInt(info[5]);
                info[6] = abi.unfix(info[6], "string");
            }
            return info;
        };
        var tx = clone(this.tx.getEventInfo);
        tx.params = eventId;
        if (utils.is_function(callback)) {
            this.fire(tx, function (info) {
                callback(parse_info(info));
            });
        } else {
            return parse_info(this.fire(tx));
        }
    },

    getEventBranch: function (eventId, callback) {
        var tx = clone(this.tx.getEventBranch);
        tx.params = eventId;
        return this.fire(tx, callback);
    },

    getExpiration: function (eventId, callback) {
        var tx = clone(this.tx.getExpiration);
        tx.params = eventId;
        return this.fire(tx, callback);
    },

    getOutcome: function (eventId, callback) {
        var tx = clone(this.tx.getOutcome);
        tx.params = eventId;
        return this.fire(tx, callback);
    },

    getMinValue: function (eventId, callback) {
        var tx = clone(this.tx.getMinValue);
        tx.params = eventId;
        return this.fire(tx, callback);
    },

    getMaxValue: function (eventId, callback) {
        var tx = clone(this.tx.getMaxValue);
        tx.params = eventId;
        return this.fire(tx, callback);
    },

    getNumOutcomes: function (eventId, callback) {
        var tx = clone(this.tx.getNumOutcomes);
        tx.params = eventId;
        return this.fire(tx, callback);
    },

    setOutcome: function (ID, outcome, onSent, onSuccess, onFailed) {
        var tx = clone(this.tx.setOutcome);
        var unpacked = utils.unpack(ID, utils.labels(this.setOutcome), arguments);
        tx.params = unpacked.params;
        return this.transact.apply(this, [tx].concat(unpacked.cb));
    }

};
