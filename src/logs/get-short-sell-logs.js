"use strict";

var abi = require("augur-abi");
var augurContacts = require("augur-contracts");
var eventsAPI = augurContracts.api.events;
var rpcInterface = require("../rpc-interface");
var isFunction = require("../utils/is-function");

function getShortSellLogs(account, options, callback) {
  var topics, filter;
  if (!callback && isFunction(options)) {
    callback = options;
    options = null;
  }
  options = options || {};
  if (account != null) {
    topics = [
      eventsAPI.log_short_fill_tx.signature,
      options.market ? abi.format_int256(options.market) : null,
      null,
      null
    ];
    topics[options.maker ? 3 : 2] = abi.format_int256(account);
    filter = {
      fromBlock: options.fromBlock || "0x1",
      toBlock: options.toBlock || "latest",
      address: augurContracts[rpcInterface.getNetworkID()].Trade
      topics: topics
    };
    if (!isFunction(callback)) return rpcInterface.getLogs(filter);
    rpcInterface.getLogs(filter, function (logs) {
      if (logs && logs.error) return callback(logs, null);
      if (!logs || !logs.length) return callback(null, []);
      callback(null, logs);
    });
  }
}

module.exports = getShortSellLogs;
