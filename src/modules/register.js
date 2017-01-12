/**
 * Augur JavaScript API
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var clone = require("clone");
var abi = require("augur-abi");
var constants = require("../constants");
var utils = require("../utilities");

module.exports = {

  parseLastTime: function (logs) {
    return new Date(parseInt(logs[logs.length - 1].data, 16) * 1000);
  },

  parseLastBlock: function (logs) {
    return parseInt(logs[logs.length - 1].blockNumber, 16);
  },

  getRegisterBlockNumber: function (account, options, callback) {
    var self = this;
    if (!callback && utils.is_function(options)) {
      callback = options;
      options = null;
    }
    options = options || {};
    if (account !== undefined && account !== null) {
      var filter = {
        fromBlock: options.fromBlock || "0x1",
        toBlock: options.toBlock || "latest",
        address: this.contracts.Register,
        topics: [
          this.api.events.registration.signature,
          abi.format_int256(account)
        ],
        timeout: constants.GET_LOGS_TIMEOUT
      };
      if (!utils.is_function(callback)) {
        var logs = this.rpc.getLogs(filter);
        if (!logs || !logs.length || (logs && logs.error)) return null;
        return this.parseLastBlock(logs);
      }
      this.rpc.getLogs(filter, function (logs) {
        if (!logs || !logs.length) return callback(null, null);
        if (logs && logs.error) return callback(logs, null);
        callback(null, self.parseLastBlock(logs));
      });
    }
  },

  getRegisterTime: function (account, options, callback) {
    var self = this;
    if (!callback && utils.is_function(options)) {
      callback = options;
      options = null;
    }
    options = options || {};
    if (account !== undefined && account !== null) {
      var filter = {
        fromBlock: options.fromBlock || "0x1",
        toBlock: options.toBlock || "latest",
        address: this.contracts.Register,
        topics: [
          this.api.events.registration.signature,
          abi.format_int256(account)
        ],
        timeout: constants.GET_LOGS_TIMEOUT
      };
      if (!utils.is_function(callback)) {
        var logs = this.rpc.getLogs(filter);
        if (!logs || !logs.length || (logs && logs.error)) return null;
        return this.parseLastTime(logs);
      }
      this.rpc.getLogs(filter, function (logs) {
        if (!logs || !logs.length) return callback(null, null);
        if (logs && logs.error) return callback(logs, null);
        callback(null, self.parseLastTime(logs));
      });
    }
  },

  getRegisterLogs: function (account, options, callback) {
    if (!callback && utils.is_function(options)) {
      callback = options;
      options = null;
    }
    options = options || {};
    if (account !== undefined && account !== null) {
      var filter = {
        fromBlock: options.fromBlock || "0x1",
        toBlock: options.toBlock || "latest",
        address: this.contracts.Register,
        topics: [
          this.api.events.registration.signature,
          abi.format_int256(account)
        ],
        timeout: constants.GET_LOGS_TIMEOUT
      };
      if (!utils.is_function(callback)) return this.rpc.getLogs(filter);
      this.rpc.getLogs(filter, function (logs) {
        if (!logs || !logs.length) return callback(null, []);
        if (logs && logs.error) return callback(logs, null);
        callback(null, logs);
      });
    }
  }
};
