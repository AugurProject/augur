"use strict";

var abi = require("augur-abi");
var augurContracts = require("../contracts");
var eventsABI = augurContracts.abi.events;
var rpcInterface = require("../rpc-interface");

// { account, filter }
function getShortSellLogs(p, callback) {
  var topics;
  p.filter = p.filter || {};
  if (p.account != null) {
    topics = [
      eventsABI.log_short_fill_tx.signature,
      p.filter.market ? abi.format_int256(p.filter.market) : null,
      null,
      null
    ];
    topics[p.filter.maker ? 3 : 2] = abi.format_int256(p.account);
    rpcInterface.getLogs({
      fromBlock: p.filter.fromBlock || "0x1",
      toBlock: p.filter.toBlock || "latest",
      address: augurContracts[rpcInterface.getNetworkID()].Trade,
      topics: topics
    }, function (logs) {
      if (logs && logs.error) return callback(logs, null);
      if (!Array.isArray(logs) || !logs.length) return callback(null, []);
      callback(null, logs);
    });
  }
}

module.exports = getShortSellLogs;
