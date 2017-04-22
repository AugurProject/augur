"use strict";

var abi = require("augur-abi");
var augurContracts = require("augur-contracts");
var eventsAPI = augurContracts.api.events;
var rpcInterface = require("../rpc-interface");
var isFunction = require("../utils/is-function");
var LOG_TYPE_CODES = require("../constants").LOG_TYPE_CODES;

function getCompleteSetsLogs(account, options, callback) {
  var typeCode, market, filter;
  if (!callback && isFunction(options)) {
    callback = options;
    options = null;
  }
  options = options || {};
  if (account != null) {
    typeCode = LOG_TYPE_CODES[options.type] || null;
    market = options.market ? abi.format_int256(options.market) : null;
    filter = {
      fromBlock: options.fromBlock || "0x1",
      toBlock: options.toBlock || "latest",
      address: (options.shortAsk) ?
        augurContracts[rpcInterface.getNetworkID()].BuyAndSellShares :
        augurContracts[rpcInterface.getNetworkID()].CompleteSets,
      topics: [
        eventsAPI.completeSets_logReturn.signature,
        abi.format_int256(account),
        market,
        typeCode
      ]
    };
    if (!isFunction(callback)) return rpcInterface.getLogs(filter);
    rpcInterface.getLogs(filter, function (logs) {
      if (logs && logs.error) return callback(logs, null);
      if (!logs || !logs.length) return callback(null, []);
      callback(null, logs);
    });
  }
}

module.exports = getCompleteSetsLogs;
