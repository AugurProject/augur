"use strict";

module.exports = function (subscriptions, action) {
  if (typeof subscriptions === "undefined") {
    return {};
  }
  switch (action.type) {
    case "REGISTER_SUBSCRIPTION_CALLBACK":
      subscriptions[action.id] = action.callback;
      return subscriptions;
    case "UNREGISTER_SUBSCRIPTION_CALLBACK":
      return Object.keys(subscriptions).reduce(function (newState, id) {
        if (id !== action.id) {
          newState[id] = subscriptions[id];
        }
        return newState;
      }, {});
    case "UNREGISTER_ALL_SUBSCRIPTION_CALLBACKS":
      return {};
    default:
      return subscriptions;
  }
};
