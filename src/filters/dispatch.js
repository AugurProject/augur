"use strict";

module.exports = {

  subscriptions: {},

  unregisterSubscriptionCallback: function (id) {
    delete this.subscriptions[id];
  },

  registerSubscriptionCallback: function (id, callback) {
    this.subscriptions[id] = callback;
  },

  onLogAdded: function (log) {
    console.log("[blockstream] log added:", log);
    this.subscriptions[log.topics[0]](log);
    if (this.subscriptions.allLogs) this.subscriptions.allLogs(log);
  },

  onLogRemoved: function (log) {
    console.log("[blockstream] log removed:", log);
    this.subscriptions[log.topics[0]](log);
    if (this.subscriptions.allLogs) this.subscriptions.allLogs(log);
  }

};
