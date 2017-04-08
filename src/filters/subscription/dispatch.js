"use strict";

var subscriptions = require("./subscriptions");

var onLogAdded = function (log) {
  console.log("[filters/subscription/dispatch] log added:", log);
  subscriptions[log.topics[0]](log);
  if (subscriptions.allLogs) subscriptions.allLogs(log);
};

var onLogRemoved = function (log) {
  console.log("[filters/subscription/dispatch] log removed:", log);
  subscriptions[log.topics[0]](log);
  if (subscriptions.allLogs) subscriptions.allLogs(log);
};

module.exports = {
  onLogAdded: onLogAdded,
  onLogRemoved: onLogRemoved
};
