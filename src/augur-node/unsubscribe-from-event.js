"use strict";

var augurNodeState = require("./state");
var submitJsonRpcRequest = require("./submit-json-rpc-request");

function unsubscribeFromEvent(subscription) {
  var params = [subscription];
  submitJsonRpcRequest("unsubscribe", params, function (err) {
    if (err) throw new Error("Error unsubscribing with subscription: " + subscription);
    augurNodeState.removeCallback("event:" + subscription);
    console.log("Unsubscribed from " + subscription);
  });
}

module.exports = unsubscribeFromEvent;
