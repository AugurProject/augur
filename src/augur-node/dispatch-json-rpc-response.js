"use strict";

var augurNodeState = require("./state");
var isFunction = require("../utils/is-function");
var isObject = require("../utils/is-object");

function dispatchJsonRpcResponse(err, jsonRpcResponse) {
  if (err) throw err;
  if (!jsonRpcResponse || !isObject(jsonRpcResponse) || jsonRpcResponse.id === undefined) {
    throw new Error("Bad JSON RPC response received:" + JSON.stringify(jsonRpcResponse));
  }

  var callback, result;
  if (jsonRpcResponse.id !== null) {
    callback = augurNodeState.getCallback(jsonRpcResponse.id);
    augurNodeState.removeCallback(jsonRpcResponse.id);
    result = jsonRpcResponse.result;
  } else if (jsonRpcResponse.result.subscription) {
    callback = augurNodeState.getEventCallback(jsonRpcResponse.result.subscription);
    result = jsonRpcResponse.result.result;
  } else {
    throw new Error("Bad JSON RPC response received:" + JSON.stringify(jsonRpcResponse));
  }

  if (!isFunction(callback)) {
    throw new Error("Callback not found for JSON RPC response:" + JSON.stringify(jsonRpcResponse));
  }

  if (jsonRpcResponse.error) {
    callback(jsonRpcResponse.error);
  } else if (result !== undefined) {
    callback(null, result);
  } else {
    callback("Bad JSON RPC response received:" + JSON.stringify(jsonRpcResponse));
  }
}

module.exports = dispatchJsonRpcResponse;
