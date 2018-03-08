/* eslint-env mocha */

"use strict";

var assert = require("chai").assert;
var setContracts = require("../../../src/connect/set-contracts");

describe("connect/set-contracts", function () {
  var test = function (t) {
    it(t.description, function () {
      t.assertions(setContracts(t.params.networkID, t.params.allContracts));
    });
  };
  test({
    description: "set active contracts to network ID",
    params: {
      networkID: "3",
      allContracts: {
        1: { myContract: "0xc1" },
        3: { myContract: "0xc3" },
      },
    },
    assertions: function (contracts) {
      assert.deepEqual(contracts, { myContract: "0xc3" });
    },
  });
  test({
    description: "return empty object if network ID not included in allContracts",
    params: {
      networkID: "10101",
      allContracts: {
        1: { myContract: "0xc1" },
        3: { myContract: "0xc3" },
      },
    },
    assertions: function (contracts) {
      assert.deepEqual(contracts, {});
    },
  });
});
