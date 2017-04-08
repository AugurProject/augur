"use strict";

var addFilter = require("./add-filter");
var dispatch = require("./subscription/dispatch");

var isFunction = function (f) {
  return typeof f === "function";
};

module.exports = function () {

  var contracts = this.contracts;
  var eventsAPI = this.api.events;
  var getBlockAndLogStreamer = this.rpc.getBlockAndLogStreamer.bind(this.rpc);

  return {

    blockStream: null,

    listen: function (callbacks, onSetupComplete) {
      var label;
      if (!this.blockStream) this.blockStream = getBlockAndLogStreamer();
      for (label in callbacks) {
        if (callbacks.hasOwnProperty(label)) {
          if (label !== null && label !== undefined) {
            if (isFunction(callbacks[label])) {
              addFilter(this.blockStream, label, eventsAPI[label], contracts, callbacks[label]);
            }
          }
        }
      }
      this.blockStream.subscribeToOnLogAdded(dispatch.onLogAdded);
      this.blockStream.subscribeToOnLogRemoved(dispatch.onLogRemoved);
      if (isFunction(onSetupComplete)) onSetupComplete();
    },

    ignore: function (uninstall, cb, complete) {
      var token;
      if (this.blockStream) {
        for (token in this.blockStream.onLogAddedSubscribers) {
          if (this.blockStream.onLogAddedSubscribers.hasOwnProperty(token)) {
            this.blockStream.unsubscribeFromOnLogAdded(token);
          }
        }
        for (token in this.blockStream.logFilters) {
          if (this.blockStream.logFilters.hasOwnProperty(token)) {
            this.blockStream.removeLogFilter(token);
          }
        }
        // subscriptionCallback.unregister
      }
    }
  };
};
