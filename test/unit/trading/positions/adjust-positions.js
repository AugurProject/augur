"use strict";

var assert = require("chai").assert;
var BigNumber = require("bignumber.js");
var proxyquire = require("proxyquire").noPreserveCache();

describe("trading/positions/adjust-positions", function () {
  var test = function (t) {
    it(t.description, function (done) {
      var adjustPositions = proxyquire("../../../../src/trading/positions/adjust-positions", {
        "../../api": function () {
          return {
            MarketFetcher: {
              getPositionInMarket: function (p, callback) {
                if (!callback) return t.onChainPosition[p._market];
                callback(t.onChainPosition[p._market]);
              }
            }
          };
        }
      });
      adjustPositions(t.account, t.marketIDs, t.shareTotals, function (err, adjustedPositions) {
        t.assertions(err, adjustedPositions);
        done();
      });
    });
  };
  test({
    description: "1 market, 2 outcomes, no position, short ask 0, short sell 0",
    account: "0xb0b",
    marketIDs: ["0x1"],
    shareTotals: {
      shortAskBuyCompleteSets: {},
      shortSellBuyCompleteSets: {},
      sellCompleteSets: {}
    },
    onChainPosition: {
      "0x1": {
        "1": "0",
        "2": "0"
      }
    },
    assertions: function (err, output) {
      assert.isNull(err);
      assert.deepEqual(output, {
        "0x1": {
          "1": "0",
          "2": "0"
        }
      });
    }
  });
  test({
    description: "handle an undefined onChainPosition from getPositionInMarket",
    account: "0xb0b",
    marketIDs: ["0x1"],
    shareTotals: {
      shortAskBuyCompleteSets: {},
      shortSellBuyCompleteSets: {},
      sellCompleteSets: {}
    },
    onChainPosition: {
      "0x1": undefined
    },
    assertions: function (err, output) {
      assert.deepEqual(err, "couldn't load position in 0x1");
      assert.isUndefined(output);
    }
  });
  test({
    description: "1 market, 2 outcomes, 1 position, short ask 0, short sell 0",
    account: "0xb0b",
    marketIDs: ["0x1"],
    shareTotals: {
      shortAskBuyCompleteSets: {},
      shortSellBuyCompleteSets: {},
      sellCompleteSets: {}
    },
    onChainPosition: {
      "0x1": {
        "1": "1",
        "2": "0"
      }
    },
    assertions: function (err, output) {
      assert.isNull(err);
      assert.deepEqual(output, {
        "0x1": {
          "1": "1",
          "2": "0"
        }
      });
    }
  });
  test({
    description: "1 market, 2 outcomes, 1 position, short ask 0, short sell 1",
    account: "0xb0b",
    marketIDs: ["0x1"],
    shareTotals: {
      shortAskBuyCompleteSets: {},
      shortSellBuyCompleteSets: {
        "0x1": new BigNumber("1", 10)
      },
      sellCompleteSets: {}
    },
    onChainPosition: {
      "0x1": {
        "1": "0",
        "2": "1"
      }
    },
    assertions: function (err, output) {
      assert.isNull(err);
      assert.deepEqual(output, {
        "0x1": {
          "1": "-1",
          "2": "0"
        }
      });
    }
  });
  test({
    description: "1 market, 2 outcomes, 2 positions, short ask 1, short sell 0",
    account: "0xb0b",
    marketIDs: ["0x1"],
    shareTotals: {
      shortAskBuyCompleteSets: {},
      shortSellBuyCompleteSets: {
        "0x1": new BigNumber("1", 10)
      },
      sellCompleteSets: {}
    },
    onChainPosition: {
      "0x1": {
        "1": "1",
        "2": "1"
      }
    },
    assertions: function (err, output) {
      assert.isNull(err);
      assert.deepEqual(output, {
        "0x1": {
          "1": "0",
          "2": "0"
        }
      });
    }
  });
  test({
    description: "1 market, 2 outcomes, 2 positions, short ask 1, short sell 1",
    account: "0xb0b",
    marketIDs: ["0x1"],
    shareTotals: {
      shortAskBuyCompleteSets: {
        "0x1": new BigNumber("1", 10)
      },
      shortSellBuyCompleteSets: {
        "0x1": new BigNumber("1", 10)
      },
      sellCompleteSets: {}
    },
    onChainPosition: {
      "0x1": {
        "1": "1",
        "2": "2"
      }
    },
    assertions: function (err, output) {
      assert.isNull(err);
      assert.deepEqual(output, {
        "0x1": {
          "1": "-1",
          "2": "0"
        }
      });
    }
  });
  test({
    description: "1 market, 2 outcomes, 1 position, short ask 0, short sell 2",
    account: "0xb0b",
    marketIDs: ["0x1"],
    shareTotals: {
      shortAskBuyCompleteSets: {},
      shortSellBuyCompleteSets: {
        "0x1": new BigNumber("2", 10)
      },
      sellCompleteSets: {}
    },
    onChainPosition: {
      "0x1": {
        "1": "2",
        "2": "0"
      }
    },
    assertions: function (err, output) {
      assert.isNull(err);
      assert.deepEqual(output, {
        "0x1": {
          "1": "0",
          "2": "-2"
        }
      });
    }
  });
  test({
    description: "1 market, 2 outcomes, 2 positions, short ask 0, short sell 2 [1 outcome 1, 1 outcome 2]",
    account: "0xb0b",
    marketIDs: ["0x1"],
    shareTotals: {
      shortAskBuyCompleteSets: {},
      shortSellBuyCompleteSets: {
        "0x1": new BigNumber("2", 10)
      },
      sellCompleteSets: {}
    },
    onChainPosition: {
      "0x1": {
        "1": "1",
        "2": "1"
      }
    },
    assertions: function (err, output) {
      assert.isNull(err);
      assert.deepEqual(output, {
        "0x1": {
          "1": "-1",
          "2": "-1"
        }
      });
    }
  });
  test({
    description: "1 market, 2 outcomes, 2 positions, short ask 2, short sell 2",
    account: "0xb0b",
    marketIDs: ["0x1"],
    shareTotals: {
      shortAskBuyCompleteSets: {
        "0x1": new BigNumber("2", 10)
      },
      shortSellBuyCompleteSets: {
        "0x1": new BigNumber("2", 10)
      },
      sellCompleteSets: {}
    },
    onChainPosition: {
      "0x1": {
        "1": "2",
        "2": "4"
      }
    },
    assertions: function (err, output) {
      assert.isNull(err);
      assert.deepEqual(output, {
        "0x1": {
          "1": "-2",
          "2": "0"
        }
      });
    }
  });
  test({
    description: "1 market, 2 outcomes, 2 positions, short ask 2, short sell 2 [1 outcome 1, 1 outcome 2]",
    account: "0xb0b",
    marketIDs: ["0x1"],
    shareTotals: {
      shortAskBuyCompleteSets: {
        "0x1": new BigNumber("2", 10)
      },
      shortSellBuyCompleteSets: {
        "0x1": new BigNumber("2", 10)
      },
      sellCompleteSets: {}
    },
    onChainPosition: {
      "0x1": {
        "1": "3",
        "2": "3"
      }
    },
    assertions: function (err, output) {
      assert.isNull(err);
      assert.deepEqual(output, {
        "0x1": {
          "1": "-1",
          "2": "-1"
        }
      });
    }
  });
  test({
    description: "1 market, 2 outcomes, 2 positions, short ask 2, short sell 5",
    account: "0xb0b",
    marketIDs: ["0x1"],
    shareTotals: {
      shortAskBuyCompleteSets: {
        "0x1": new BigNumber("2", 10)
      },
      shortSellBuyCompleteSets: {
        "0x1": new BigNumber("5", 10)
      },
      sellCompleteSets: {}
    },
    onChainPosition: {
      "0x1": {
        "1": "7",
        "2": "2"
      }
    },
    assertions: function (err, output) {
      assert.isNull(err);
      assert.deepEqual(output, {
        "0x1": {
          "1": "0",
          "2": "-5"
        }
      });
    }
  });
  test({
    description: "1 market, 2 outcomes, 2 positions, short ask 5, short sell 2",
    account: "0xb0b",
    marketIDs: ["0x1"],
    shareTotals: {
      shortAskBuyCompleteSets: {
        "0x1": new BigNumber("5", 10)
      },
      shortSellBuyCompleteSets: {
        "0x1": new BigNumber("2", 10)
      },
      sellCompleteSets: {}
    },
    onChainPosition: {
      "0x1": {
        "1": "5",
        "2": "7"
      }
    },
    assertions: function (err, output) {
      assert.isNull(err);
      assert.deepEqual(output, {
        "0x1": {
          "1": "-2",
          "2": "0"
        }
      });
    }
  });
  test({
    description: "1 market, 2 outcomes, 2 positions, short ask 5.1, short sell 2.2 [1.2 outcome 1, 1 outcome 2]",
    account: "0xb0b",
    marketIDs: ["0x1"],
    shareTotals: {
      shortAskBuyCompleteSets: {
        "0x1": new BigNumber("5.1", 10)
      },
      shortSellBuyCompleteSets: {
        "0x1": new BigNumber("2.2", 10)
      },
      sellCompleteSets: {}
    },
    onChainPosition: {
      "0x1": {
        "1": "6.1",
        "2": "6.3"
      }
    },
    assertions: function (err, output) {
      assert.isNull(err);
      assert.deepEqual(output, {
        "0x1": {
          "1": "-1.2",
          "2": "-1"
        }
      });
    }
  });
  test({
    description: "2 markets, short ask 5.1 market 1, short sell 2.2 market 1 [1.2 outcome 1, 1 outcome 2] 2 market 2 [2 outcome 5]",
    account: "0xb0b",
    marketIDs: ["0x1", "0x2"],
    shareTotals: {
      shortAskBuyCompleteSets: {
        "0x1": new BigNumber("5.1", 10)
      },
      shortSellBuyCompleteSets: {
        "0x1": new BigNumber("2.2", 10),
        "0x2": new BigNumber("2", 10)
      },
      sellCompleteSets: {}
    },
    onChainPosition: {
      "0x1": {
        "1": "6.1",
        "2": "6.3"
      },
      "0x2": {
        "1": "2",
        "2": "2",
        "3": "2",
        "4": "2",
        "5": "0",
        "6": "2",
        "7": "2"
      }
    },
    assertions: function (err, output) {
      assert.isNull(err);
      assert.deepEqual(output, {
        "0x1": {
          "1": "-1.2",
          "2": "-1"
        },
        "0x2": {
          "1": "0",
          "2": "0",
          "3": "0",
          "4": "0",
          "5": "-2",
          "6": "0",
          "7": "0"
        }
      });
    }
  });
  test({
    description: "2 markets, short ask [5.1 market 1, 0.1 market 2], short sell 2.2 market 1 [1.2 outcome 1, 1 outcome 2] 2 market 2 [2 outcome 5]",
    account: "0xb0b",
    marketIDs: ["0x1", "0x2"],
    shareTotals: {
      shortAskBuyCompleteSets: {
        "0x1": new BigNumber("5.1", 10),
        "0x2": new BigNumber("0.1", 10)
      },
      shortSellBuyCompleteSets: {
        "0x1": new BigNumber("2.2", 10),
        "0x2": new BigNumber("2", 10)
      },
      sellCompleteSets: {}
    },
    onChainPosition: {
      "0x1": {
        "1": "6.1",
        "2": "6.3"
      },
      "0x2": {
        "1": "2.1",
        "2": "2.1",
        "3": "2.1",
        "4": "2.1",
        "5": "0.1",
        "6": "2.1",
        "7": "2.1"
      }
    },
    assertions: function (err, output) {
      assert.isNull(err);
      assert.deepEqual(output, {
        "0x1": {
          "1": "-1.2",
          "2": "-1"
        },
        "0x2": {
          "1": "0",
          "2": "0",
          "3": "0",
          "4": "0",
          "5": "-2",
          "6": "0",
          "7": "0"
        }
      });
    }
  });
  test({
    description: "1 market, short ask 5, short sell [2 outcome 1, 1 outcome 2], sell complete sets 6",
    account: "0xb0b",
    marketIDs: ["0x1"],
    shareTotals: {
      shortAskBuyCompleteSets: {
        "0x1": new BigNumber("5", 10)
      },
      shortSellBuyCompleteSets: {
        "0x1": new BigNumber("2", 10)
      },
      sellCompleteSets: {
        "0x1": new BigNumber("-6", 10)
      }
    },
    onChainPosition: {
      "0x1": {
        "1": "0", // change:  +5   0  +1  -6
                  // balance: +5  +5  +6   0
                  // display:  0  -2  -2  -1
                  //           0  -2   0  +1

        "2": "1"  // change:  +5  +2   0  -6
                  // balance: +5  +7  +7  +1
                  // display:  0   0  -1   0
                  //           0   0  -1  +1
      }
    },
    assertions: function (err, output) {
      assert.isNull(err);
      assert.deepEqual(output, {
        "0x1": {
          "1": "-1",
          "2": "0"
        }
      });
    }
  });
  test({
    description: "1 market, short ask 5.1, short sell [1.2 outcome 1, 1 outcome 2], sell complete sets 6.1",
    account: "0xb0b",
    marketIDs: ["0x1"],
    shareTotals: {
      shortAskBuyCompleteSets: {
        "0x1": new BigNumber("5.1", 10)
      },
      shortSellBuyCompleteSets: {
        "0x1": new BigNumber("1.2", 10),
      },
      sellCompleteSets: {
        "0x1": new BigNumber("-6.1", 10)
      }
    },
    onChainPosition: {
      "0x1": {
        "1": "0",  // change:  +5.1   0.0  +1.0  -6.1
                   // balance: +5.1  +5.1  +6.1   0.0
                   // display:  0.0  -1.2  -1.2  -0.2
                   //           0.0  -1.2  -1.2  +1.0

        "2": "0.2" // change:  +5.1  +1.2   0.0  -6.1
                   // balance: +5.1  +6.3  +6.3  +0.2
                   // display:  0.0   0.0  -1.0   0.0
                   //           0.0   0.0  -1.0  +1.0
      }
    },
    assertions: function (err, output) {
      assert.isNull(err);
      assert.deepEqual(output, {
        "0x1": {
          "1": "-0.2",
          "2": "0"
        }
      });
    }
  });
  test({
    description: "2 markets, short ask [5.1 market 1, 1.2345 market 2], short sell market 1 [1.2 outcome 1, 1 outcome 2] market 2 [2 outcome 5], sell complete sets [6.1 market 1, sell 1.2345 market 2]",
    account: "0xb0b",
    marketIDs: ["0x1", "0x2"],
    shareTotals: {
      shortAskBuyCompleteSets: {
        "0x1": new BigNumber("5.1", 10),
        "0x2": new BigNumber("1.2345", 10)
      },
      shortSellBuyCompleteSets: {
        "0x1": new BigNumber("1.2", 10),
        "0x2": new BigNumber("2", 10)
      },
      sellCompleteSets: {
        "0x1": new BigNumber("-6.1", 10),
        "0x2": new BigNumber("-1.2345", 10)
      }
    },
    onChainPosition: {
      "0x1": {
        "1": "0",
        "2": "0.2"
      },
      "0x2": {
        "1": "2",
        "2": "2",
        "3": "2",
        "4": "2",
        "5": "0",
        "6": "2",
        "7": "2"
      }
    },
    assertions: function (err, output) {
      assert.isNull(err);
      assert.deepEqual(output, {
        "0x1": {
          "1": "-0.2",
          "2": "0"
        },
        "0x2": {
          "1": "0",
          "2": "0",
          "3": "0",
          "4": "0",
          "5": "-2",
          "6": "0",
          "7": "0"
        }
      });
    }
  });
  test({
    description: "1 market, initial position [3, 1], short ask 5, short sell [2 outcome 1, 1 outcome 2], sell complete sets 6",
    account: "0xb0b",
    marketIDs: ["0x1"],
    shareTotals: {
      shortAskBuyCompleteSets: {
        "0x1": new BigNumber("5", 10)
      },
      shortSellBuyCompleteSets: {
        "0x1": new BigNumber("2", 10)
      },
      sellCompleteSets: {
        "0x1": new BigNumber("-6", 10)
      }
    },
    onChainPosition: {
      "0x1": {
        "1": "3",
        "2": "2"
      }
    },
    assertions: function (err, output) {
      assert.isNull(err);
      assert.deepEqual(output, {
        "0x1": {
          "1": "2",
          "2": "1"
        }
      });
    }
  });
  test({
    description: "1 market, initial position [1.2, 10.101], short ask 5.1, short sell [1.2 outcome 1, 1 outcome 2], sell complete sets 6.1",
    account: "0xb0b",
    marketIDs: ["0x1"],
    shareTotals: {
      shortAskBuyCompleteSets: {
        "0x1": new BigNumber("5.1", 10)
      },
      shortSellBuyCompleteSets: {
        "0x1": new BigNumber("1.2", 10),
      },
      sellCompleteSets: {
        "0x1": new BigNumber("-6.1", 10)
      }
    },
    onChainPosition: {
      "0x1": {
        "1": "1.2",
        "2": "10.301"
      }
    },
    assertions: function (err, output) {
      assert.isNull(err);
      assert.deepEqual(output, {
        "0x1": {
          "1": "1",
          "2": "10.101"
        }
      });
    }
  });
  test({
    description: "2 markets, initial position ([0.1, 0], [0, 71, 0, 0, 0, 0.112, 0]), short ask [5.1 market 1, 1.2345 market 2], short sell market 1 [1.2 outcome 1, 1 outcome 2] market 2 [2 outcome 5], sell complete sets [6.1 market 1, sell 1.2345 market 2]",
    account: "0xb0b",
    marketIDs: ["0x1", "0x2"],
    shareTotals: {
      shortAskBuyCompleteSets: {
        "0x1": new BigNumber("5.1", 10),
        "0x2": new BigNumber("1.2345", 10)
      },
      shortSellBuyCompleteSets: {
        "0x1": new BigNumber("1.2", 10),
        "0x2": new BigNumber("2", 10)
      },
      sellCompleteSets: {
        "0x1": new BigNumber("-6.1", 10),
        "0x2": new BigNumber("-1.2345", 10)
      }
    },
    onChainPosition: {
      "0x1": {
        "1": "0.1",
        "2": "0.2"
      },
      "0x2": {
        "1": "2",
        "2": "73",
        "3": "2",
        "4": "2",
        "5": "0",
        "6": "2.112",
        "7": "2"
      }
    },
    assertions: function (err, output) {
      assert.isNull(err);
      assert.deepEqual(output, {
        "0x1": {
          "1": "-0.1",
          "2": "0"
        },
        "0x2": {
          "1": "0",
          "2": "71",
          "3": "0",
          "4": "0",
          "5": "-2",
          "6": "0.112",
          "7": "0"
        }
      });
    }
  });
});
