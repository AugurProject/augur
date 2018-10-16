"use strict";

const assert = require("chai").assert;
const setupTestDb = require("../../test.database");
const { dispatchJsonRpcRequest } = require("../../../../src/server/dispatch-json-rpc-request");

describe("server/getters/get-unclaimed-market-creator-fees", () => {
  const test = (t) => {
    it(t.description, (done) => {
      setupTestDb((err, db) => {
        if (err) assert.fail(err);
        t.method = "getUnclaimedMarketCreatorFees";
        dispatchJsonRpcRequest(db,  t, t.params.augur, (err, marketFees) => {
          t.assertions(err, marketFees);
          db.destroy();
          done();
        });
      });
    });
  };
  test({
    description: "get fees by specifying unfinalized market IDs",
    params: {
      marketIds: [
        "0x0000000000000000000000000000000000000001",
        "0x0000000000000000000000000000000000000002",
      ],
      augur: {
        contracts: {
          addresses: {
            974: {
              Cash: "CASH",
            },
          },
        },
        rpc: {
          getNetworkID: () => 974,
        },
      },
    },
    assertions: (err, marketFees) => {
      assert.ifError(err);
      assert.deepEqual(marketFees, [
        {
          marketId: "0x0000000000000000000000000000000000000001",
          unclaimedFee: "0",
        },
        {
          marketId: "0x0000000000000000000000000000000000000002",
          unclaimedFee: "0",
        },
      ]);
    },
  });
  test({
    description: "Empty marketIds array",
    params: {
      marketIds: [],
      augur: {
        contracts: {
          addresses: {
            974: {
              Cash: "CASH",
            },
          },
        },
        rpc: {
          getNetworkID: () => 974,
        },
      },
    },
    assertions: (err, marketFees) => {
      assert.ifError(err);
      assert.deepEqual(marketFees, []);
    },
  });
});
