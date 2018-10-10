/* eslint-env mocha */

"use strict";

var assert = require("chai").assert;
var proxyquire = require("proxyquire").noPreserveCache();
var mockMarketCreatedData = require("./mock-market-created-data");

describe("create-market/get-market-from-create-market-receipt", function () {
  var test = function (t) {
    it(t.description, function (done) {
      var getMarketFromCreateMarketReceipt = proxyquire("../../../src/create-market/get-market-from-create-market-receipt", {
        "../rpc-interface": t.stub.ethrpc,
      });
      getMarketFromCreateMarketReceipt(t.params.transactionHash, function (err, marketId) {
        t.assertions(err, marketId);
        done();
      });
    });
  };
  test({
    description: "happy path",
    params: {
      transactionHash: "TRANSACTION_HASH",
    },
    stub: {
      ethrpc: {
        getTransactionReceipt: function (transactionHash, callback) {
          assert.strictEqual(transactionHash, "TRANSACTION_HASH");
          callback(null, {
            blockHash: "0xd859203d97bdfe8c41605b9041d52fad3c4bd5c8324cafc8109cd4fba3518b78",
            blockNumber: "0x149eb3",
            contractAddress: null,
            cumulativeGasUsed: "0x2b38dc",
            from: "0x01114f4bda09ed6c6715cf0baf606b5bce1dc96a",
            gasUsed: "0x2b38dc",
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
                "0x0000000000000000000000006eabb9367012c0a84473e1e6d7a7ce39a54d77bb",
                "0x7370616365000000000000000000000000000000000000000000000000000000",
                "0x00000000000000000000000001114f4bda09ed6c6715cf0baf606b5bce1dc96a",
              ],
              data: mockMarketCreatedData.abiEncodedData,
              blockNumber: "0x149eb3",
              transactionHash: "0xca49fcf3a4ef3fedca8bddfe0bf87e34285cc72eabbbd0f5fa6053ff209af272",
              transactionIndex: "0x0",
              blockHash: "0xd859203d97bdfe8c41605b9041d52fad3c4bd5c8324cafc8109cd4fba3518b78",
              logIndex: "0xb",
              removed: false,
            }],
            logsBloom: "0x00000000010000000000004000004001000000000000040000000000000000000000020000000000000020000100000000000000100006000004000000200080000206000000000000004008010000000000000400800100000000000000006000000000000000000000000000000000020000000000000804004010000000120000020000000000010040000000000000004001000000000000000000000200060001000000002020000100000008000010000010010000000000000000020000400002000400000000000000020000000000000000000000000020040000000090000040000800000000000000000000000000000000000000000000100000",
            status: "0x1",
            to: "0x6eabb9367012c0a84473e1e6d7a7ce39a54d77bb",
            transactionHash: "0xca49fcf3a4ef3fedca8bddfe0bf87e34285cc72eabbbd0f5fa6053ff209af272",
            transactionIndex: "0x0",
          });
        },
      },
    },
    assertions: function (err, marketId) {
      assert.isNull(err);
      assert.strictEqual(marketId, "0xbb785f16f6aab68007e897ac3560378d8d6ffd16");
    },
  });
});
