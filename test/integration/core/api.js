/**
 * augur.js unit tests
 */

"use strict";

var assert = require("chai").assert;
var async = require("async");
var contracts = require("../../../src/contracts");
var augur = new (require("../../../src"))();
var constants = require("../../../src/constants");
var runner = require("../../runner");

var callOrSendTransaction = function (send) {
  return (send) ? "eth_sendTransaction" : "eth_call";
};

describe("Auto-generated API", function () {
  augur.sync();
  async.forEachOfSeries(augur.store.getState().contractsAPI.functions, function (methods, contract, nextContract) {
    describe(contract, function () {
      var api, methodLists;
      methodLists = {eth_sendTransaction: [], eth_call: []};
      for (var method in methods) {
        if (methods.hasOwnProperty(method)) {
          api = augur.store.getState().contractsAPI.functions[this.title][method];
          methodLists[callOrSendTransaction(api.send)].push({
            method: method,
            parameters: api.signature || []
          });
        }
      }
      for (var send in methodLists) {
        if (methodLists.hasOwnProperty(send)) {
          runner(send, this.title, methodLists[send]);
        }
      }
      nextContract();
    });
  });
});
