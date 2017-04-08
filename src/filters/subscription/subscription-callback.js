"use strict";

var subscriptions = require("./subscriptions");

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
