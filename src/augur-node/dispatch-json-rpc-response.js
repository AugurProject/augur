"use strict";

var augurNodeState = require("./state");
var isFunction = require("../utils/is-function");
var isObject = require("../utils/is-object");

function dispatchJsonRpcResponse(err, jsonRpcResponse) {
  if (err) throw err;
  if (!jsonRpcResponse || !isObject(jsonRpcResponse) || jsonRpcResponse.id === undefined) {
    throw new Error("Bad JSON RPC response received:" + JSON.stringify(jsonRpcResponse));
  }
  var callback = augurNodeState.getCallback(jsonRpcResponse.id);
  if (!isFunction(callback)) {
    throw new Error("Callback not found for JSON RPC response:" + JSON.stringify(jsonRpcResponse));
  }
  if (jsonRpcResponse.error) {
    callback(jsonRpcResponse.error);
  } else if (jsonRpcResponse.result) {
    callback(null, jsonRpcResponse.result);
  } else {
    callback("Bad JSON RPC response received:" + JSON.stringify(jsonRpcResponse));
  }
}

module.exports = dispatchJsonRpcResponse;
