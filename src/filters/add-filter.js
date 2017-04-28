"use strict";

var parseBlockMessage = require("./parse-message/parse-block-message");
var parseLogMessage = require("./parse-message/parse-log-message");
var parseAllLogsMessage = require("./parse-message/parse-all-logs-message");
var listContracts = require("../utils/list-contracts");

function addFilter(blockStream, label, eventAPI, contracts, addSubscription, onMessage) {
  switch (label) {
    case "block":
      blockStream.subscribeToOnBlockAdded(function (message) {
        parseBlockMessage(message, onMessage);
      });
      break;
    case "allLogs":
      addSubscription(label, blockStream.addLogFilter({
        address: listContracts(contracts)
      }), function (message) {
        parseAllLogsMessage(message, onMessage);
      });
      break;
    default:
      if (!eventAPI) return null;
      if (!eventAPI.contract || !eventAPI.signature || !eventAPI.inputs) return null;
      if (!contracts[eventAPI.contract]) return null;
      addSubscription(eventAPI.signature, blockStream.addLogFilter({
        address: contracts[eventAPI.contract],
        topics: [eventAPI.signature]
      }), function (message) {
        parseLogMessage(label, message, eventAPI.inputs, onMessage);
      });
  }
}

module.exports = addFilter;
