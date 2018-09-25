/* eslint-env mocha */

"use strict";

var assert = require("chai").assert;
var proxyquire = require("proxyquire").noPreserveCache();
var noop = require("../../../src/utils/noop");

var mockContractAddresses = {
  4: {
    TestContractName: "0x000000000000000000000000000000000000000c",
  },
};
var mockEventsAbi = {
  TestContractName: {
    TestEventName: {
      inputs: [{
        indexed: true,
        type: "bytes32",
        name: "testEventInputIndexed",
      }, {
        indexed: false,
        type: "address",
        name: "testEventInputData",
      }],
      type: "event",
      name: "TestEventName(int256,address)",
      signature: "0x1000000000000000000000000000000000000000000000000000000000000000",
    },
  },
};

describe("events/start-blockchain-event-listeners", function () {
  var test = function (t) {
    it(t.description, function (done) {
      var startBlockchainEventListeners = proxyquire("../../../src/events/start-blockchain-event-listeners", {
        "./add-filter": t.stub.addFilter,
        "../contracts": t.mock.contracts,
        "../rpc-interface": t.stub.rpcInterface,
      });
      startBlockchainEventListeners(t.params, undefined, function (err) {
        t.assertions(err);
        done();
      });
    });
  };
  test({
    description: "happy path",
    params: {
      TestContractName: { TestEventName: noop },
    },
    mock: {
      contracts: {
        addresses: mockContractAddresses,
        abi: { events: mockEventsAbi },
      },
    },
    stub: {
      addFilter: function (blockStream, contractName, callbacks, contractAbi, contracts, addSubscription) {
        assert.isFunction(blockStream.subscribeToOnLogAdded);
        assert.isFunction(blockStream.subscribeToOnLogRemoved);
        assert.strictEqual(contractName, "TestContractName");
        assert.deepEqual(callbacks, { TestEventName: noop });
        assert.deepEqual(contractAbi, mockEventsAbi.TestContractName);
        assert.deepEqual(contracts, mockContractAddresses["4"]);
        assert.isFunction(addSubscription);
        return true;
      },
      rpcInterface: {
        getBlockStream: function () {
          return {
            subscribeToOnLogAdded: function (callback) {
              assert.isFunction(callback);
            },
            subscribeToOnLogRemoved: function (callback) {
              assert.isFunction(callback);
            },
          };
        },
        getNetworkID: function () {
          return "4";
        },
      },
    },
    assertions: function (err) {
      assert.isNull(err);
    },
  });
});
