"use strict";

var assign = require("lodash").assign;
var encodeTransactionInputs = require("./encode-transaction-inputs");
var ethrpc = require("../rpc-interface");
var isFunction = require("../utils/is-function");
var isObject = require("../utils/is-object");

function bindContractFunction(functionAbi) {
  return function () {
    var payload = assign({}, functionAbi);
    if (arguments && arguments.length) {
      var params = Array.prototype.slice.call(arguments);
      if (payload.constant || (params[0] != null && params[0].tx != null && params[0].tx.send === false)) {
        if (params != null && isObject(params[0])) {
          payload.params = encodeTransactionInputs(params[0], payload.inputs, payload.signature);
          if (isObject(params[0].meta) && params[0].meta.address) assign(payload, { from: params[0].meta.address });
          if (isObject(params[0].tx)) assign(payload, { from: (params[0].meta || {}).address }, params[0].tx);
        }
        if (!isFunction(params[params.length - 1])) return console.error("Callback required");
        var callback = params.pop();
        return ethrpc.callContractFunction(payload, function (err, response) {
          if (err) return callback(err);
          if (response == null) return callback(new Error("Null eth_call response"));
          callback(null, response);
        });
      }
    }
    var onSent, onSuccess, onFailed, signer, accountType;
    if (params != null && isObject(params[0])) {
      onSent = params[0].onSent;
      onSuccess = params[0].onSuccess;
      onFailed = params[0].onFailed;
      payload.params = encodeTransactionInputs(params[0], payload.inputs, payload.signature);
      if (isObject(params[0].meta) && params[0].meta.address) assign(payload, { from: params[0].meta.address });
      if (isObject(params[0].tx)) assign(payload, params[0].tx);
      signer = (params[0].meta || {}).signer;
      accountType = (params[0].meta || {}).accountType;
    }
    ethrpc.transact(payload, signer, accountType, onSent, onSuccess, onFailed);
  };
}

module.exports = bindContractFunction;
