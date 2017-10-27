"use strict";

var subscriptions = {};

module.exports.onLogAdded = function (log) {
  console.log("event log added:", log);
  if (subscriptions[log.address] && subscriptions[log.address][log.topics[0]]) {
    subscriptions[log.address][log.topics[0]].callback(log);
  }
};

module.exports.onLogRemoved = function (log) {
  console.log("event log removed:", log);
  if (subscriptions[log.address] && subscriptions[log.address][log.topics[0]]) {
    log.removed = true;
    subscriptions[log.address][log.topics[0]].callback(log);
  }
};

module.exports.getSubscriptions = function () {
  return subscriptions;
};

module.exports.addSubscription = function (contractAddress, eventSignature, token, callback) {
  if (!subscriptions[contractAddress]) subscriptions[contractAddress] = {};
  subscriptions[contractAddress][eventSignature] = { token: token, callback: callback };
};

module.exports.removeSubscription = function (token) {
  subscriptions = Object.keys(subscriptions).reduce(function (p, contractAddress) {
    Object.keys(subscriptions[contractAddress]).forEach(function (eventSignature) {
      if (subscriptions[contractAddress][eventSignature].token !== token) {
        p[contractAddress][eventSignature] = subscriptions[contractAddress][eventSignature];
      }
    });
    return p;
  }, {});
};

module.exports.resetState = function () {
  subscriptions = {};
};
