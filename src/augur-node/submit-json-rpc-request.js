"use strict";

var augurNodeState = require("./state");

function submitJsonRpcRequest(method, params, callback) {
  var id = augurNodeState.getNumRequests();
  augurNodeState.incrementNumRequests();
  augurNodeState.setCallback(id, callback);
  augurNodeState.getTransport().submitWork({ id: id, jsonrpc: "2.0", method: method, params: params });
}

module.exports = submitJsonRpcRequest;
