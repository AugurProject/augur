"use strict";

var assign = require("lodash").assign;
var formatLoggedEventInputs = require("../../format/log/format-logged-event-inputs");
var formatLogMessage = require("../../format/log/format-log-message");
var isFunction = require("../../utils/is-function");
var isObject = require("../../utils/is-object");

function parseLogMessage(contractName, eventName, message, abiEventInputs, onMessage) {
  if (message != null) {
    if (Array.isArray(message)) {
      message.map(function (singleMessage) {
        return parseLogMessage(contractName, eventName, singleMessage, abiEventInputs, onMessage);
      });
    } else if (isObject(message) && !message.error && message.topics && message.data) {
      var parsedMessage = assign(formatLoggedEventInputs(message.topics, message.data, abiEventInputs), {
        address: message.address,
        removed: message.removed,
        transactionHash: message.transactionHash,
        transactionIndex: parseInt(message.transactionIndex, 16),
        logIndex: parseInt(message.logIndex, 16),
        blockNumber: parseInt(message.blockNumber, 16),
        blockHash: message.blockHash,
        contractName: contractName,
        eventName: eventName,
      });
      if (!isFunction(onMessage)) return formatLogMessage(contractName, eventName, parsedMessage);
      onMessage(formatLogMessage(contractName, eventName, parsedMessage));
    } else {
      throw new Error("Bad event log(s) received: " + JSON.stringify(message));
    }
  }
}

module.exports = parseLogMessage;
