/**
 * Augur JavaScript API
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var clone = require("clone");

module.exports = {

    getEventIndex: function (period, eventID, callback) {
        var tx = clone(this.tx.getEventIndex);
        tx.params = [period, eventID];
        return this.fire(tx, callback);
    },

    getEvents: function (branch, reportPeriod, callback) {
        // reportPeriod: integer
        var tx = clone(this.tx.getEvents);
        tx.params = [branch, reportPeriod];
        return this.fire(tx, callback);
    },

    getNumberEvents: function (branch, reportPeriod, callback) {
        // reportPeriod: integer
        var tx = clone(this.tx.getNumberEvents);
        tx.params = [branch, reportPeriod];
        return this.fire(tx, callback);
    },

    getEvent: function (branch, reportPeriod, eventIndex, callback) {
        // reportPeriod: integer
        var tx = clone(this.tx.getEvent);
        tx.params = [branch, reportPeriod, eventIndex];
        return this.fire(tx, callback);
    },

    getTotalRepReported: function (branch, reportPeriod, callback) {
        // reportPeriod: integer
        var tx = clone(this.tx.getTotalRepReported);
        tx.params = [branch, reportPeriod];
        return this.fire(tx, callback);
    },

    getReport: function (branch, reportPeriod, eventId, callback) {
        // reportPeriod: integer
        var tx = clone(this.tx.getReport);
        tx.params = [branch, reportPeriod, eventId];
        return this.fire(tx, callback);
    },

    getReportHash: function (branch, reportPeriod, reporter, event, callback) {
        // reportPeriod: integer
        var tx = clone(this.tx.getReportHash);
        tx.params = [branch, reportPeriod, reporter, event];
        return this.fire(tx, callback);
    }

};
