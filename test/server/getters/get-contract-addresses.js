"use strict";

const assert = require("chai").assert;
const { getContractAddresses } = require("../../../build/server/getters/get-contract-addresses");

describe("server/getters/get-contract-addresses", () => {
  const test = (t) => {
    it(t.description, (done) => {
      getContractAddresses(t.params.augur, (err, contractAddresses) => {
        t.assertions(err, contractAddresses);
        done();
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
        },
      },
    },
    assertions: (err, contractAddresses) => {
      assert.ifError(err);
      assert.deepEqual(contractAddresses, {
        version: "the-version-string",
        net_version: 974,
        addresses: {
          universe: "the-universe-address",
          controller: "the-controller-address",
        },
      });
    },
  });
});
