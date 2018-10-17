"use strict";

const assert = require("chai").assert;
const setupTestDb = require("../../test.database");
const { dispatchJsonRpcRequest } = require("../../../../src/server/dispatch-json-rpc-request");

describe("server/getters/get-sync-data", () => {
  const test = (t) => {
    it(t.description, (done) => {
      setupTestDb((err, db) => {
        if (err) assert.fail(err);
        t.method = "getSyncData";
        dispatchJsonRpcRequest(db, t, t.params.augur, (err, contractAddresses) => {
          t.assertions(err, contractAddresses);
          db.destroy();
          done();
        });
      });
    });
  };
  test({
    description: "get contract addresses",
    params: {
      augur: {
        version: "the-version-string",
        contracts: {
          addresses: {
            974: {
              universe: "the-universe-address",
              controller: "the-controller-address",
            },
          },
        },
        rpc: {
          getNetworkID: () => 974,
          getCurrentBlock: () => {
            return {
              hash: "0x1500002",
              timestamp: "0x59f28308",
              number: "0x16e362",
            };
          },
        },
      },
    },
    assertions: (err, contractAddresses) => {
      assert.ifError(err);
      assert.deepEqual(contractAddresses, {
        version: "the-version-string",
        net_version: 974,
        netId: 974,
        isSyncFinished: false,
        addresses: {
          universe: "the-universe-address",
          controller: "the-controller-address",
        },
        highestBlock: {
          hash: "0x1500002",
          number: 1500002,
          timestamp: 1509065480,
        },
        lastProcessedBlock: {
          hash: "0x1500001",
          number: 1500001,
          timestamp: 1509065474,
        },
      });
    },
  });
});
