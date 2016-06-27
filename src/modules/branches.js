/**
 * Augur JavaScript API
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var clone = require("clone");
var utils = require("../utilities");

module.exports = {

    getCurrentPeriod: function (branch, callback) {
        var self = this;
        if (!utils.is_function(callback)) {
            return new Date().getTime() / 1000 / parseInt(this.getPeriodLength(branch));
        }
        this.getPeriodLength(branch, function (periodLength) {
            callback(new Date().getTime() / 1000 / parseInt(periodLength));
        });
    }
};
