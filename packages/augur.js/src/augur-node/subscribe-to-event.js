"use strict";

var augurNodeState = require("./state");
var submitJsonRpcRequest = require("./submit-json-rpc-request");

function subscribeToEvent(eventName, subscriptionCallback, onComplete) {
  submitJsonRpcRequest("subscribe", [eventName], function (err, response) {
    if (err) return onComplete(err);
    augurNodeState.setEventCallback(response.subscription, subscriptionCallback);
    onComplete(null, response.subscription);
  });
}

module.exports = subscribeToEvent;
