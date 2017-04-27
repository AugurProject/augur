"use strict";

var abi = require("augur-abi");
var assign = require("lodash.assign");
var clone = require("clone");
var rpcInterface = require("../rpc-interface");
var parsers = require("../parsers");
var compose = require("../utils/compose");
var isFunction = require("../utils/is-function");
var isObject = require("../utils/is-object");

function bindContractFunction(functionsAPI, contract, method) {
  return function () {
    var tx, params, numInputs, numFixed, cb, i, onSent, onSuccess, onFailed, extraArgument;
    tx = clone(functionsAPI[contract][method]);
    if (!arguments || !arguments.length) {
      if (!tx.send) return rpcInterface.callContractFunction(tx);
      return rpcInterface.transact(tx);
    }
    params = Array.prototype.slice.call(arguments);
    numInputs = (tx.inputs && tx.inputs.length) ? tx.inputs.length : 0;
    if (params && params.length && isObject(params[params.length - 1]) && params[params.length - 1].extraArgument) {
      extraArgument = params.pop();
    }
    if (!tx.send) {
      if (params && isObject(params[0])) {
        cb = params[0].callback;
        if (numInputs) {
          tx.params = new Array(numInputs);
          for (i = 0; i < numInputs; ++i) {
            tx.params[i] = params[0][tx.inputs[i]];
          }
        }
        if (isObject(params[0].tx)) assign(tx, params[0].tx);
      } else {
        if (numInputs) {
          tx.params = new Array(numInputs);
          for (i = 0; i < numInputs; ++i) {
            tx.params[i] = params[i];
          }
        }
        if (params.length > numInputs && isFunction(params[numInputs])) {
          cb = params[numInputs];
        }
      }
      if (tx.fixed && tx.fixed.length) {
        numFixed = tx.fixed.length;
        for (i = 0; i < numFixed; ++i) {
          tx.params[tx.fixed[i]] = abi.fix(tx.params[tx.fixed[i]], "hex");
        }
      }
      if (!tx.parser) {
        if (!isFunction(cb)) return rpcInterface.callContractFunction(tx);
        return rpcInterface.callContractFunction(tx, cb);
      }
      if (!isFunction(cb)) return parsers[tx.parser](rpcInterface.callContractFunction(tx), extraArgument);
      return rpcInterface.callContractFunction(tx, cb, parsers[tx.parser], extraArgument);
    }
    if (params && isObject(params[0])) {
      onSent = params[0].onSent;
      onSuccess = params[0].onSuccess;
      onFailed = params[0].onFailed;
      if (numInputs) {
        tx.params = new Array(numInputs);
        for (i = 0; i < tx.inputs.length; ++i) {
          tx.params[i] = params[0][tx.inputs[i]];
        }
      }
    } else {
      if (numInputs) {
        tx.params = new Array(numInputs);
        for (i = 0; i < tx.inputs.length; ++i) {
          tx.params[i] = params[i];
        }
      }
      if (params.length > numInputs && isFunction(params[numInputs])) {
        onSent = params[numInputs];
      }
      if (params.length > numInputs && isFunction(params[numInputs + 1])) {
        onSuccess = params[numInputs + 1];
      }
      if (params.length > numInputs && isFunction(params[numInputs + 2])) {
        onFailed = params[numInputs + 2];
      }
    }
    if (tx.fixed && tx.fixed.length) {
      numFixed = tx.fixed.length;
      for (i = 0; i < numFixed; ++i) {
        tx.params[tx.fixed[i]] = abi.fix(tx.params[tx.fixed[i]], "hex");
      }
    }
    if (!tx.parser) return rpcInterface.transact(tx, onSent, onSuccess, onFailed);
    return rpcInterface.transact(tx, onSent, compose(parsers[tx.parser], onSuccess, extraArgument), onFailed);
  };
}

module.exports = bindContractFunction;
