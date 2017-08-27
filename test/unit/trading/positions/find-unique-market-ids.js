"use strict";

var assert = require("chai").assert;

describe("trading/positions/find-unique-market-ids", function () {
  var test = function (t) {
    it(t.description, function () {
      t.assertions(require("../../../../src/trading/positions/find-unique-market-ids")(t.shareTotals));
    });
  };
  test({
    description: "no markets",
    shareTotals: {
      shortAskBuyCompleteSets: {},
      shortSellBuyCompleteSets: {},
      sellCompleteSets: {}
    },
    assertions: function (output) {
      assert.deepEqual(output, []);
    }
  });
  test({
    description: "1 short ask market, 1 unique",
    shareTotals: {
      shortAskBuyCompleteSets: {"0x1": null},
      shortSellBuyCompleteSets: {},
      sellCompleteSets: {}
    },
    assertions: function (output) {
      assert.deepEqual(output, ["0x1"]);
    }
  });
  test({
    description: "1 short sell market, 1 unique",
    shareTotals: {
      shortAskBuyCompleteSets: {},
      shortSellBuyCompleteSets: {"0x1": null},
      sellCompleteSets: {}
    },
    assertions: function (output) {
      assert.deepEqual(output, ["0x1"]);
    }
  });
  test({
    description: "1 complete sets market, 1 unique",
    shareTotals: {
      shortAskBuyCompleteSets: {},
      shortSellBuyCompleteSets: {},
      sellCompleteSets: {"0x1": null}
    },
    assertions: function (output) {
      assert.deepEqual(output, ["0x1"]);
    }
  });
  test({
    description: "2 short ask markets, 2 unique",
    shareTotals: {
      shortAskBuyCompleteSets: {"0x1": null, "0x2": null},
      shortSellBuyCompleteSets: {},
      sellCompleteSets: {}
    },
    assertions: function (output) {
      assert.deepEqual(output, ["0x1", "0x2"]);
    }
  });
  test({
    description: "2 short sell markets, 2 unique",
    shareTotals: {
      shortAskBuyCompleteSets: {},
      shortSellBuyCompleteSets: {"0x1": null, "0x2": null},
      sellCompleteSets: {}
    },
    assertions: function (output) {
      assert.deepEqual(output, ["0x1", "0x2"]);
    }
  });
  test({
    description: "2 short ask markets, 1 short sell market, 3 unique",
    shareTotals: {
      shortAskBuyCompleteSets: {"0x1": null, "0x2": null},
      shortSellBuyCompleteSets: {"0x3": null},
      sellCompleteSets: {}
    },
    assertions: function (output) {
      assert.deepEqual(output, ["0x1", "0x2", "0x3"]);
    }
  });
  test({
    description: "2 short ask markets, 1 short sell market, 2 unique",
    shareTotals: {
      shortAskBuyCompleteSets: {"0x1": null, "0x2": null},
      shortSellBuyCompleteSets: {"0x1": null},
      sellCompleteSets: {}
    },
    assertions: function (output) {
      assert.deepEqual(output, ["0x1", "0x2"]);
    }
  });
  test({
    description: "2 short ask markets, 1 short sell market, 3 complete sets markets, 3 unique",
    shareTotals: {
      shortAskBuyCompleteSets: {"0x1": null, "0x2": null},
      shortSellBuyCompleteSets: {"0x3": null},
      sellCompleteSets: {"0x1": null, "0x2": null, "0x3": null}
    },
    assertions: function (output) {
      assert.deepEqual(output, ["0x1", "0x2", "0x3"]);
    }
  });
  test({
    description: "3 short ask markets, 3 short sell markets, 1 complete sets market, 7 unique",
    shareTotals: {
      shortAskBuyCompleteSets: {"0x1": null, "0x2": null, "0x3": null},
      shortSellBuyCompleteSets: {"0x4": null, "0x5": null, "0x6": null},
      sellCompleteSets: {"0x7": null}
    },
    assertions: function (output) {
      assert.deepEqual(output, ["0x1", "0x2", "0x3", "0x4", "0x5", "0x6", "0x7"]);
    }
  });
  test({
    description: "3 short ask markets, 3 short sell markets, 1 complete sets market, 6 unique",
    shareTotals: {
      shortAskBuyCompleteSets: {"0x1": null, "0x2": null, "0x3": null},
      shortSellBuyCompleteSets: {"0x2": null, "0x4": null, "0x5": null},
      sellCompleteSets: {"0x6": null}
    },
    assertions: function (output) {
      assert.deepEqual(output, ["0x1", "0x2", "0x3", "0x4", "0x5", "0x6"]);
    }
  });
});
