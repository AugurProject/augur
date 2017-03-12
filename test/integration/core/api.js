/**
 * augur.js unit tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var assert = require("chai").assert;
var async = require("async");
var contracts = require("augur-contracts");
var augur = require("../../../src");
var constants = require("../../../src/constants");
var runner = require("../../runner");

var invoke = function (send) {
  return (send) ? "eth_sendTransaction" : "eth_call";
};

describe("Auto-generated API", function () {
  augur.sync();
  async.forEachOfSeries(augur.api.functions, function (methods, contract, nextContract) {
    describe(contract, function () {
      var api, methodLists;
      methodLists = {eth_sendTransaction: [], eth_call: []};
      for (var method in methods) {
        if (methods.hasOwnProperty(method)) {
          api = augur.api.functions[this.title][method];
          methodLists[invoke(api.send)].push({
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
