/**
 * Augur JavaScript API
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var clone = require("clone");

module.exports = {

    // getRepBalance: function (branch, account, callback) {
    //     // branch: sha256 hash id
    //     // account: ethereum address (hexstring)
    //     var tx = clone(this.tx.getRepBalance);
    //     tx.params = [branch, account || this.from];
    //     return this.fire(tx, callback);
    // },

    // getRepByIndex: function (branch, repIndex, callback) {
    //     // branch: sha256
    //     // repIndex: integer
    //     var tx = clone(this.tx.getRepByIndex);
    //     tx.params = [branch, repIndex];
    //     return this.fire(tx, callback);
    // },

    // getReporterID: function (branch, index, callback) {
    //     // branch: sha256
    //     // index: integer
    //     var tx = clone(this.tx.getReporterID);
    //     tx.params = [branch, index];
    //     return this.fire(tx, callback);
    // },

    // getNumberReporters: function (branch, callback) {
    //     // branch: sha256
    //     var tx = clone(this.tx.getNumberReporters);
    //     tx.params = branch;
    //     return this.fire(tx, callback);
    // },

    // repIDToIndex: function (branch, repID, callback) {
    //     // branch: sha256
    //     // repID: ethereum account
    //     var tx = clone(this.tx.repIDToIndex);
    //     tx.params = [branch, repID];
    //     return this.fire(tx, callback);
    // },

    // getTotalRep: function (branch, callback) {
    //     var tx = clone(this.tx.getTotalRep);
    //     tx.params = branch;
    //     return this.fire(tx, callback);
    // }
};
