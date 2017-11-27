"use strict";

var augurNodeState = require("./state");
var submitJsonRpcRequest = require("./submit-json-rpc-request");

function unsubscribeFromEvent(subscription, callback) {
  var params = [subscription];
  submitJsonRpcRequest("unsubscribe", params, function (err) {
    if (err) return callback(err);
    augurNodeState.removeEventCallback(subscription);
    console.log("Unsubscribed from " + subscription);
    callback(null);
  });
}

module.exports = unsubscribeFromEvent;
