"use strict";

var addFilter = require("./add-filter");
var rpcInterface = require("../rpc-interface");
var isFunction = require("../utils/is-function");
var subscriptions = require("./subscriptions");

function startListeners(contracts, eventsAPI, subscriptionCallbacks, onSetupComplete) {
  var label, contracts, eventsAPI, blockStream = rpcInterface.getBlockStream();
  Object.keys(subscriptionCallbacks).map(function (label) {
    if (isFunction(subscriptionCallbacks[label])) {
      addFilter(blockStream, label, eventsAPI[label], contracts, subscriptions.addSubscription, subscriptionCallbacks[label]);
    }
  });
  blockStream.subscribeToOnLogAdded(subscriptions.onLogAdded);
  blockStream.subscribeToOnLogRemoved(subscriptions.onLogRemoved);
  if (isFunction(onSetupComplete)) onSetupComplete();
}

module.exports = startListeners;
