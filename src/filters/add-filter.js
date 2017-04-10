"use strict";

var addAllLogsFilter = require("./add-all-logs-filter");
var addLogFilter = require("./add-log-filter");
var subscriptionCallback = require("./subscription/subscription-callback");
var parseBlockMessage = require("./parse-message/parse-block-message");
var parseLogMessage = require("./parse-message/parse-log-message");
var parseAllLogsMessage = require("./parse-message/parse-all-logs-message");

var addFilter = function (blockStream, label, eventAPI, contracts, onMessage) {
  switch (label) {
    case "block":
      blockStream.subscribeToOnBlockAdded(function (msg) {
        parseBlockMessage(msg, onMessage);
      });
      break;
    case "allLogs":
      addAllLogsFilter(blockStream, contracts);
      subscriptionCallback.register(label, function (msg) {
        parseAllLogsMessage(msg, onMessage);
      });
      break;
    default:
      if (eventAPI && eventAPI.contract && eventAPI.signature && eventAPI.inputs && contracts[eventAPI.contract]) {
        addLogFilter(blockStream, label, contracts[eventAPI.contract], eventAPI.signature);
        subscriptionCallback.register(eventAPI.signature, function (msg) {
          parseLogMessage(label, msg, eventAPI.inputs, onMessage);
        });
      }
  }
};

module.exports = addFilter;
