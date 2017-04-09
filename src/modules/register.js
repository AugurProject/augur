"use strict";

var isFunction = require("../utils/is-function");

module.exports = {

  parseLastBlockNumber: function (logs) {
    return logs[logs.length - 1].blockNumber;
  },

  getRegisterBlockNumber: function (account, options, callback) {
    var logs, self = this;
    if (!callback && isFunction(options)) {
      callback = options;
      options = null;
    }
    options = options || {};
    if (!isFunction(callback)) {
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
