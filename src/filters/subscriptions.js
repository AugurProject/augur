"use strict";

var subscriptions = {};

module.exports.onLogAdded = function (log) {
  console.log("[filters/subscription/dispatch] log added:", log);
  subscriptions[log.topics[0]](log);
  if (subscriptions.allLogs) subscriptions.allLogs(log);
};

module.exports.onLogRemoved = function (log) {
  console.log("[filters/subscription/dispatch] log removed:", log);
  subscriptions[log.topics[0]](log);
  if (subscriptions.allLogs) subscriptions.allLogs(log);
};

module.exports.getSubscriptions = function () {
  return subscriptions;
};

module.exports.addSubscription = function (id, token, callback) {
  subscriptions[id] = { token: token, callback: callback };
};

module.exports.removeSubscription = function (token) {
  subscriptions = Object.keys(subscriptions).reduce(function (p, id) {
    if (subscriptions[id].token !== token) p[id] = subscriptions[id];
    return p;
  }, {});
};
