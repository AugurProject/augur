/* eslint-env mocha */

"use strict";

var assert = require("chai").assert;
var BigNumber = require("bignumber.js");
var proxyquire = require("proxyquire").noPreserveCache();
var fix = require("./utils").fix;

describe("trading/positions/get-adjusted-positions", function () {
  var test = function (t) {
    it(t.description, function (done) {
      var getAdjustedPositions = proxyquire("../../../../src/trading/positions/get-adjusted-positions", {
        "./adjust-positions": function (account, marketIDs, shareTotals) {
          return { account: account, marketIDs: marketIDs, shareTotals: shareTotals };
        },
        "../../logs/get-logs": function (p, callback) {
          switch (p.label) {
            case "CreateAskOrder":
              callback(null, t.logs.shortAskBuyCompleteSets);
              break;
            case "FillBidOrder":
              callback(null, t.logs.shortSellBuyCompleteSets);
              break;
            case "SellCompleteSets":
              callback(null, t.logs.sellCompleteSets);
              break;
            default:
              assert.fail();
          }
        }
      });
      getAdjustedPositions(t.params, function (err, output) {
        t.assertions(err, output);
        done();
      });
    });
  };
  test({
    description: "no logs",
    params: {
      account: "0xb0b"
    },
    logs: {
      shortAskBuyCompleteSets: [],
      shortSellBuyCompleteSets: [],
      sellCompleteSets: []
    },
    assertions: function (err, output) {
      assert.isNull(err);
      assert.deepEqual(output, {
        account: "0xb0b",
        marketIDs: [],
        shareTotals: {
          shortAskBuyCompleteSets: {},
          shortSellBuyCompleteSets: {},
          sellCompleteSets: {}
        }
      });
    }
  });
  test({
    description: "1 market, 1 short ask",
    params: {
      account: "0xb0b"
    },
    logs: {
      shortAskBuyCompleteSets: [{
        data: fix("3"),
        topics: [
          "0x2e6b18139c987afb05efb85deddaa40262aa36c9ddebb9be215461cb22078175",
          "0x0000000000000000000000000000000000000000000000000000000000000b0b",
          "0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
          "0x0000000000000000000000000000000000000000000000000000000000000001"
        ]
      }],
      shortSellBuyCompleteSets: [],
      sellCompleteSets: []
    },
    assertions: function (err, output) {
      assert.isNull(err);
      assert.deepEqual(output, {
        account: "0xb0b",
        marketIDs: ["0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"],
        shareTotals: {
          shortAskBuyCompleteSets: {
            "0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff": new BigNumber("3", 10)
          },
          shortSellBuyCompleteSets: {},
          sellCompleteSets: {}
        }
      });
    }
  });
  test({
    description: "1 market, 1 short sell",
    params: {
      account: "0xb0b"
    },
    logs: {
      shortAskBuyCompleteSets: [],
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
      sellCompleteSets: []
    },
    assertions: function (err, output) {
      assert.isNull(err);
      assert.deepEqual(output, {
        account: "0xb0b",
        marketIDs: ["0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"],
        shareTotals: {
          shortAskBuyCompleteSets: {},
          shortSellBuyCompleteSets: {
            "0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff": new BigNumber("1", 10)
          },
          sellCompleteSets: {}
        }
      });
    }
  });
  test({
    description: "1 market, 2 sell complete sets",
    params: {
      account: "0xb0b"
    },
    logs: {
      shortAskBuyCompleteSets: [],
      shortSellBuyCompleteSets: [],
      sellCompleteSets: [{
        data: fix("3"),
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
          "0x0000000000000000000000000000000000000000000000000000000000000002"
        ]
      }]
    },
    assertions: function (err, output) {
      assert.isNull(err);
      assert.deepEqual(output, {
        account: "0xb0b",
        marketIDs: ["0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"],
        shareTotals: {
          shortAskBuyCompleteSets: {},
          shortSellBuyCompleteSets: {},
          sellCompleteSets: {
            "0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff": new BigNumber("-5.1", 10)
          }
        }
      });
    }
  });
  test({
    description: "1 market, 1 short ask, 2 sell complete sets",
    params: {
      account: "0xb0b",
      filter: { market: "0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff" }
    },
    logs: {
      shortAskBuyCompleteSets: [{
        data: fix("6"),
        topics: [
          "0x2e6b18139c987afb05efb85deddaa40262aa36c9ddebb9be215461cb22078175",
          "0x0000000000000000000000000000000000000000000000000000000000000b0b",
          "0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
          "0x0000000000000000000000000000000000000000000000000000000000000001"
        ]
      }],
      shortSellBuyCompleteSets: [],
      sellCompleteSets: [{
        data: fix("3"),
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
          "0x0000000000000000000000000000000000000000000000000000000000000002"
        ]
      }]
    },
    assertions: function (err, output) {
      assert.isNull(err);
      assert.deepEqual(output, {
        account: "0xb0b",
        marketIDs: ["0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"],
        shareTotals: {
          shortAskBuyCompleteSets: {
            "0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff": new BigNumber("6", 10)
          },
          shortSellBuyCompleteSets: {},
          sellCompleteSets: {
            "0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff": new BigNumber("-5.1", 10)
          }
        }
      });
    }
  });
  test({
    description: "1 market, 1 short ask, 1 short sell, 1 sell complete sets",
    params: {
      account: "0xb0b"
    },
    logs: {
      shortAskBuyCompleteSets: [{
        data: fix("3"),
        topics: [
          "0x2e6b18139c987afb05efb85deddaa40262aa36c9ddebb9be215461cb22078175",
          "0x0000000000000000000000000000000000000000000000000000000000000b0b",
          "0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
          "0x0000000000000000000000000000000000000000000000000000000000000001"
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
        data: fix("0.9"),
        topics: [
          "0x2e6b18139c987afb05efb85deddaa40262aa36c9ddebb9be215461cb22078175",
          "0x0000000000000000000000000000000000000000000000000000000000000b0b",
          "0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
          "0x0000000000000000000000000000000000000000000000000000000000000001"
        ]
      }]
    },
    assertions: function (err, output) {
      assert.isNull(err);
      assert.deepEqual(output, {
        account: "0xb0b",
        marketIDs: ["0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"],
        shareTotals: {
          shortAskBuyCompleteSets: {
            "0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff": new BigNumber("3", 10)
          },
          shortSellBuyCompleteSets: {
            "0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff": new BigNumber("1", 10)
          },
          sellCompleteSets: {
            "0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff": new BigNumber("0.9", 10)
          }
        }
      });
    }
  });
  test({
    description: "1 market, 1 short ask, 2 short sells [0.1 outcome 1, 0.2 outcome 1], 1 sell complete sets",
    params: {
      account: "0xb0b"
    },
    logs: {
      shortAskBuyCompleteSets: [{
        data: fix("3"),
        topics: [
          "0x2e6b18139c987afb05efb85deddaa40262aa36c9ddebb9be215461cb22078175",
          "0x0000000000000000000000000000000000000000000000000000000000000b0b",
          "0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
          "0x0000000000000000000000000000000000000000000000000000000000000001"
        ]
      }],
      shortSellBuyCompleteSets: [{
        data: "0x"+
              "1000000000000000000000000000000000000000000000000000000000000000"+
              fix("0.1").replace("0x", "")+
              "0000000000000000000000000000000100000000000000000000000000000000"+
              "0000000000000000000000000000000000000000000000000000000000000001", // outcome
        topics: [
          "0x17c6c0dcf7960856660a58fdb9238dc76130b17e20b6511d08e811a3a92ca8c7",
          "0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
          "0x000000000000000000000000000000000000000000000000000000000000d00d", // taker
          "0x0000000000000000000000000000000000000000000000000000000000000b0b"  // maker
        ]
      }, {
        data: "0x"+
              "1000000000000000000000000000000000000000000000000000000000000000"+
              fix("0.2").replace("0x", "")+
              "0000000000000000000000000000000200000000000000000000000000000000"+
              "0000000000000000000000000000000000000000000000000000000000000001", // outcome
        topics: [
          "0x17c6c0dcf7960856660a58fdb9238dc76130b17e20b6511d08e811a3a92ca8c7",
          "0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
          "0x000000000000000000000000000000000000000000000000000000000000d00d", // taker
          "0x0000000000000000000000000000000000000000000000000000000000000b0b"  // maker
        ]
      }],
      sellCompleteSets: [{
        data: fix("0.9"),
        topics: [
          "0x2e6b18139c987afb05efb85deddaa40262aa36c9ddebb9be215461cb22078175",
          "0x0000000000000000000000000000000000000000000000000000000000000b0b",
          "0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
          "0x0000000000000000000000000000000000000000000000000000000000000001"
        ]
      }]
    },
    assertions: function (err, output) {
      assert.isNull(err);
      assert.deepEqual(output, {
        account: "0xb0b",
        marketIDs: ["0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"],
        shareTotals: {
          shortAskBuyCompleteSets: {
            "0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff": new BigNumber("3", 10)
          },
          shortSellBuyCompleteSets: {
            "0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff": new BigNumber("0.3", 10)
          },
          sellCompleteSets: {
            "0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff": new BigNumber("0.9", 10)
          }
        }
      });
    }
  });
  test({
    description: "1 market, 1 short ask, 2 short sells [0.1 outcome 1, 0.2 outcome 2], 2 complete sets [buy 3, sell 2.1]",
    params: {
      account: "0xb0b"
    },
    logs: {
      shortAskBuyCompleteSets: [{
        data: fix("3"),
        topics: [
          "0x2e6b18139c987afb05efb85deddaa40262aa36c9ddebb9be215461cb22078175",
          "0x0000000000000000000000000000000000000000000000000000000000000b0b",
          "0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
          "0x0000000000000000000000000000000000000000000000000000000000000001"
        ]
      }],
      shortSellBuyCompleteSets: [{
        data: "0x"+
              "1000000000000000000000000000000000000000000000000000000000000000"+
              fix("0.1").replace("0x", "")+
              "0000000000000000000000000000000100000000000000000000000000000000"+
              "0000000000000000000000000000000000000000000000000000000000000001", // outcome
        topics: [
          "0x17c6c0dcf7960856660a58fdb9238dc76130b17e20b6511d08e811a3a92ca8c7",
          "0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
          "0x000000000000000000000000000000000000000000000000000000000000d00d", // taker
          "0x0000000000000000000000000000000000000000000000000000000000000b0b"  // maker
        ]
      }, {
        data: "0x"+
              "1000000000000000000000000000000000000000000000000000000000000000"+
              fix("0.2").replace("0x", "")+
              "0000000000000000000000000000000200000000000000000000000000000000"+
              "0000000000000000000000000000000000000000000000000000000000000002", // outcome
        topics: [
          "0x17c6c0dcf7960856660a58fdb9238dc76130b17e20b6511d08e811a3a92ca8c7",
          "0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
          "0x000000000000000000000000000000000000000000000000000000000000d00d", // taker
          "0x0000000000000000000000000000000000000000000000000000000000000b0b"  // maker
        ]
      }],
      sellCompleteSets: [{
        data: fix("3"),
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
      }]
    },
    assertions: function (err, output) {
      assert.isNull(err);
      assert.deepEqual(output, {
        account: "0xb0b",
        marketIDs: ["0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"],
        shareTotals: {
          shortAskBuyCompleteSets: {
            "0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff": new BigNumber("3", 10)
          },
          shortSellBuyCompleteSets: {
            "0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff": new BigNumber("0.2", 10)
          },
          sellCompleteSets: {
            "0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff": new BigNumber("0.9", 10)
          }
        }
      });
    }
  });
  test({
    description: "2 markets, position ([0, 0], [2, 2, 2, 2, 2, 2, 2, 2]), 2 short sells [0.1 outcome 2 market 1, 0.2 outcome 2 market 2], 1 sell complete sets [1 market 2]",
    params: {
      account: "0xb0b"
    },
    logs: {
      shortAskBuyCompleteSets: [],
      shortSellBuyCompleteSets: [{
        data: "0x"+
              "1000000000000000000000000000000000000000000000000000000000000000"+
              fix("0.1").replace("0x", "")+
              "0000000000000000000000000000000100000000000000000000000000000000"+
              "0000000000000000000000000000000000000000000000000000000000000002", // outcome
        topics: [
          "0x17c6c0dcf7960856660a58fdb9238dc76130b17e20b6511d08e811a3a92ca8c7",
          "0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
          "0x000000000000000000000000000000000000000000000000000000000000d00d", // taker
          "0x0000000000000000000000000000000000000000000000000000000000000b0b"  // maker
        ]
      }, {
        data: "0x"+
              "1000000000000000000000000000000000000000000000000000000000000000"+
              fix("0.2").replace("0x", "")+
              "0000000000000000000000000000000200000000000000000000000000000000"+
              "0000000000000000000000000000000000000000000000000000000000000002", // outcome
        topics: [
          "0x17c6c0dcf7960856660a58fdb9238dc76130b17e20b6511d08e811a3a92ca8c7",
          "0x8000000000000000000000000000000000000000000000000000000000000000",
          "0x000000000000000000000000000000000000000000000000000000000000d00d", // taker
          "0x0000000000000000000000000000000000000000000000000000000000000b0b"  // maker
        ]
      }],
      sellCompleteSets: [{
        data: fix("1"),
        topics: [
          "0x2e6b18139c987afb05efb85deddaa40262aa36c9ddebb9be215461cb22078175",
          "0x0000000000000000000000000000000000000000000000000000000000000b0b",
          "0x8000000000000000000000000000000000000000000000000000000000000000",
          "0x0000000000000000000000000000000000000000000000000000000000000002"
        ]
      }]
    },
    assertions: function (err, output) {
      assert.isNull(err);
      assert.deepEqual(output, {
        account: "0xb0b",
        marketIDs: [
          "0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
          "0x8000000000000000000000000000000000000000000000000000000000000000"
        ],
        shareTotals: {
          shortAskBuyCompleteSets: {},
          shortSellBuyCompleteSets: {
            "0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff": new BigNumber("0.1", 10),
            "0x8000000000000000000000000000000000000000000000000000000000000000": new BigNumber("0.2", 10)
          },
          sellCompleteSets: {
            "0x8000000000000000000000000000000000000000000000000000000000000000": new BigNumber("-1", 10)
          }
        }
      });
    }
  });
  test({
    description: "2 markets, 3 short sells [0.1 outcome 2 market 1, 1.2 outcome 2 market 2, 10000.00001 outcome 7 market 2], 1 sell complete sets [1.2 market 2]",
    params: {
      account: "0xb0b"
    },
    logs: {
      shortAskBuyCompleteSets: [],
      shortSellBuyCompleteSets: [{
        data: "0x"+
              "1000000000000000000000000000000000000000000000000000000000000000"+
              fix("0.1").replace("0x", "")+
              "0000000000000000000000000000000100000000000000000000000000000000"+
              "0000000000000000000000000000000000000000000000000000000000000002", // outcome
        topics: [
          "0x17c6c0dcf7960856660a58fdb9238dc76130b17e20b6511d08e811a3a92ca8c7",
          "0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
          "0x000000000000000000000000000000000000000000000000000000000000d00d", // taker
          "0x0000000000000000000000000000000000000000000000000000000000000b0b"  // maker
        ]
      }, {
        data: "0x"+
              "1000000000000000000000000000000000000000000000000000000000000000"+
              fix("0.2").replace("0x", "")+
              "0000000000000000000000000000000200000000000000000000000000000000"+
              "0000000000000000000000000000000000000000000000000000000000000002", // outcome
        topics: [
          "0x17c6c0dcf7960856660a58fdb9238dc76130b17e20b6511d08e811a3a92ca8c7",
          "0x8000000000000000000000000000000000000000000000000000000000000000",
          "0x000000000000000000000000000000000000000000000000000000000000d00d", // taker
          "0x0000000000000000000000000000000000000000000000000000000000000b0b"  // maker
        ]
      }, {
        data: "0x"+
              "1000000000000000000000000000000000000000000000000000000000000000"+
              fix("10000.00001").replace("0x", "")+
              "0000000000000000000000000000000300000000000000000000000000000000"+
              "0000000000000000000000000000000000000000000000000000000000000007", // outcome
        topics: [
          "0x17c6c0dcf7960856660a58fdb9238dc76130b17e20b6511d08e811a3a92ca8c7",
          "0x8000000000000000000000000000000000000000000000000000000000000000",
          "0x000000000000000000000000000000000000000000000000000000000000d00d", // taker
          "0x0000000000000000000000000000000000000000000000000000000000000b0b"  // maker
        ]
      }],
      sellCompleteSets: [{
        data: fix("1.2"),
        topics: [
          "0x2e6b18139c987afb05efb85deddaa40262aa36c9ddebb9be215461cb22078175",
          "0x0000000000000000000000000000000000000000000000000000000000000b0b",
          "0x8000000000000000000000000000000000000000000000000000000000000000",
          "0x0000000000000000000000000000000000000000000000000000000000000002"
        ]
      }]
    },
    assertions: function (err, output) {
      assert.isNull(err);
      assert.deepEqual(output, {
        account: "0xb0b",
        marketIDs: [
          "0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
          "0x8000000000000000000000000000000000000000000000000000000000000000"
        ],
        shareTotals: {
          shortAskBuyCompleteSets: {},
          shortSellBuyCompleteSets: {
            "0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff": new BigNumber("0.1", 10),
            "0x8000000000000000000000000000000000000000000000000000000000000000": new BigNumber("10000.00001", 10)
          },
          sellCompleteSets: {
            "0x8000000000000000000000000000000000000000000000000000000000000000": new BigNumber("-1.2", 10)
          }
        }
      });
    }
  });
});
