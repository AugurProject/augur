/**
 * Augur JavaScript SDK
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var clone = require("clone");
var abi = require("augur-abi");
var constants = require("../constants");
var utils = require("../utilities");

module.exports = {

  parseLastBlockNumber: function (logs) {
    return parseInt(logs[logs.length - 1].blockNumber, 16);
  },

  getRegisterBlockNumber: function (account, options, callback) {
    var self = this;
    if (!callback && utils.is_function(options)) {
      callback = options;
      options = null;
    }
    options = options || {};
    if (!utils.is_function(callback)) {
      var logs = this.getLogs("registration", {sender: account});
      if (!logs || !logs.length) return null;
      return self.parseLastBlockNumber(logs);
    }
    this.getLogs("registration", {sender: account}, function (err, logs) {
      if (err) return callback(err);
      if (!logs || !logs.length) return callback(null, null);
      callback(null, self.parseLastBlockNumber(logs));
    });
  }
};
