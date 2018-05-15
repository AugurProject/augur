"use strict";

var isFunction = require("../utils/is-function");

var parseLogMessage = require("./parse-message/parse-log-message");

function addFilter(blockStream, contractName, callbacks, contractAbi, contracts, addSubscription) {
  if (!contractAbi) return false;
  if (!contracts[contractName]) return false;
  var eventBySignature = {};
  for (var eventName in callbacks) {
    if (Object.prototype.hasOwnProperty.call(callbacks, eventName)) {
      var eventAbi = contractAbi[eventName];
      var callback = callbacks[eventName];
      if (!isFunction(callback) || !eventAbi || !eventAbi.contract || !eventAbi.signature || !eventAbi.inputs) return false;
      eventBySignature[eventAbi.signature] = {
        eventName: eventName,
        callback: callback,
        abi: eventAbi.inputs,
      };
    }
  }
  var contractAddress = contracts[contractName];
  addSubscription(contractAddress, blockStream.addLogFilter({
    address: contractAddress,
    topics: [Object.keys(eventBySignature)],
  }), function (message) {
    var event = eventBySignature[message.topics[0]];
    if (!eventName) return console.warn("Ethereum Node provided data we did not request", contractAddress, message.topics[0]);
    parseLogMessage(contractName, event.eventName, message, event.abi, event.callback);
  });
  return true;
}

module.exports = addFilter;
