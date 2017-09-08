/* eslint-env mocha */

"use strict";

var assert = require("chai").assert;
var BigNumber = require("bignumber.js");
var fix = require("./utils").fix;

describe("trading/positions/calculate-complete-sets-share-totals", function () {
  var test = function (t) {
    it(t.description, function () {
      t.assertions(require("../../../../src/trading/positions/calculate-complete-sets-share-totals")(t.logs));
    });
  };
  test({
    description: "logs completely missing",
    logs: undefined,
    assertions: function (output) {
      assert.deepEqual(output, {});
    }
  });
  test({
    description: "no logs",
    logs: [],
    assertions: function (output) {
      assert.deepEqual(output, {});
    }
  });
  test({
    description: "1 log, 1 market: buy 1 share",
    logs: [{
      data: fix("1"),
      topics: [
        "0x2e6b18139c987afb05efb85deddaa40262aa36c9ddebb9be215461cb22078175",
        "0x0000000000000000000000000000000000000000000000000000000000000b0b",
        "0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
        "0x0000000000000000000000000000000000000000000000000000000000000001"
      ]
    }],
    assertions: function (output) {
      assert.deepEqual(output, {
        "0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff": new BigNumber("1", 10)
      });
    }
  });
  test({
    description: "2 logs, 1 market: [buy 1, sell 1]",
    logs: [{
      data: fix("1"),
      topics: [
        "0x2e6b18139c987afb05efb85deddaa40262aa36c9ddebb9be215461cb22078175",
        "0x0000000000000000000000000000000000000000000000000000000000000b0b",
        "0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
        "0x0000000000000000000000000000000000000000000000000000000000000001"
      ]
    }, {
      data: fix("1"),
      topics: [
        "0x2e6b18139c987afb05efb85deddaa40262aa36c9ddebb9be215461cb22078175",
        "0x0000000000000000000000000000000000000000000000000000000000000b0b",
        "0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
        "0x0000000000000000000000000000000000000000000000000000000000000002"
      ]
    }],
    assertions: function (output) {
      assert.deepEqual(output, {
        "0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff": new BigNumber("0")
      });
    }
  });
  test({
    description: "2 logs, 1 market: [buy 3.1415, sell 2.1]",
    logs: [{
      data: fix("3.1415"),
      topics: [
        "0x2e6b18139c987afb05efb85deddaa40262aa36c9ddebb9be215461cb22078175",
        "0x0000000000000000000000000000000000000000000000000000000000000b0b",
        "0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
        "0x0000000000000000000000000000000000000000000000000000000000000001"
      ]
    }, {
      data: fix("2.1"),
      topics: [
        "0x2e6b18139c987afb05efb85deddaa40262aa36c9ddebb9be215461cb22078175",
        "0x0000000000000000000000000000000000000000000000000000000000000b0b",
        "0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
        "0x0000000000000000000000000000000000000000000000000000000000000002"
      ]
    }],
    assertions: function (output) {
      assert.deepEqual(output, {
        "0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff": new BigNumber("1.0415", 10)
      });
    }
  });
  test({
    description: "2 logs, 1 market: [sell 3.1415, buy 2.1]",
    logs: [{
      data: fix("3.1415"),
      topics: [
        "0x2e6b18139c987afb05efb85deddaa40262aa36c9ddebb9be215461cb22078175",
        "0x0000000000000000000000000000000000000000000000000000000000000b0b",
        "0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
        "0x0000000000000000000000000000000000000000000000000000000000000002"
      ]
    }, {
      data: fix("2.1"),
      topics: [
        "0x2e6b18139c987afb05efb85deddaa40262aa36c9ddebb9be215461cb22078175",
        "0x0000000000000000000000000000000000000000000000000000000000000b0b",
        "0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
        "0x0000000000000000000000000000000000000000000000000000000000000001"
      ]
    }],
    assertions: function (output) {
      assert.deepEqual(output, {
        "0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff": new BigNumber("-1.0415", 10)
      });
    }
  });
  test({
    description: "4 logs, 1 market: [buy 3.1415, buy 2, buy 10.1, sell 0.5]",
    logs: [{
      data: fix("3.1415"),
      topics: [
        "0x2e6b18139c987afb05efb85deddaa40262aa36c9ddebb9be215461cb22078175",
        "0x0000000000000000000000000000000000000000000000000000000000000b0b",
        "0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
        "0x0000000000000000000000000000000000000000000000000000000000000001"
      ]
    }, {
      data: fix("2"),
      topics: [
        "0x2e6b18139c987afb05efb85deddaa40262aa36c9ddebb9be215461cb22078175",
        "0x0000000000000000000000000000000000000000000000000000000000000b0b",
        "0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
        "0x0000000000000000000000000000000000000000000000000000000000000001"
      ]
    }, {
      data: fix("10.1"),
      topics: [
        "0x2e6b18139c987afb05efb85deddaa40262aa36c9ddebb9be215461cb22078175",
        "0x0000000000000000000000000000000000000000000000000000000000000b0b",
        "0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
        "0x0000000000000000000000000000000000000000000000000000000000000001"
      ]
    }, {
      data: fix("0.5"),
      topics: [
        "0x2e6b18139c987afb05efb85deddaa40262aa36c9ddebb9be215461cb22078175",
        "0x0000000000000000000000000000000000000000000000000000000000000b0b",
        "0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
        "0x0000000000000000000000000000000000000000000000000000000000000002"
      ]
    }],
    assertions: function (output) {
      assert.deepEqual(output, {
        "0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff": new BigNumber("14.7415", 10)
      });
    }
  });
  test({
    description: "4 logs, 2 markets: [buy 50 of 1, buy 0.1 of 1, buy 0.42 of 2, sell 0.1 of 2]",
    logs: [{
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
    assertions: function (output) {
      assert.deepEqual(output, {
        "0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff": new BigNumber("50.1", 10),
        "0x8000000000000000000000000000000000000000000000000000000000000000": new BigNumber("0.32", 10)
      });
    }
  });
  test({
    description: "4 logs, 4 markets: [sell 50 of 1, buy 0.1 of 2, buy 0.42 of 3, buy 1 of 4]",
    logs: [{
      data: fix("50"),
      topics: [
        "0x2e6b18139c987afb05efb85deddaa40262aa36c9ddebb9be215461cb22078175",
        "0x0000000000000000000000000000000000000000000000000000000000000b0b",
        "0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
        "0x0000000000000000000000000000000000000000000000000000000000000002"
      ]
    }, {
      data: fix("0.1"),
      topics: [
        "0x2e6b18139c987afb05efb85deddaa40262aa36c9ddebb9be215461cb22078175",
        "0x0000000000000000000000000000000000000000000000000000000000000b0b",
        "0x8000000000000000000000000000000000000000000000000000000000000000",
        "0x0000000000000000000000000000000000000000000000000000000000000001"
      ]
    }, {
      data: fix("0.42"),
      topics: [
        "0x2e6b18139c987afb05efb85deddaa40262aa36c9ddebb9be215461cb22078175",
        "0x0000000000000000000000000000000000000000000000000000000000000b0b",
        "0x00000000000000000000000000000000000000000000000000000000deadbeef",
        "0x0000000000000000000000000000000000000000000000000000000000000001"
      ]
    }, {
      data: fix("1"),
      topics: [
        "0x2e6b18139c987afb05efb85deddaa40262aa36c9ddebb9be215461cb22078175",
        "0x0000000000000000000000000000000000000000000000000000000000000b0b",
        "0x1111111111111111111111111111111111111111111111111111111111111111",
        "0x0000000000000000000000000000000000000000000000000000000000000001"
      ]
    }],
    assertions: function (output) {
      assert.deepEqual(output, {
        "0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff": new BigNumber("-50", 10),
        "0x8000000000000000000000000000000000000000000000000000000000000000": new BigNumber("0.1", 10),
        "0x00000000000000000000000000000000000000000000000000000000deadbeef": new BigNumber("0.42", 10),
        "0x1111111111111111111111111111111111111111111111111111111111111111": new BigNumber("1", 10)
      });
    }
  });
});
