"use strict";

var addFilter = require("./add-filter");
var isFunction = require("../utils/is-function");
var subscriptions = require("./subscriptions");

module.exports = function (getBlockAndLogStreamer) {

  return {

    listen: function (contracts, eventsAPI, subscriptionCallbacks, onSetupComplete) {
      var label, contracts, eventsAPI, blockStream = getBlockAndLogStreamer();
      // contracts = getState().contractAddresses;
      // eventsAPI = getState().contractsAPI.events;
      Object.keys(subscriptionCallbacks).map(function (label) {
        if (isFunction(subscriptionCallbacks[label])) {
          addFilter(blockStream, label, eventsAPI[label], contracts, subscriptions.addSubscription, subscriptionCallbacks[label]);
        }
      });
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
