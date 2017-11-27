"use strict";

var augurNodeState = require("./state");
var submitJsonRpcRequest = require("./submit-json-rpc-request");

function subscribeToEvent(eventName, params, subscriptionCallback, onComplete) {
  params = Array.isArray(params) ? params : [];
  params.unshift(eventName);
  submitJsonRpcRequest("subscribe", params, function (err, response) {
    if (err) return onComplete(err);
    augurNodeState.setEventCallback(response.subscription, subscriptionCallback);
    onComplete(null);
  });
}

module.exports = subscribeToEvent;
