"use strict";

var subscriptions = require("./state");

var registerSubscriptionCallback = function (id, callback) {
  subscriptions[id] = callback;
};

var unregisterSubscriptionCallback = function (id) {
  delete subscriptions[id];
};

module.exports = {
  register: registerSubscriptionCallback,
  unregister: unregisterSubscriptionCallback
};
