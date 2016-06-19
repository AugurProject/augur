/**
 * Augur JavaScript API
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var clone = require("clone");

module.exports = {

    getCreator: function (id, callback) {
        var tx = clone(this.tx.getCreator);
        tx.params = id;
        return this.fire(tx, callback);
    },

    getCreationFee: function (id, callback) {
        var tx = clone(this.tx.getCreationFee);
        tx.params = id;
        return this.fire(tx, callback);
    },

    getDescription: function (item, callback) {
        // item: hash id
        var tx = clone(this.tx.getDescription);
        tx.params = item;
        return this.fire(tx, callback);
    }
};
