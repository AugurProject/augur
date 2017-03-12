/**
 * Augur JavaScript SDK
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var utils = require("../utilities");

module.exports = {

  parseLastBlockNumber: function (logs) {
    return logs[logs.length - 1].blockNumber;
  },

  getRegisterBlockNumber: function (account, options, callback) {
    var logs, self = this;
    if (!callback && utils.is_function(options)) {
      callback = options;
      options = null;
    }
    options = options || {};
    if (!utils.is_function(callback)) {
      logs = this.getLogs("registration", {sender: account});
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
