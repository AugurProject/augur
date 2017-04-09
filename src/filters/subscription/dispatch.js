"use strict";

var store = require("../../store");

var onLogAdded = function (log) {
  var subscriptions = store.getState().subscriptions;
  console.log("[filters/subscription/dispatch] log added:", log);
  subscriptions[log.topics[0]](log);
  if (subscriptions.allLogs) subscriptions.allLogs(log);
};

var onLogRemoved = function (log) {
  var subscriptions = store.getState().subscriptions;
  console.log("[filters/subscription/dispatch] log removed:", log);
  subscriptions[log.topics[0]](log);
  if (subscriptions.allLogs) subscriptions.allLogs(log);
};

module.exports = {
  onLogAdded: onLogAdded,
  onLogRemoved: onLogRemoved
};
