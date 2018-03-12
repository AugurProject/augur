"use strict";

var augurNodeState = require("./state");

function submitJsonRpcRequest(method, params, callback) {
  var transport = augurNodeState.getTransport();
  if (transport == null) {
    return callback(new Error("Not connected to augur-node, could not submit request " + method + " " + JSON.stringify(params)));
  }
  var id = augurNodeState.getNumRequests();
  augurNodeState.incrementNumRequests();
  augurNodeState.setCallback(id, callback);
  transport.submitWork({ id: id, jsonrpc: "2.0", method: method, params: params });
}

module.exports = submitJsonRpcRequest;
