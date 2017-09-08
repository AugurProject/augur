/* eslint-env mocha */

"use strict";

var assert = require("chai").assert;
var BigNumber = require("bignumber.js");
var fix = require("./utils").fix;

describe("calculateShareTotals", function () {
  var test = function (t) {
    it(t.description, function () {
      t.assertions(require("../../../../src/trading/positions/calculate-share-totals")(t.logs));
    });
  };
  test({
    description: "no logs",
    logs: {
      shortAskBuyCompleteSets: [],
      shortSellBuyCompleteSets: [],
      sellCompleteSets: []
    },
    assertions: function (output) {
      assert.deepEqual(output, {
        shortAskBuyCompleteSets: {},
        shortSellBuyCompleteSets: {},
        sellCompleteSets: {}
      });
    }
  });
  test({
    description: "4 short ask logs, 1 short sell log, 2 complete sets logs",
    logs: {
      shortAskBuyCompleteSets: [{
        data: fix("50"),
        topics: [
          "0x2e6b18139c987afb05efb85deddaa40262aa36c9ddebb9be215461cb22078175",
          "0x0000000000000000000000000000000000000000000000000000000000000b0b",
          "0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
          "0x0000000000000000000000000000000000000000000000000000000000000001"
        ]
      }, {
        data: fix("0.1"),
        topics: [
          "0x2e6b18139c987afb05efb85deddaa40262aa36c9ddebb9be215461cb22078175",
          "0x0000000000000000000000000000000000000000000000000000000000000b0b",
          "0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
          "0x0000000000000000000000000000000000000000000000000000000000000001"
        ]
      }, {
        data: fix("0.42"),
        topics: [
          "0x2e6b18139c987afb05efb85deddaa40262aa36c9ddebb9be215461cb22078175",
          "0x0000000000000000000000000000000000000000000000000000000000000b0b",
          "0x8000000000000000000000000000000000000000000000000000000000000000",
          "0x0000000000000000000000000000000000000000000000000000000000000001"
        ]
      }, {
        data: fix("0.1"),
        topics: [
          "0x2e6b18139c987afb05efb85deddaa40262aa36c9ddebb9be215461cb22078175",
          "0x0000000000000000000000000000000000000000000000000000000000000b0b",
          "0x8000000000000000000000000000000000000000000000000000000000000000",
          "0x0000000000000000000000000000000000000000000000000000000000000002"
        ]
      }],
      shortSellBuyCompleteSets: [{
        data: "0x"+
              "1000000000000000000000000000000000000000000000000000000000000000"+
              fix("1").replace("0x", "")+
              "0000000000000000000000000000000100000000000000000000000000000000"+
              "0000000000000000000000000000000000000000000000000000000000000001", // outcome
        topics: [
          "0x17c6c0dcf7960856660a58fdb9238dc76130b17e20b6511d08e811a3a92ca8c7",
          "0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
          "0x000000000000000000000000000000000000000000000000000000000000d00d", // taker
          "0x0000000000000000000000000000000000000000000000000000000000000b0b"  // maker
        ]
      }],
      sellCompleteSets: [{
        data: fix("3.1415"),
        topics: [
          "0x2e6b18139c987afb05efb85deddaa40262aa36c9ddebb9be215461cb22078175",
          "0x0000000000000000000000000000000000000000000000000000000000000b0b",
          "0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
          "0x0000000000000000000000000000000000000000000000000000000000000002"
        ]
      }]
    },
    assertions: function (output) {
      assert.deepEqual(output, {
        shortAskBuyCompleteSets: {
          "0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff": new BigNumber("50.1", 10),
          "0x8000000000000000000000000000000000000000000000000000000000000000": new BigNumber("0.32", 10)
        },
        shortSellBuyCompleteSets: {
          "0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff": new BigNumber("1", 10)
        },
        sellCompleteSets: {
          "0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff": new BigNumber("-3.1415", 10)
        }
      });
    }
  });
});
