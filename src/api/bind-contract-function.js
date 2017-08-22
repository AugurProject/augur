"use strict";

var assign = require("lodash.assign");
var encodeTransactionInputs = require("./encode-transaction-inputs");
var rpcInterface = require("../rpc-interface");
var isFunction = require("../utils/is-function");
var isObject = require("../utils/is-object");

function bindContractFunction(functionAbi) {
  return function () {
    var payload = assign({}, functionAbi);
    if (!arguments || !arguments.length) {
      if (!payload.send) return rpcInterface.callContractFunction(payload);
      return rpcInterface.transact(payload);
    }
    var params = Array.prototype.slice.call(arguments);
    if (!payload.send) {
      var callback;
      if (params && isObject(params[0])) {
        payload.params = encodeTransactionInputs(params, payload.inputs, payload.signature, payload.fixed);
        if (isObject(params[0].tx)) assign(payload, params[0].tx);
      }
      if (isFunction(params[params.length - 1])) callback = params.pop();
      if (!isFunction(callback)) return rpcInterface.callContractFunction(payload);
      return rpcInterface.callContractFunction(payload, callback);
    }
    var onSent, onSuccess, onFailed, signer;
    if (params && isObject(params[0])) {
      onSent = params[0].onSent;
      onSuccess = params[0].onSuccess;
      onFailed = params[0].onFailed;
      payload.params = encodeTransactionInputs(params[0], payload.inputs, payload.signature, payload.fixed);
      if (isObject(params[0].tx)) assign(payload, params[0].tx);
      signer = params[0]._signer;
    }
    rpcInterface.transact(payload, signer, onSent, onSuccess, onFailed);
  };
}

module.exports = bindContractFunction;
