/* eslint-env mocha */

"use strict";

var assert = require("chai").assert;
var proxyquire = require("proxyquire").noPreserveCache();
var mockMarketCreatedData = require("../create-market/mock-market-created-data");

describe("events/find-event-logs-in-log-array", function () {
  var test = function (t) {
    it(t.description, function () {
      var findEventLogsInLogArray = proxyquire("../../../src/events/find-event-logs-in-log-array", {
        "../contracts": t.mock.contracts,
      });
      t.assertions(findEventLogsInLogArray(t.params.contractName, t.params.eventName, t.params.logs));
    });
  };
  test({
    description: "Find single MarketCreated log",
    params: {
      contractName: "Augur",
      eventName: "MarketCreated",
      logs: [{
        address: "0xa227fc3476c56d277b8622e2ac96af44b71228b0",
        topics: [
          "0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925",
          "0x000000000000000000000000bb785f16f6aab68007e897ac3560378d8d6ffd16",
          "0x000000000000000000000000746b04dce139e4cd9add3bb9513c2b0eb2b27956",
        ],
        data: "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
        blockNumber: "0x149eb3",
        transactionHash: "0xca49fcf3a4ef3fedca8bddfe0bf87e34285cc72eabbbd0f5fa6053ff209af272",
        transactionIndex: "0x0",
        blockHash: "0xd859203d97bdfe8c41605b9041d52fad3c4bd5c8324cafc8109cd4fba3518b78",
        logIndex: "0xa",
        removed: false,
      }, {
        address: "0x981ad7d64272db031468756a0332baf20d2f6198",
        topics: [
          mockMarketCreatedData.eventSignature,
          "0x7370616365000000000000000000000000000000000000000000000000000000", //topic
          "0x0000000000000000000000006eabb9367012c0a84473e1e6d7a7ce39a54d77bb", //universe
          "0x00000000000000000000000001114f4bda09ed6c6715cf0baf606b5bce1dc96a", //marketcreator
        ],
        data: mockMarketCreatedData.abiEncodedData,
        blockNumber: "0x149eb3",
        transactionHash: "0xca49fcf3a4ef3fedca8bddfe0bf87e34285cc72eabbbd0f5fa6053ff209af272",
        transactionIndex: "0x0",
        blockHash: "0xd859203d97bdfe8c41605b9041d52fad3c4bd5c8324cafc8109cd4fba3518b78",
        logIndex: "0xb",
        removed: false,
      }],
    },
    mock: {
      contracts: {
        abi: {
          events: {
            Augur: {
              MarketCreated: Object.assign({}, mockMarketCreatedData.abi, { signature: mockMarketCreatedData.eventSignature }),
            },
          },
        },
      },
    },
    assertions: function (logs) {
      assert.isArray(logs);
      assert.strictEqual(logs.length, 1);
      assert.deepEqual(logs, [{
        universe: "0x6eabb9367012c0a84473e1e6d7a7ce39a54d77bb",
        topic: "space",
        marketCreator: "0x01114f4bda09ed6c6715cf0baf606b5bce1dc96a",
        market: "0xbb785f16f6aab68007e897ac3560378d8d6ffd16",
        marketCreationFee: "0.010000000006",
        minPrice: "0",
        maxPrice: "10000",
        marketType: "0",
        description: "Will SpaceX successfully complete a manned flight to the International Space Station by the end of 2018?",
        extraInfo: JSON.parse(mockMarketCreatedData.params.extraInfo),
        address: "0x981ad7d64272db031468756a0332baf20d2f6198",
        removed: false,
        transactionHash: "0xca49fcf3a4ef3fedca8bddfe0bf87e34285cc72eabbbd0f5fa6053ff209af272",
        transactionIndex: 0,
        logIndex: 11,
        blockNumber: 1351347,
        blockHash: "0xd859203d97bdfe8c41605b9041d52fad3c4bd5c8324cafc8109cd4fba3518b78",
        contractName: "Augur",
        eventName: "MarketCreated",
      }]);
    },
  });
});
