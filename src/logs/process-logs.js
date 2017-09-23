"use strict";

var insertIndexedLog = require("./insert-indexed-log");
var contracts = require("../contracts");
var ethrpc = require("../rpc-interface");
var parseLogMessage = require("../filters/parse-message/parse-log-message");
var mapContractAddressesToNames = require("../utils/map-contract-addresses-to-names");

// warning: mutates processedLogs, if passed
function processLogs(eventName, index, logs, extraField, processedLogs) {
  var eventsAbi = contracts.abi.events;
  var contractAddressToNameMap = mapContractAddressesToNames(contracts[ethrpc.getNetworkID()]);
  if (!processedLogs) processedLogs = (index) ? {} : [];
  for (var i = 0, numLogs = logs.length; i < numLogs; ++i) {
    // TODO process removed logs
    if (!logs[i].removed) {
      var contractName = contractAddressToNameMap[logs[i].address];
      var parsed = parseLogMessage(contractName, eventName, logs[i], eventsAbi[contractName][eventName].inputs);
      if (extraField && extraField.name) {
        parsed[extraField.name] = extraField.value;
      }
      if (index) {
        insertIndexedLog(processedLogs, parsed, index);
      } else {
        processedLogs.push(parsed);
      }
    }
  }
  return processedLogs;
}

module.exports = processLogs;
