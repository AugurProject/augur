/* eslint-env mocha */

"use strict";

var assert = require("chai").assert;
var proxyquire = require("proxyquire").noPreserveCache();
var sinon = require("sinon");

describe("events/get-all-augur-logs", function () {
  var test = function (t) {
    it(t.description, function (done) {
      var chunkBlocks = proxyquire("../../../src/utils/chunk-blocks.js", {
        "../constants": t.mock.constants,
      });
      var getAllAugurLogs = proxyquire("../../../src/events/get-all-augur-logs", {
        "../contracts": t.mock.contracts,
        "../rpc-interface": t.stub.rpcInterface,
        "../utils/chunk-blocks": chunkBlocks,
      });
      var processBatchLogs = sinon.spy(function (batchAugurLogs, chunkOfBlocks) {
        t.assertions(batchAugurLogs, chunkOfBlocks, processBatchLogs.callCount);
      });
      getAllAugurLogs(t.params, processBatchLogs, function (err) {
        assert.equal(processBatchLogs.callCount, 2);
        assert.ifError(err);
        done();
      });
    });
  };
  test({
    description: "from block 10 to block 21, 2 chunks, 3 event logs",
    params: {
      fromBlock: 10,
      toBlock: 21,
    },
    mock: {
      constants: {
        BLOCKS_PER_CHUNK: 10,
      },
      contracts: {
        addresses: {
          4: {
            TestContractName: "0x000000000000000000000000000000000000000c",
          },
        },
        abi: {
          events: {
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
          },
        },
      },
    },
    stub: {
      rpcInterface: {
        getLogs: function (p, callback) {
          assert.deepEqual(p.address, ["0x000000000000000000000000000000000000000c"]);
          if (p.fromBlock === 10) {
            callback(null, [{
              address: "0x000000000000000000000000000000000000000c",
              topics: [
                "0x1000000000000000000000000000000000000000000000000000000000000000",
                "0x2000000000000000000000000000000000000000000000000000000000000000",
              ],
              data: "0x0000000000000000000000000000000000000000000000000000000000000001",
              blockNumber: "0xe",
              transactionIndex: "0x0",
              transactionHash: "0x000000000000000000000000000000000000000000000000000000000000000a",
              blockHash: "0x000000000000000000000000000000000000000000000000000000000000000b",
              logIndex: "0x0",
              removed: false,
            }]);
          } else {
            callback(null, [{
              address: "0x000000000000000000000000000000000000000c",
              topics: [
                "0x1000000000000000000000000000000000000000000000000000000000000000",
                "0x3000000000000000000000000000000000000000000000000000000000000000",
              ],
              data: "0x0000000000000000000000000000000000000000000000000000000000000002",
              blockNumber: "0x96",
              transactionIndex: "0x0",
              transactionHash: "0x00000000000000000000000000000000000000000000000000000000000000aa",
              blockHash: "0x00000000000000000000000000000000000000000000000000000000000000bb",
              logIndex: "0x0",
              removed: false,
            }, {
              address: "0x000000000000000000000000000000000000000c",
              topics: [
                "0x1000000000000000000000000000000000000000000000000000000000000000",
                "0x3000000000000000000000000000000000000000000000000000000000000000",
              ],
              data: "0x0000000000000000000000000000000000000000000000000000000000000003",
              blockNumber: "0x97",
              transactionIndex: "0x0",
              transactionHash: "0x0000000000000000000000000000000000000000000000000000000000000aaa",
              blockHash: "0x0000000000000000000000000000000000000000000000000000000000000bbb",
              logIndex: "0x0",
              removed: false,
            }]);
          }
        },
        getCurrentBlock: function () {
          return {
            number: "0x3e9",
          };
        },
        getNetworkID: function () {
          return "4";
        },
      },
    },
    assertions: function (batchAugurLogs, chunkOfBlocks, callCount) {
      switch (callCount) {
        case 1:
          assert.deepEqual(batchAugurLogs, [
            {
              address: "0x000000000000000000000000000000000000000c",
              testEventInputIndexed: "0x2000000000000000000000000000000000000000000000000000000000000000",
              testEventInputData: "0x0000000000000000000000000000000000000001",
              blockNumber: 14,
              blockHash: "0x000000000000000000000000000000000000000000000000000000000000000b",
              transactionHash: "0x000000000000000000000000000000000000000000000000000000000000000a",
              transactionIndex: 0,
              logIndex: 0,
              removed: false,
              contractName: "TestContractName",
              eventName: "TestEventName",
            }]);
          assert.deepEqual(chunkOfBlocks, {
            fromBlock: 10,
            toBlock: 10,
          });
          break;
        case 2:
          assert.deepEqual(batchAugurLogs, [{
            address: "0x000000000000000000000000000000000000000c",
            testEventInputIndexed: "0x3000000000000000000000000000000000000000000000000000000000000000",
            testEventInputData: "0x0000000000000000000000000000000000000002",
            blockNumber: 150,
            blockHash: "0x00000000000000000000000000000000000000000000000000000000000000bb",
            transactionHash: "0x00000000000000000000000000000000000000000000000000000000000000aa",
            transactionIndex: 0,
            logIndex: 0,
            removed: false,
            contractName: "TestContractName",
            eventName: "TestEventName",
          }, {
            address: "0x000000000000000000000000000000000000000c",
            testEventInputIndexed: "0x3000000000000000000000000000000000000000000000000000000000000000",
            testEventInputData: "0x0000000000000000000000000000000000000003",
            blockNumber: 151,
            blockHash: "0x0000000000000000000000000000000000000000000000000000000000000bbb",
            transactionHash: "0x0000000000000000000000000000000000000000000000000000000000000aaa",
            transactionIndex: 0,
            logIndex: 0,
            removed: false,
            contractName: "TestContractName",
            eventName: "TestEventName",
          }]);
          assert.deepEqual(chunkOfBlocks, {
            fromBlock: 11,
            toBlock: 21,
          });
          break;
        default:
          assert.fail();
      }
    },
  });
});
