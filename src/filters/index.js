"use strict";

var addFilter = require("./add-filter");
var isFunction = require("../utils/is-function");
var subscriptions = require("./subscriptions");
var getState = require("../store").getState;

module.exports = function (getBlockAndLogStreamer) {

  return {

    listen: function (callbacks, onSetupComplete) {
      var label, contracts, eventsAPI, blockStream;
      contracts = getState().contractAddresses;
      eventsAPI = getState().contractsAPI.events;
      blockStream = getBlockAndLogStreamer();
      for (label in callbacks) {
        if (callbacks.hasOwnProperty(label) && label != null && isFunction(callbacks[label])) {
          addFilter(blockStream, label, eventsAPI[label], contracts, subscriptions.addSubscription, callbacks[label]);
        }
      }
      blockStream.subscribeToOnLogAdded(subscriptions.onLogAdded);
      blockStream.subscribeToOnLogRemoved(subscriptions.onLogRemoved);
      if (isFunction(onSetupComplete)) onSetupComplete();
    },

    ignore: function () {
      var token, blockStream = getBlockAndLogStreamer();
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
  };
};
