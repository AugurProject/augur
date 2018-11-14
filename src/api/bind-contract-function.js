"use strict";

var assign = require("lodash").assign;
var encodeTransactionInputs = require("./encode-transaction-inputs");
var ethrpc = require("../rpc-interface");
var isFunction = require("../utils/is-function");
var isObject = require("../utils/is-object");
var getGasPrice = require("../get-gas-price");

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
        var callback = isFunction(params[params.length - 1]) ? params.pop() : undefined;
        var callPromise = new Promise(function (resolve, reject) {
          return ethrpc.callContractFunction(payload, function (err, response) {
            if (err) return reject(err);
            if (response == null) return reject(new Error("Null eth_call response"));
            resolve(response);
          });
        }).catch(function (err) {
          if (callback) return callback(err);
          throw err;
        });
        if (callback) {
          callPromise.then(function (response) {
            console.log("FFFFFFF", response);
            callback(null, response);
          });
        }
        return callPromise;
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
    var transactSuccessPromise = new Promise(function (resolve, reject) {
      var transact = function () {
        ethrpc.transact(payload, signer, accountType, onSent, resolve, reject);
      };
      if (params[0].gasPrice == null && getGasPrice.get()) {
        getGasPrice.get()(function (gasPrice) {
          payload.gasPrice = gasPrice;
          transact();
        });
        return;
      }
      transact();
    }).then(function (response) {
      if (onSuccess) onSuccess(response);
      return response;
    }).catch(function (err) {
      if (onFailed) return onFailed(err);
      throw err;
    });
    return transactSuccessPromise;
  };
}

module.exports = bindContractFunction;
