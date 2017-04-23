"use strict";

var rpcInterface = require("../rpc-interface");
var subscriptions = require("./subscriptions");

function stopListeners() {
  var token, blockStream = rpcInterface.getBlockStream();
  if (!blockStream) return false;
  for (token in blockStream.onLogAddedSubscribers) {
    if (blockStream.onLogAddedSubscribers.hasOwnProperty(token)) {
      blockStream.unsubscribeFromOnLogAdded(token);
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

module.exports = stopListeners;
