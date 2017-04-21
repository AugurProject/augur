/**
 * Ethereum network connection / contract lookup.
 */

"use strict";

var clone = require("clone");
var abi = require("augur-abi");
var rpc = require("ethrpc");
var connector = require("ethereumjs-connect");
var Contracts = require("augur-contracts");
var constants = require("../constants");
var compose = require("../utils/compose");
var isFunction = require("../utils/is-function");
var isObject = require("../utils/is-object");
var filters = require("../filters");

module.exports = {

  /**
   * Direct no-frills bindings to Augur's Serpent (contract) API.
   *  - Parameter positions and types are the same as the underlying
   *    contract method's parameters.
   *  - Parameters should be passed in exactly as they would be
   *    passed to the contract method (e.g., if the contract method
   *    expects a fixed-point number, you must do that conversion
   *    yourself and pass the fixed-point number in).
   */
  bindContractMethod: function (functionsAPI, contract, method) {
    var self = this;
    return function () {
      var tx, params, numInputs, numFixed, cb, i, onSent, onSuccess, onFailed;
      tx = clone(functionsAPI[contract][method]);
      if (!arguments || !arguments.length) {
        if (!tx.send) return self.fire(tx);
        return self.transact(tx);
      }
      params = Array.prototype.slice.call(arguments);
      numInputs = (tx.inputs && tx.inputs.length) ? tx.inputs.length : 0;
      if (!tx.send) {
        if (params && params[0] !== undefined && params[0] !== null && params[0].constructor === Object) {
          cb = params[0].callback;
          if (numInputs) {
            tx.params = new Array(numInputs);
            for (i = 0; i < numInputs; ++i) {
              tx.params[i] = params[0][tx.inputs[i]];
            }
          }
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
          if (!isFunction(cb)) return self.fire(tx);
          return self.fire(tx, cb);
        }
        if (!isFunction(cb)) return self[tx.parser](self.fire(tx));
        return self.fire(tx, cb, self[tx.parser]);
      }
      if (params && params[0] !== undefined && params[0] !== null && params[0].constructor === Object) {
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
      if (!tx.parser) {
        return self.transact(tx, onSent, onSuccess, onFailed);
      }
      return self.transact(tx, onSent, compose(self[tx.parser], onSuccess), onFailed);
    };
  },

  bindContractAPI: function (functionsAPI) {
    var contract, method;
    for (contract in functionsAPI) {
      if (functionsAPI.hasOwnProperty(contract)) {
        this[contract] = {};
        for (method in functionsAPI[contract]) {
          if (functionsAPI[contract].hasOwnProperty(method)) {
            this[contract][method] = this.bindContractMethod(functionsAPI, contract, method);
            // TODO remove root-level auto bindings
            if (!this[method]) this[method] = this[contract][method];
          }
        }
      }
    }
    return functionsAPI;
  },

  // useAccount: function (address) {
  //   store.dispatch({ type: "SET_FROM_ADDRESS", fromAddress: address });
  //   store.dispatch({
  //     type: "SET_FUNCTIONS_API",
  //     functionsAPI: connector.setFrom(store.getState().contractsAPI.functions, address)
  //   });
  // },

  /**
   * @param connectOptions {Object|string=} Two forms accepted:
   *    1. Object with connection info fields:
   *       { http: "https://eth3.augur.net",
   *         ipc: "/path/to/geth.ipc",
   *         ws: "wss://ws.augur.net" }
   *    2. URL string for HTTP RPC: "https://eth3.augur.net"
   * @param callback {function=} Callback function.
   */
  connect: function (connectOptions, callback) {
    var options, vitals, self = this;
    options = {
      rpc: rpc,
      contracts: Contracts,
      api: Contracts.api,
      httpAddresses: [],
      wsAddresses: [],
      ipcAddresses: []
    };
    if (connectOptions) {
      switch (connectOptions.constructor) {
        case String:
          options.httpAddresses.push(connectOptions);
          break;
        case Function:
          callback = connectOptions;
          break;
        case Object:
          if (connectOptions.httpAddresses) options.httpAddresses = connectOptions.httpAddresses;
          if (connectOptions.wsAddresses) options.wsAddresses = connectOptions.wsAddresses;
          if (connectOptions.ipcAddresses) options.ipcAddresses = connectOptions.ipcAddresses;
          if (connectOptions.http) options.httpAddresses.push(connectOptions.http);
          if (connectOptions.ws) options.wsAddresses.push(connectOptions.ws);
          if (connectOptions.ipc) options.ipcAddresses.push(connectOptions.ipc);
          options.contracts = Contracts;
          options.api = Contracts.api;
          break;
        default:
          break;
      }
    }
    if (!isFunction(callback)) {
      vitals = connector.connect(options);
      if (vitals instanceof Error) return vitals;
      vitals.contracts = vitals.contracts || Contracts[constants.DEFAULT_NETWORK_ID];
      vitals.api = (vitals.api && vitals.api.functions) ? vitals.api : Contracts.api;
      this.bindContractAPI(vitals.api.functions);
      this.rpc = vitals.rpc;
      this.filters = filters(this.rpc.getBlockAndLogStreamer);
      return vitals;
    }
    connector.connect(options, function (err, vitals) {
      if (err) return callback(err);
      vitals.contracts = vitals.contracts || Contracts[constants.DEFAULT_NETWORK_ID];
      vitals.api = (vitals.api && vitals.api.functions) ? vitals.api : Contracts.api;
      self.bindContractAPI(vitals.api.functions);
      self.rpc = vitals.rpc;
      self.filters = filters(self.rpc.getBlockAndLogStreamer);
      callback(vitals);
    });
  }
};
