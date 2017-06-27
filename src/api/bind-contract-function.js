"use strict";

var abi = require("augur-abi");
var assign = require("lodash.assign");
var rpcInterface = require("../rpc-interface");
var parsers = require("../parsers");
var compose = require("../utils/compose");
var isFunction = require("../utils/is-function");
var isObject = require("../utils/is-object");

function bindContractFunction(staticAPI) {
  return function () {
    var tx, params, numInputs, numFixed, cb, i, onSent, onSuccess, onFailed, extraArgument, signer;
    tx = assign({}, staticAPI);
    if (!arguments || !arguments.length) {
      if (!tx.send) return rpcInterface.callContractFunction(tx);
      return rpcInterface.transact(tx);
    }
    params = Array.prototype.slice.call(arguments);
    numInputs = (tx.inputs && tx.inputs.length) ? tx.inputs.length : 0;
    if (params && params.length && isObject(params[params.length - 1]) && params[params.length - 1].extraArgument) {
      extraArgument = params.pop().extraArgument;
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
      }
      if (isFunction(params[params.length - 1])) cb = params.pop();
      if (tx.fixed && tx.fixed.length) {
        numFixed = tx.fixed.length;
        for (i = 0; i < numFixed; ++i) {
          tx.params[tx.fixed[i]] = abi.fix(tx.params[tx.fixed[i]], "hex");
        }
      }
      console.log("eth_call:", tx);
      if (!tx.parser) {
        if (!isFunction(cb)) return rpcInterface.callContractFunction(tx);
        return rpcInterface.callContractFunction(tx, cb);
      }
      if (!isFunction(cb)) return parsers[tx.parser](rpcInterface.callContractFunction(tx), extraArgument);
      return rpcInterface.callContractFunction(tx, cb, parsers[tx.parser], extraArgument);
    }
    if (params && isObject(params[0])) {
      console.log("params:", params);
      onSent = params[0].onSent;
      onSuccess = params[0].onSuccess;
      onFailed = params[0].onFailed;
      if (numInputs) {
        tx.params = new Array(numInputs);
        for (i = 0; i < tx.inputs.length; ++i) {
          tx.params[i] = params[0][tx.inputs[i]];
        }
      }
      if (isObject(params[0].tx)) assign(tx, params[0].tx);
      if (params[0]._signer) signer = params[0]._signer;
    }
    if (tx.fixed && tx.fixed.length) {
      numFixed = tx.fixed.length;
      for (i = 0; i < numFixed; ++i) {
        tx.params[tx.fixed[i]] = abi.fix(tx.params[tx.fixed[i]], "hex");
      }
    }
    console.log("eth_sendTransaction:", tx);
    if (!tx.parser) return rpcInterface.transact(tx, signer, onSent, onSuccess, onFailed);
    return rpcInterface.transact(tx, signer, onSent, compose(parsers[tx.parser], onSuccess, extraArgument), onFailed);
  };
}

module.exports = bindContractFunction;
