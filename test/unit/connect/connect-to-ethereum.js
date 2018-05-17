/* eslint-env mocha */

"use strict";

var assign = require("lodash").assign;
var os = require("os");
var assert = require("chai").assert;
var connectToEthereum = require("../../../src/connect/connect-to-ethereum");

function testConnectToEthereum(transportType, transportAddress) {
  var ethrpcStub = {
    connect: function (configuration, callback) { callback(null); },
    getNetworkID: function () { return null; },
    getCoinbase: function () { return null; },
  };
  function test(t) {
    it(t.description, function (done) {
      var connectOptions = {
        http: (transportType === "HTTP") ? transportAddress : undefined,
        ws: (transportType === "WS") ? transportAddress : undefined,
        ipc: (transportType === "IPC") ? transportAddress : undefined,
        contracts: t.params.options.contracts,
        abi: t.params.options.abi,
      };
      connectToEthereum(assign({}, ethrpcStub, t.params.ethrpc), connectOptions, function (err, contracts, functionsAbi, eventsAbi) {
        t.assertions(err, contracts, functionsAbi, eventsAbi);
        done();
      });
    });
  }
  it("connects with array options", function (done) {
    var connectOptions = { contracts: {}, abi: {} };
    switch (transportType) {
      case "HTTP":
        connectOptions.httpAddresses = [transportAddress];
        break;
      case "WS":
        connectOptions.wsAddresses = [transportAddress];
        break;
      case "IPC":
        connectOptions.ipcAddresses = [transportAddress];
        break;
      default:
        throw new Error("Unknown transport type: " + transportType);
    }
    connectToEthereum(ethrpcStub, connectOptions, function (err, contracts, functionsAbi, eventsAbi) {
      assert.isNull(err);
      assert.deepEqual(contracts, {});
      assert.isUndefined(functionsAbi);
      assert.isUndefined(eventsAbi);
      done();
    });
  });
  test({
    description: "connection sequence without abi",
    params: {
      ethrpc: {
        connect: function (configuration, callback) { callback(null); },
        getNetworkID: function () { return "3"; },
        getCoinbase: function () { return "0xb0b"; },
      },
      options: {
        contracts: {
          3: {
            contract1: "0xc1",
            contract2: "0xc2",
          },
        },
      },
    },
    assertions: function (err, contracts, functionsAbi, eventsAbi) {
      assert.isNull(err);
      assert.deepEqual(contracts, { contract1: "0xc1", contract2: "0xc2" });
      assert.isUndefined(functionsAbi);
      assert.isUndefined(eventsAbi);
    },
  });
  test({
    description: "connection sequence with abi",
    params: {
      ethrpc: {
        connect: function (configuration, callback) { callback(null); },
        getNetworkID: function () { return "3"; },
        getCoinbase: function () { return "0xb0b"; },
      },
      options: {
        contracts: {
          3: { contract1: "0xc1", contract2: "0xc2" },
        },
        abi: {
          events: {
            contract1: { event1: { contract: "contract1" }, event2: { contract: "contract1" } },
            contract2: { event3: { contract: "contract2" } },
          },
          functions: {
            contract1: { method1: {}, method2: {} },
            contract2: { method1: {} },
          },
        },
      },
    },
    assertions: function (err, contracts, functionsAbi, eventsAbi) {
      assert.isNull(err);
      assert.deepEqual(contracts, { contract1: "0xc1", contract2: "0xc2" });
      assert.deepEqual(functionsAbi, {
        contract1: { method1: { from: "0xb0b", to: "0xc1" }, method2: { from: "0xb0b", to: "0xc1" } },
        contract2: { method1: { from: "0xb0b", to: "0xc2" } },
      });
      assert.deepEqual(eventsAbi, {
        contract1: { event1: { address: "0xc1", contract: "contract1" }, event2: { address: "0xc1", contract: "contract1" } },
        contract2: { event3: { address: "0xc2", contract: "contract2" } },
      });
    },
  });
}

describe("connect/connect-to-ethereum", function () {
  describe("HTTP", testConnectToEthereum.bind(null, "HTTP", "http://localhost:1337"));
  describe("WS", testConnectToEthereum.bind(null, "WS", "ws://localhost:1337"));
  describe("IPC", testConnectToEthereum.bind(null, "IPC", (os.type() === "Windows_NT") ? "\\\\.\\pipe\\TestRPC" : "testrpc.ipc"));
});
