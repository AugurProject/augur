"use strict";

var ethrpc = require("../rpc-interface");
var subscriptions = require("./subscriptions");

/**
 * Removes all active listeners for events emitted by the Ethereum blockchain.
 * @return {boolean} True if listeners were successfully stopped; false otherwise.
 */
function stopBlockchainEventListeners() {
  var token, blockStream = ethrpc.getBlockStream();
  if (!blockStream) return false;
  for (token in blockStream.onLogAddedSubscribers) {
    if (blockStream.onLogAddedSubscribers.hasOwnProperty(token)) {
      blockStream.unsubscribeFromOnLogAdded(token);
    }
  }
  for (token in blockStream.onLogRemovedSubscribers) {
    if (blockStream.onLogRemovedSubscribers.hasOwnProperty(token)) {
      blockStream.unsubscribeFromOnLogRemoved(token);
    }
  }
  for (token in subscriptions.getSubscriptions()) {
    if (blockStream.logFilters.hasOwnProperty(token)) {
      blockStream.removeLogFilter(token);
      subscriptions.removeSubscription(token);
    }
  }
  return true;
}

module.exports = stopBlockchainEventListeners;
