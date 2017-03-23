/**
 * Ethereum network connection / contract lookup
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var clone = require("clone");
var abi = require("augur-abi");
var connector = require("ethereumjs-connect");
var Contracts = require("augur-contracts");
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
    return function () {
      var tx, params, numInputs, numFixed, cb, i, onSent, onSuccess, onFailed;
      tx = clone(self.api.functions[contract][method]);
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
    var contract, method;
    methods = methods || this.api.functions;
    for (contract in methods) {
      if (methods.hasOwnProperty(contract)) {
        this[contract] = {};
        for (method in methods[contract]) {
          if (methods[contract].hasOwnProperty(method)) {
            this[contract][method] = this.bindContractMethod(contract, method);
            if (!this[method]) this[method] = this[contract][method];
          }
        }
      }
    }
    return methods;
  },

  sync: function () {
    if (connector && connector.constructor === Object) {
      this.network_id = connector.state.networkID;
      this.from = connector.state.from;
      this.coinbase = connector.state.coinbase;
      this.rpc = connector.rpc;
      if (!connector.state.contracts) {
        connector.configure({contracts: Contracts, api: Contracts.api});
        if (!connector.state.networkID) {
          connector.state.networkID = constants.DEFAULT_NETWORK_ID;
        }
        connector.setContracts();
      }
      this.contracts = connector.state.contracts;
      connector.setupFunctionsAPI();
      connector.setupEventsAPI();
      if (connector.state.api && connector.state.api.functions) {
        this.api = connector.state.api;
      } else {
        this.api = Contracts.api;
      }
      this.tx = this.api.functions;
      this.bindContractAPI();
      return true;
    }
    return false;
  },

  useAccount: function (account) {
    connector.from = account;
    connector.setFrom(account);
    this.sync();
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
    var options, connection, self = this;
    options = {
      contracts: Contracts,
      api: Contracts.api,
      httpAddresses: [],
      wsAddresses: [],
      ipcAddresses: []
    };
    if (rpcinfo) {
      switch (rpcinfo.constructor) {
        case String:
          options.httpAddresses.push(rpcinfo);
          break;
        case Function:
          cb = rpcinfo;
          break;
        case Object:
          if (rpcinfo.httpAddresses) options.httpAddresses = rpcinfo.httpAddresses;
          if (rpcinfo.wsAddresses) options.wsAddresses = rpcinfo.wsAddresses;
          if (rpcinfo.ipcAddresses) options.ipcAddresses = rpcinfo.ipcAddresses;
          if (rpcinfo.http) options.httpAddresses.push(rpcinfo.http);
          if (rpcinfo.ws) options.wsAddresses.push(rpcinfo.ws);
          if (rpcinfo.ipc) options.ipcAddresses.push(rpcinfo.ipc);
          options.contracts = Contracts;
          options.api = Contracts.api;
          break;
        default:
          break;
      }
    }
    if (!utils.is_function(cb)) {
      connection = connector.connect(options);
      this.sync();
      return connection;
    }
    connector.connect(options, function (connection) {
      // check to see if the connection supports subscriptions, if so make note of that so we can leverage it later
      connector.rpc.unsubscribe("0x0123456789abcdef0123456789abcdef", function (errorOrResult) {
        if (errorOrResult.message === "subscription not found") self.subscriptionsSupported = true;
        else if (errorOrResult instanceof Error) self.subscriptionsSupported = false;
        else if (errorOrResult.error) self.subscriptionsSupported = false;
        else self.subscriptionsSupported = true;
        self.sync();
        cb(connection);
      });
    });
  }
};
