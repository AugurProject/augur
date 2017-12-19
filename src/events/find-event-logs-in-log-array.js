"use strict";

var speedomatic = require("speedomatic");
var eventsAbi = require("../contracts").abi.events;
var parseLogMessage = require("./parse-message/parse-log-message");

function findEventLogsInLogArray(contractName, eventName, logs) {
  if (!Array.isArray(logs) || !logs.length) return null;
  var eventAbi = ((eventsAbi || {})[contractName] || {})[eventName];
  if (eventAbi == null) return null;
  var eventSignature = eventAbi.signature;
  var eventInputs = eventAbi.inputs;
  if (eventSignature == null) return null;
  return logs.reduce(function (reducedLogs, log) {
    if (speedomatic.formatInt256(log.topics[0]) !== eventSignature) return reducedLogs;
    return reducedLogs.concat(parseLogMessage(contractName, eventName, log, eventInputs));
  }, []);
}

module.exports = findEventLogsInLogArray;
