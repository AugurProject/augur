"use strict";

var parseLogMessage = require("./parse-message/parse-log-message");

function addFilter(blockStream, contractName, eventName, eventAbi, contracts, addSubscription, onMessage) {
  if (!eventAbi) return null;
  if (!eventAbi.contract || !eventAbi.signature || !eventAbi.inputs) return null;
  if (!contracts[eventAbi.contract]) return null;
  var contractAddress = contracts[eventAbi.contract];
  addSubscription(contractAddress, eventAbi.signature, blockStream.addLogFilter({
    address: contractAddress,
    topics: [eventAbi.signature],
  }), function (message) {
    parseLogMessage(contractName, eventName, message, eventAbi.inputs, onMessage);
  });
}

module.exports = addFilter;
