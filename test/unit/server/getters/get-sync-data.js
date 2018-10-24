const setupTestDb = require("../../test.database");
const { dispatchJsonRpcRequest } = require("src/server/dispatch-json-rpc-request");

describe("server/getters/get-sync-data", () => {
  const runTest = (t) => {
    test(t.description, async (done) => {
      const db = await setupTestDb();
      t.method = "getSyncData";
      dispatchJsonRpcRequest(db, t, t.params.augur, (err, contractAddresses) => {
        t.assertions(err, contractAddresses);
        db.destroy();
        done();
      });
    });
  };
  runTest({
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
      expect(err).toBeFalsy();
      expect(contractAddresses).toEqual({
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
