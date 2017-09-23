"use strict";

var insertIndexedLog = require("./insert-indexed-log");
var contracts = require("../contracts");
var parseLogMessage = require("../filters/parse-message/parse-log-message");

// warning: mutates processedLogs, if passed
function processLogs(contractName, eventName, index, logs, extraField, processedLogs) {
  var eventsAbi = contracts.abi.events;
  if (!processedLogs) processedLogs = (index) ? {} : [];
  for (var i = 0, numLogs = logs.length; i < numLogs; ++i) {
    if (!logs[i].removed) {
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
