"use strict";

var augurNodeState = require("./state");
var submitJsonRpcRequest = require("./submit-json-rpc-request");

function subscribeToEvent(eventName, params, callback) {
  params = Array.isArray(params) ? params : [];
  params.unshift(eventName);

  submitJsonRpcRequest("subscribe", params, function(err, response) {
    if(err) throw new Error("Error subscribing to event: " + err);
    augurNodeState.setCallback("event:" + response.subscription, callback);
    console.log("Subscribed to " + eventName + " with response ", response);
  });

}

module.exports = subscribeToEvent;
