"use strict";

var abi = require("augur-abi");
var augurContracts = require("../contracts");
var eventsABI = augurContracts.abi.events;
var rpcInterface = require("../rpc-interface");
var LOG_TYPE_CODES = require("../constants").LOG_TYPE_CODES;

// { account, filter }
function getCompleteSetsLogs(p, callback) {
  var typeCode, market;
  p.filter = p.filter || {};
  if (p.account == null) return callback("account required");
  typeCode = LOG_TYPE_CODES[p.filter.type] || null;
  market = p.filter.market ? abi.format_int256(p.filter.market) : null;
  rpcInterface.getLogs({
    fromBlock: p.filter.fromBlock || "0x1",
    toBlock: p.filter.toBlock || "latest",
    address: (p.filter.shortAsk) ?
      augurContracts[rpcInterface.getNetworkID()].BuyAndSellShares :
      augurContracts[rpcInterface.getNetworkID()].CompleteSets,
    topics: [
      eventsABI.completeSets_logReturn.signature,
      abi.format_int256(p.account),
      market,
      typeCode
    ]
  }, function (logs) {
    if (logs && logs.error) return callback(logs, null);
    if (!Array.isArray(logs) || !logs.length) return callback(null, []);
    callback(null, logs);
  });
}

module.exports = getCompleteSetsLogs;
