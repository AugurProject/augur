"use strict";

var assign = require("lodash").assign;

var initialState = { block: {} };

var subscriptions = assign({}, initialState);

module.exports.onLogAdded = function (log) {
  if (subscriptions[log.address]) {
    subscriptions[log.address].callback(log);
  }
};

module.exports.onLogRemoved = function (log) {
  if (subscriptions[log.address]) {
    log.removed = true;
    subscriptions[log.address].callback(log);
  }
};

module.exports.getSubscriptions = function () {
  return subscriptions;
};

module.exports.addSubscription = function (contractAddress, token, callback) {
  subscriptions[contractAddress] = { token: token, callback: callback };
};

module.exports.removeSubscription = function (token) {
  subscriptions = Object.keys(subscriptions).reduce(function (p, contractAddress) {
    if (subscriptions[contractAddress].token !== token) {
      p[contractAddress] = subscriptions[contractAddress];
    }
    return p;
  }, {});
};

module.exports.addOnBlockAddedSubscription = function (token) {
  subscriptions.block.added = token;
};

module.exports.addOnBlockRemovedSubscription = function (token) {
  subscriptions.block.removed = token;
};

module.exports.removeOnBlockAddedSubscription = function () {
  delete subscriptions.block.added;
};

module.exports.removeOnBlockRemovedSubscription = function () {
  delete subscriptions.block.removed;
};

module.exports.resetState = function () {
  subscriptions = assign({}, initialState);
};
