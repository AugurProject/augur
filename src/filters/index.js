"use strict";

var format = require("./format");
var dispatch = require("./dispatch");

var isFunction = function (f) {
  return typeof f === "function";
};

module.exports = function () {

  var contracts = this.contracts;
  var eventsAPI = this.api.events;
  var getBlockAndLogStreamer = this.rpc.getBlockAndLogStreamer.bind(this.rpc);

  return {

    blockStream: null,

    addAllLogsFilter: function () {
      var contractName, params, contractList;
      contractList = [];
      for (contractName in contracts) {
        if (contracts.hasOwnProperty(contractName)) {
          contractList.push(contracts[contractName]);
        }
      }
      this.blockStream.addLogFilter({address: contractList});
    },

    addLogFilter: function (label) {
      this.blockStream.addLogFilter({
        address: contracts[eventsAPI[label].contract],
        topics: [eventsAPI[label].signature]
      });
    },

    addFilter: function (label, callback) {
      switch (label) {
        case "block":
          this.blockStream.subscribeToOnBlockAdded(function (msg) {
            format.parseBlockMessage(msg, callback);
          });
          break;
        case "allLogs":
          this.addAllLogsFilter();
          dispatch.registerSubscriptionCallback(label, function (msg) {
            format.parseAllLogsMessage(msg, callback);
          });
          break;
        default:
          if (eventsAPI[label]) {
            this.addLogFilter(label);
            dispatch.registerSubscriptionCallback(eventsAPI[label].signature, function (msg) {
              format.parseLogMessage(label, msg, callback);
            });
          }
      } 
    },

    listen: function (callbacks, onSetupComplete) {
      var label;
      if (!this.blockStream) this.blockStream = getBlockAndLogStreamer();
      for (label in callbacks) {
        if (callbacks.hasOwnProperty(label)) {
          if (label !== null && label !== undefined) {
            if (isFunction(callbacks[label])) {
              this.addFilter(label, callbacks[label]);
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
        // dispatch.unregisterSubscriptionCallback
      }
    }
  };
};
