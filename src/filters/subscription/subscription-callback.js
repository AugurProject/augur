"use strict";

var store = require("../../store");

var registerSubscriptionCallback = function (id, callback) {
  store.dispatch({
    type: "REGISTER_SUBSCRIPTION_CALLBACK",
    id: id,
    callback: callback
  });
};

var unregisterSubscriptionCallback = function (id) {
  store.dispatch({
    type: "UNREGISTER_SUBSCRIPTION_CALLBACK",
    id: id
  });
};

module.exports = {
  register: registerSubscriptionCallback,
  unregister: unregisterSubscriptionCallback
};
