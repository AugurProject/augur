/**
 * Ethereum network connection / contract lookup
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var clone = require("clone");
var abi = require("augur-abi");
var connector = require("ethereumjs-connect");
var constants = require("../constants");
var utils = require("../utilities");

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
  bindContractMethod: function (contract, method) {
    var self = this;
    return function (args) {
      var tx, params, numInputs, numFixed, cb, i, onSent, onSuccess, onFailed;
      tx = clone(self.api.functions[contract][method]);
      if (!arguments) {
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
          if (params.length > numInputs && utils.is_function(params[numInputs])) {
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
          if (!utils.is_function(cb)) return self.fire(tx);
          return self.fire(tx, cb);
        }
        if (!utils.is_function(cb)) return self[tx.parser](self.fire(tx));
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
        if (params.length > numInputs && utils.is_function(params[numInputs])) {
          onSent = params[numInputs];
        }
        if (params.length > numInputs && utils.is_function(params[numInputs + 1])) {
          onSuccess = params[numInputs + 1];
        }
        if (params.length > numInputs && utils.is_function(params[numInputs + 2])) {
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
      return self.transact(tx, onSent, utils.compose(self[tx.parser], onSuccess), onFailed);
    };
  },
  bindContractAPI: function (methods) {
    methods = methods || this.api.functions;
    for (var contract in methods) {
      if (!methods.hasOwnProperty(contract)) continue;
      this[contract] = {};
      for (var method in methods[contract]) {
        if (!methods[contract].hasOwnProperty(method)) continue;
        this[contract][method] = this.bindContractMethod(contract, method);
        if (!this[method]) this[method] = this[contract][method];
      }
    }
    return methods;
  },

  sync: function () {
    if (connector && connector.constructor === Object) {
      this.network_id = connector.network_id;
      this.from = connector.from;
      this.coinbase = connector.coinbase;
      this.rpc = connector.rpc;
      this.api = connector.api;
      this.tx = connector.tx;
      this.contracts = connector.contracts;
      this.init_contracts = connector.init_contracts;
      this.bindContractAPI();
      return true;
    }
    return false;
  },

  useAccount: function (account) {
    connector.from = account;
    connector.from_field_tx(account);
    this.sync();
  },

  updateContracts: function (newContracts) {
    if (connector && connector.constructor === Object) {
      connector.contracts = clone(newContracts);
      connector.update_contracts();
      return this.sync();
    }
    return false;
  },

  /**
   * @param rpcinfo {Object|string=} Two forms accepted:
   *    1. Object with connection info fields:
   *       { http: "https://eth3.augur.net",
   *         ipc: "/path/to/geth.ipc",
   *         ws: "wss://ws.augur.net" }
   *    2. URL string for HTTP RPC: "https://eth3.augur.net"
   * @param cb {function=} Callback function.
   */
  connect: function (rpcinfo, cb) {
    var options = {};
    if (rpcinfo) {
      switch (rpcinfo.constructor) {
        case String:
          options.http = rpcinfo;
          break;
        case Function:
          cb = rpcinfo;
          options.http = null;
          break;
        case Object:
          options = rpcinfo;
          break;
        default:
          options.http = null;
      }
    }
    if (!utils.is_function(cb)) {
      var connection = connector.connect(options);
      this.sync();
      if (options.augurNodes) this.augurNode.bootstrap(options.augurNodes);
      return connection;
    }
    var self = this;
    connector.connect(options, function (connection) {
      self.sync();
      if (options.augurNodes){
        self.augurNode.bootstrap(options.augurNodes, function () {
          cb(connection);
        });
      }else{
        cb(connection);
      }
    });
  }
};
