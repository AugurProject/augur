/* eslint-env mocha */

"use strict";

var assert = require("chai").assert;

describe("trading/profit-loss/calculate-profit-loss", function () {
  var test = function (t) {
    it(t.description, function () {
      t.assertions(require("../../../../src/trading/profit-loss/calculate-profit-loss")({ trades: t.trades, lastPrice: t.lastPrice }));
    });
  };
  test({
    description: "no trades, last price 2",
    trades: [],
    lastPrice: "2",
    assertions: function (output) {
      assert.deepEqual(output, {
        position: "0",
        meanOpenPrice: "0",
        realized: "0",
        unrealized: "0",
        total: "0",
      });
    },
  });
  test({
    description: "no trades, last price 2",
    trades: [],
    lastPrice: "2",
    assertions: function (output) {
      assert.deepEqual(output, {
        position: "0",
        meanOpenPrice: "0",
        realized: "0",
        unrealized: "0",
        total: "0",
      });
    },
  });

  describe("taker trades", function () {
    test({
      description: "trades: [buy 1 @ 2], last price 2",
      trades: [{
        type: "buy",
        amount: "1",
        price: "2",
        maker: false,
      }],
      lastPrice: "2",
      assertions: function (output) {
        assert.deepEqual(output, {
          position: "1",
          meanOpenPrice: "2",
          realized: "0",
          unrealized: "0",
          total: "0",
        });
      },
    });
    test({
      description: "trades: [buy 1 @ 1], last price 2",
      trades: [{
        type: "buy",
        amount: "1",
        price: "1",
        maker: false,
      }],
      lastPrice: "2",
      assertions: function (output) {
        assert.deepEqual(output, {
          position: "1",
          meanOpenPrice: "1",
          realized: "0",
          unrealized: "1",
          total: "1",
        });
      },
    });
    test({
      description: "trades: [buy 1 @ 3], last price 2",
      trades: [{
        type: "buy",
        amount: "1",
        price: "3",
        maker: false,
      }],
      lastPrice: "2",
      assertions: function (output) {
        assert.deepEqual(output, {
          position: "1",
          meanOpenPrice: "3",
          realized: "0",
          unrealized: "-1",
          total: "-1",
        });
      },
    });
    test({
      description: "trades: [buy 2 @ 3], last price 2",
      trades: [{
        type: "buy",
        amount: "2",
        price: "3",
        maker: false,
      }],
      lastPrice: "2",
      assertions: function (output) {
        assert.deepEqual(output, {
          position: "2",
          meanOpenPrice: "3",
          realized: "0",
          unrealized: "-2",
          total: "-2",
        });
      },
    });
    test({
      description: "trades: [buy 2 @ 1], last price 1",
      trades: [{
        type: "buy",
        amount: "2",
        price: "1",
        maker: false,
      }],
      lastPrice: "1",
      assertions: function (output) {
        assert.deepEqual(output, {
          position: "2",
          meanOpenPrice: "1",
          realized: "0",
          unrealized: "0",
          total: "0",
        });
      },
    });
    test({
      description: "trades: [buy 2 @ 1, sell 1 @ 1], last price 2",
      trades: [{
        type: "buy",
        amount: "2",
        price: "1",
        maker: false,
      }, {
        type: "sell",
        amount: "1",
        price: "1",
        maker: false,
      }],
      lastPrice: "2",
      assertions: function (output) {
        assert.deepEqual(output, {
          position: "1",
          meanOpenPrice: "1",
          realized: "0",
          unrealized: "1",
          total: "1",
        });
      },
    });
    test({
      description: "trades: [buy 2 @ 1, sell 1 @ 2], last price 2",
      trades: [{
        type: "buy",
        amount: "2",
        price: "1",
        maker: false,
      }, {
        type: "sell",
        amount: "1",
        price: "2",
        maker: false,
      }],
      lastPrice: "2",
      assertions: function (output) {
        assert.deepEqual(output, {
          position: "1",
          meanOpenPrice: "1",
          realized: "1",
          unrealized: "1",
          total: "2",
        });
      },
    });
    test({
      description: "trades: [buy 2 @ 1, sell 2 @ 2], last price 2",
      trades: [{
        type: "buy",
        amount: "2",
        price: "1",
        maker: false,
      }, {
        type: "sell",
        amount: "2",
        price: "2",
        maker: false,
      }],
      lastPrice: "2",
      assertions: function (output) {
        assert.deepEqual(output, {
          position: "0",
          meanOpenPrice: "0",
          realized: "2",
          unrealized: "0",
          total: "2",
        });
      },
    });
    test({
      description: "trades: [buy 2 @ 1, sell 1 @ 1, sell 1 @ 2], last price 2",
      trades: [{
        type: "buy",
        amount: "2",
        price: "1",
        maker: false,
      }, {
        type: "sell",
        amount: "1",
        price: "1",
        maker: false,
      }, {
        type: "sell",
        amount: "1",
        price: "2",
        maker: false,
      }],
      lastPrice: "2",
      assertions: function (output) {
        assert.deepEqual(output, {
          position: "0",
          meanOpenPrice: "0",
          realized: "1",
          unrealized: "0",
          total: "1",
        });
      },
    });
    test({
      description: "trades: [buy 3 @ 1, sell 1 @ 1, sell 1 @ 2], last price 2",
      trades: [{
        type: "buy",
        amount: "3",
        price: "1",
        maker: false,
      }, {
        type: "sell",
        amount: "1",
        price: "1",
        maker: false,
      }, {
        type: "sell",
        amount: "1",
        price: "2",
        maker: false,
      }],
      lastPrice: "2",
      assertions: function (output) {
        assert.deepEqual(output, {
          position: "1",
          meanOpenPrice: "1",
          realized: "1",
          unrealized: "1",
          total: "2",
        });
      },
    });
    test({
      description: "trades: [buy 3 @ 1, sell 1 @ 2, sell 1 @ 1], last price 2",
      trades: [{
        type: "buy",
        amount: "3",
        price: "1",
        maker: false,
      }, {
        type: "sell",
        amount: "1",
        price: "2",
        maker: false,
      }, {
        type: "sell",
        amount: "1",
        price: "1",
        maker: false,
      }],
      lastPrice: "2",
      assertions: function (output) {
        assert.deepEqual(output, {
          position: "1",
          meanOpenPrice: "1",
          realized: "1",
          unrealized: "1",
          total: "2",
        });
      },
    });
    test({
      description: "trades: [buy 3 @ 1, sell 1 @ 2, sell 1 @ 1], last price 1",
      trades: [{
        type: "buy",
        amount: "3",
        price: "1",
        maker: false,
      }, {
        type: "sell",
        amount: "1",
        price: "2",
        maker: false,
      }, {
        type: "sell",
        amount: "1",
        price: "1",
        maker: false,
      }],
      lastPrice: "1",
      assertions: function (output) {
        assert.deepEqual(output, {
          position: "1",
          meanOpenPrice: "1",
          realized: "1",
          unrealized: "0",
          total: "1",
        });
      },
    });
    test({
      description: "trades: [buy 3 @ 1, sell 1 @ 3, sell 1 @ 1], last price 1",
      trades: [{
        type: "buy",
        amount: "3",
        price: "1",
        maker: false,
      }, {
        type: "sell",
        amount: "1",
        price: "3",
        maker: false,
      }, {
        type: "sell",
        amount: "1",
        price: "1",
        maker: false,
      }],
      lastPrice: "1",
      assertions: function (output) {
        assert.deepEqual(output, {
          position: "1",
          meanOpenPrice: "1",
          realized: "2",
          unrealized: "0",
          total: "2",
        });
      },
    });
    test({
      description: "trades: [buy 3 @ 2, sell 1 @ 1], last price 1",
      trades: [{
        type: "buy",
        amount: "3",
        price: "2",
        maker: false,
      }, {
        type: "sell",
        amount: "1",
        price: "1",
        maker: false,
      }],
      lastPrice: "1",
      assertions: function (output) {
        assert.deepEqual(output, {
          position: "2",
          meanOpenPrice: "2",
          realized: "-1",
          unrealized: "-2",
          total: "-3",
        });
      },
    });
    test({
      description: "trades: [buy 3 @ 2, sell 1 @ 1, sell 2 @ 2], last price 1",
      trades: [{
        type: "buy",
        amount: "3",
        price: "2",
        maker: false,
      }, {
        type: "sell",
        amount: "1",
        price: "1",
        maker: false,
      }, {
        type: "sell",
        amount: "2",
        price: "2",
        maker: false,
      }],
      lastPrice: "1",
      assertions: function (output) {
        assert.deepEqual(output, {
          position: "0",
          meanOpenPrice: "0",
          realized: "-1",
          unrealized: "0",
          total: "-1",
        });
      },
    });
    test({
      description: "trades: [buy 100 @ 0.5, sell 10 @ 0.5], last price 0.5",
      trades: [{
        type: "buy",
        amount: "100",
        price: "0.5",
        maker: false,
      }, {
        type: "sell",
        amount: "10",
        price: "0.5",
        maker: false,
      }],
      lastPrice: "0.5",
      assertions: function (output) {
        assert.deepEqual(output, {
          position: "90",
          meanOpenPrice: "0.5",
          realized: "0",
          unrealized: "0",
          total: "0",
        });
      },
    });
    test({
      description: "trades: [buy 10 @ 0.5, buy 90 @ 0.5, sell 10 @ 0.5], last price 0.5",
      trades: [{
        type: "buy",
        amount: "10",
        price: "0.5",
        maker: false,
      }, {
        type: "buy",
        amount: "90",
        price: "0.5",
        maker: false,
      }, {
        type: "sell",
        amount: "10",
        price: "0.5",
        maker: false,
      }],
      lastPrice: "0.5",
      assertions: function (output) {
        assert.deepEqual(output, {
          position: "90",
          meanOpenPrice: "0.5",
          realized: "0",
          unrealized: "0",
          total: "0",
        });
      },
    });
    test({
      description: "trades: [buy 10 @ 0.4, sell 10 @ 0.5], last price 0.5",
      trades: [{
        type: "buy",
        amount: "10",
        price: "0.4",
        maker: false,
      }, {
        type: "sell",
        amount: "10",
        price: "0.5",
        maker: false,
      }],
      lastPrice: "0.5",
      assertions: function (output) {
        assert.deepEqual(output, {
          position: "0",
          meanOpenPrice: "0",
          realized: "1",
          unrealized: "0",
          total: "1",
        });
      },
    });
    test({
      description: "trades: [buy 10 @ 0.4, buy 10 @ 0.5], last price 0.6",
      trades: [{
        type: "buy",
        amount: "10",
        price: "0.4",
        maker: false,
      }, {
        type: "buy",
        amount: "10",
        price: "0.5",
        maker: false,
      }],
      lastPrice: "0.6",
      assertions: function (output) {
        assert.deepEqual(output, {
          position: "20",
          meanOpenPrice: "0.45",
          realized: "0",
          unrealized: "3",
          total: "3",
        });
      },
    });
    test({
      description: "trades: [buy 10 @ 0.4, buy 10 @ 0.5], last price 0.3",
      trades: [{
        type: "buy",
        amount: "10",
        price: "0.4",
        maker: false,
      }, {
        type: "buy",
        amount: "10",
        price: "0.5",
        maker: false,
      }],
      lastPrice: "0.3",
      assertions: function (output) {
        assert.deepEqual(output, {
          position: "20",
          meanOpenPrice: "0.45",
          realized: "0",
          unrealized: "-3",
          total: "-3",
        });
      },
    });
    test({
      description: "trades: [buy 10 @ 0.4, buy 10 @ 0.5], last price 0.1",
      trades: [{
        type: "buy",
        amount: "10",
        price: "0.4",
        maker: false,
      }, {
        type: "buy",
        amount: "10",
        price: "0.5",
        maker: false,
      }],
      lastPrice: "0.1",
      assertions: function (output) {
        assert.deepEqual(output, {
          position: "20",
          meanOpenPrice: "0.45",
          realized: "0",
          unrealized: "-7",
          total: "-7",
        });
      },
    });
    test({
      description: "trades: [buy 10 @ 0.1, buy 10 @ 0.5, sell 10 @ 0.2], last price 0.2",
      trades: [{
        type: "buy",
        amount: "10",
        price: "0.1",
        maker: false,
      }, {
        type: "buy",
        amount: "10",
        price: "0.5",
        maker: false,
      }, {
        type: "sell",
        amount: "10",
        price: "0.2",
        maker: false,
      }],
      lastPrice: "0.2",
      assertions: function (output) {
        assert.deepEqual(output, {
          position: "10",
          meanOpenPrice: "0.3",
          realized: "-1",
          unrealized: "-1",
          total: "-2",
        });
      },
    });
    test({
      description: "trades: [buy 15 @ 0.1, buy 5 @ 0.5, sell 10 @ 0.2], last price 0.2",
      trades: [{
        type: "buy",
        amount: "15",
        price: "0.1",
        maker: false,
      }, {
        type: "buy",
        amount: "5",
        price: "0.5",
        maker: false,
      }, {
        type: "sell",
        amount: "10",
        price: "0.2",
        maker: false,
      }],
      lastPrice: "0.2",
      assertions: function (output) {
        assert.deepEqual(output, {
          position: "10",
          meanOpenPrice: "0.2",
          realized: "0",
          unrealized: "0",
          total: "0",
        });
      },
    });
    test({
      description: "trades: [buy 15 @ 0.1, buy 5 @ 0.5, sell 10 @ 0.2], last price 0.1",
      trades: [{
        type: "buy",
        amount: "15",
        price: "0.1",
        maker: false,
      }, {
        type: "buy",
        amount: "5",
        price: "0.5",
        maker: false,
      }, {
        type: "sell",
        amount: "10",
        price: "0.2",
        maker: false,
      }],
      lastPrice: "0.1",
      assertions: function (output) {
        assert.deepEqual(output, {
          position: "10",
          meanOpenPrice: "0.2",
          realized: "0",
          unrealized: "-1",
          total: "-1",
        });
      },
    });
    test({
      description: "trades: [buy 10 @ 0.1, sell 5 @ 0.1, buy 10 @ 0.1, sell 5 @ 0.1], last price 0.1",
      trades: [{
        type: "buy",
        amount: "10",
        price: "0.1",
        maker: false,
      }, {
        type: "sell",
        amount: "5",
        price: "0.1",
        maker: false,
      }, {
        type: "buy",
        amount: "10",
        price: "0.1",
        maker: false,
      }, {
        type: "sell",
        amount: "5",
        price: "0.1",
        maker: false,
      }],
      lastPrice: "0.1",
      assertions: function (output) {
        assert.deepEqual(output, {
          position: "10",
          meanOpenPrice: "0.1",
          realized: "0",
          unrealized: "0",
          total: "0",
        });
      },
    });
    test({
      description: "trades: [buy 10 @ 0.1, sell 5 @ 0.1, buy 10 @ 0.1, sell 5 @ 0.2], last price 0.1",
      trades: [{
        type: "buy",
        amount: "10",
        price: "0.1",
        maker: false,
      }, {
        type: "sell",
        amount: "5",
        price: "0.1",
        maker: false,
      }, {
        type: "buy",
        amount: "10",
        price: "0.1",
        maker: false,
      }, {
        type: "sell",
        amount: "5",
        price: "0.2",
        maker: false,
      }],
      lastPrice: "0.1",
      assertions: function (output) {
        assert.deepEqual(output, {
          position: "10",
          meanOpenPrice: "0.1",
          realized: "0.5",
          unrealized: "0",
          total: "0.5",
        });
      },
    });
    test({
      description: "trades: [buy 10 @ 0.1, sell 5 @ 0.1, buy 10 @ 0.2, sell 5 @ 0.2], last price 0.1",
      trades: [{
        type: "buy",
        amount: "10",
        price: "0.1",
        maker: false,
      }, {
        type: "sell",
        amount: "5",
        price: "0.1",
        maker: false,
      }, {
        type: "buy",
        amount: "10",
        price: "0.2",
        maker: false,
      }, {
        type: "sell",
        amount: "5",
        price: "0.2",
        maker: false,
      }],
      lastPrice: "0.1",
      assertions: function (output) {
        assert.deepEqual(output, {
          position: "10",
          meanOpenPrice: "0.166666666666666666667",
          realized: "0.166666666666666666665",
          unrealized: "-0.66666666666666666667",
          total: "-0.500000000000000000005",
        });
      },
    });
    test({
      description: "trades: [buy 10 @ 0.1, sell 5 @ 0.2, buy 10 @ 0.2, sell 5 @ 0.3], last price 0.3",
      trades: [{
        type: "buy",
        amount: "10",
        price: "0.1",
        maker: false,
      }, {
        type: "sell",
        amount: "5",
        price: "0.2",
        maker: false,
      }, {
        type: "buy",
        amount: "10",
        price: "0.2",
        maker: false,
      }, {
        type: "sell",
        amount: "5",
        price: "0.3",
        maker: false,
      }],
      lastPrice: "0.3",
      assertions: function (output) {
        assert.deepEqual(output, {
          position: "10",
          meanOpenPrice: "0.166666666666666666667",
          realized: "1.166666666666666666665",
          unrealized: "1.33333333333333333333",
          total: "2.499999999999999999995",
        });
      },
    });
    test({
      description: "trades: [sell 10 @ 0.1, sell 10 @ 0.1], last price 0.1",
      trades: [{
        type: "sell",
        amount: "10",
        price: "0.1",
        maker: false,
      }, {
        type: "sell",
        amount: "10",
        price: "0.1",
        maker: false,
      }],
      lastPrice: "0.1",
      assertions: function (output) {
        assert.deepEqual(output, {
          position: "-20",
          meanOpenPrice: "0.1",
          realized: "0",
          unrealized: "0",
          total: "0",
        });
      },
    });
    test({
      description: "trades: [sell 10 @ 0.1, sell 10 @ 0.2], last price 0.2",
      trades: [{
        type: "sell",
        amount: "10",
        price: "0.1",
        maker: false,
      }, {
        type: "sell",
        amount: "10",
        price: "0.2",
        maker: false,
      }],
      lastPrice: "0.2",
      assertions: function (output) {
        assert.deepEqual(output, {
          position: "-20",
          meanOpenPrice: "0.15",
          realized: "0",
          unrealized: "-1",
          total: "-1",
        });
      },
    });
    test({
      description: "trades: [sell 10 @ 0.1, sell 10 @ 0.2], last price 0.3",
      trades: [{
        type: "sell",
        amount: "10",
        price: "0.1",
        maker: false,
      }, {
        type: "sell",
        amount: "10",
        price: "0.2",
        maker: false,
      }],
      lastPrice: "0.3",
      assertions: function (output) {
        assert.deepEqual(output, {
          position: "-20",
          meanOpenPrice: "0.15",
          realized: "0",
          unrealized: "-3",
          total: "-3",
        });
      },
    });
    test({
      description: "trades: [sell 10 @ 0.1, buy 10 @ 0.1], last price 0.1",
      trades: [{
        type: "sell",
        amount: "10",
        price: "0.1",
        maker: false,
      }, {
        type: "buy",
        amount: "10",
        price: "0.1",
        maker: false,
      }],
      lastPrice: "0.1",
      assertions: function (output) {
        assert.deepEqual(output, {
          position: "0",
          meanOpenPrice: "0",
          realized: "0",
          unrealized: "0",
          total: "0",
        });
      },
    });
    test({
      description: "trades: [sell 10 @ 0.1, buy 10 @ 0.2], last price 0.2",
      trades: [{
        type: "sell",
        amount: "10",
        price: "0.1",
        maker: false,
      }, {
        type: "buy",
        amount: "10",
        price: "0.2",
        maker: false,
      }],
      lastPrice: "0.2",
      assertions: function (output) {
        assert.deepEqual(output, {
          position: "0",
          meanOpenPrice: "0",
          realized: "-1",
          unrealized: "0",
          total: "-1",
        });
      },
    });
    test({
      description: "trades: [sell 10 @ 0.2, buy 10 @ 0.1], last price 0.1",
      trades: [{
        type: "sell",
        amount: "10",
        price: "0.2",
        maker: false,
      }, {
        type: "buy",
        amount: "10",
        price: "0.1",
        maker: false,
      }],
      lastPrice: "0.1",
      assertions: function (output) {
        assert.deepEqual(output, {
          position: "0",
          meanOpenPrice: "0",
          realized: "1",
          unrealized: "0",
          total: "1",
        });
      },
    });
    test({
      description: "trades: [sell 10 @ 0.1, buy 10 @ 0.2, sell complete sets 10], last price 0.2",
      trades: [{
        type: "sell",
        amount: "10",
        price: "0.1",
        maker: false,
      }, {
        type: "buy",
        amount: "10",
        price: "0.2",
        maker: false,
      }, {
        isCompleteSet: true,
        type: "sell",
        amount: "10",
        price: "0.2",
      }],
      lastPrice: "0.2",
      assertions: function (output) {
        assert.deepEqual(output, {
          position: "0",
          meanOpenPrice: "0",
          realized: "-1",
          unrealized: "0",
          total: "-1",
        });
      },
    });
    test({
      description: "trades: [sell 10 @ 0.2, buy 10 @ 0.1, sell complete sets 10], last price 0.1",
      trades: [{
        type: "sell",
        amount: "10",
        price: "0.2",
        maker: false,
      }, {
        type: "buy",
        amount: "10",
        price: "0.1",
        maker: false,
      }, {
        isCompleteSet: true,
        type: "sell",
        amount: "10",
        price: "0.2",
      }],
      lastPrice: "0.1",
      assertions: function (output) {
        assert.deepEqual(output, {
          position: "0",
          meanOpenPrice: "0",
          realized: "1",
          unrealized: "0",
          total: "1",
        });
      },
    });
    test({
      description: "trades: [sell 10 @ 0.1, buy 10 @ 0.2, sell complete sets 5], last price 0.2",
      trades: [{
        type: "sell",
        amount: "10",
        price: "0.1",
        maker: false,
      }, {
        type: "buy",
        amount: "10",
        price: "0.2",
        maker: false,
      }, {
        isCompleteSet: true,
        type: "sell",
        amount: "5",
        price: "0.2",
      }],
      lastPrice: "0.2",
      assertions: function (output) {
        assert.deepEqual(output, {
          position: "0",
          meanOpenPrice: "0",
          realized: "-1",
          unrealized: "0",
          total: "-1",
        });
      },
    });
    test({
      description: "trades: [sell 10 @ 0.1, buy 10 @ 0.2, sell complete sets 2, sell complete sets 3], last price 0.2",
      trades: [{
        type: "sell",
        amount: "10",
        price: "0.1",
        maker: false,
      }, {
        type: "buy",
        amount: "10",
        price: "0.2",
        maker: false,
      }, {
        isCompleteSet: true,
        type: "sell",
        amount: "2",
        price: "0.2",
      }, {
        isCompleteSet: true,
        type: "sell",
        amount: "3",
        price: "0.2",
      }],
      lastPrice: "0.2",
      assertions: function (output) {
        assert.deepEqual(output, {
          position: "0",
          meanOpenPrice: "0",
          realized: "-1",
          unrealized: "0",
          total: "-1",
        });
      },
    });
    test({
      description: "trades: [sell 10 @ 0.1, buy 10 @ 0.2, buy complete sets 5 @ 0.2], last price 0.2",
      trades: [{
        type: "sell",
        amount: "10",
        price: "0.1",
        maker: false,
      }, {
        type: "buy",
        amount: "10",
        price: "0.2",
        maker: false,
      }, {
        isCompleteSet: true,
        type: "buy",
        amount: "5",
        price: "0.2",
      }],
      lastPrice: "0.2",
      assertions: function (output) {
        assert.deepEqual(output, {
          position: "5",
          meanOpenPrice: "0.2",
          realized: "-1",
          unrealized: "0",
          total: "-1",
        });
      },
    });
    test({
      description: "trades: [buy complete sets 5 @ 0.5], last price 0.2",
      trades: [{
        isCompleteSet: true,
        type: "buy",
        amount: "5",
        price: "0.5",
      }],
      lastPrice: "0.5",
      assertions: function (output) {
        assert.deepEqual(output, {
          position: "5",
          meanOpenPrice: "0.5",
          realized: "0",
          unrealized: "0",
          total: "0",
        });
      },
    });
    test({
      description: "trades: [sell 10 @ 0.2, buy 10 @ 0.2, buy complete sets 1 @ 0.25], last price 0.2",
      trades: [{
        type: "sell",
        amount: "10",
        price: "0.2",
        maker: false,
      }, {
        type: "buy",
        amount: "10",
        price: "0.2",
        maker: false,
      }, {
        isCompleteSet: true,
        type: "buy",
        amount: "1",
        price: "0.25",
      }],
      lastPrice: "0.2",
      assertions: function (output) {
        assert.deepEqual(output, {
          position: "1",
          meanOpenPrice: "0.25",
          realized: "0",
          unrealized: "-0.05",
          total: "-0.05",
        });
      },
    });
    test({
      description: "trades: [sell 10 @ 0.1, buy 10 @ 0.2, buy complete sets 5 @ 0.5], last price 0.2",
      trades: [{
        type: "sell",
        amount: "10",
        price: "0.1",
        maker: false,
      }, {
        type: "buy",
        amount: "10",
        price: "0.2",
        maker: false,
      }, {
        isCompleteSet: true,
        type: "buy",
        amount: "5",
        price: "0.5",
      }],
      lastPrice: "0.2",
      assertions: function (output) {
        assert.deepEqual(output, {
          position: "5",
          meanOpenPrice: "0.5",
          realized: "-1",
          unrealized: "-1.5",
          total: "-2.5",
        });
      },
    });
    test({
      description: "trades: [buy complete sets 5, sell complete sets 5], last price 0.2",
      trades: [{
        isCompleteSet: true,
        type: "buy",
        amount: "5",
        price: "0.2",
      }, {
        isCompleteSet: true,
        type: "sell",
        amount: "5",
        price: "0.2",
      }],
      lastPrice: "0.2",
      assertions: function (output) {
        assert.deepEqual(output, {
          position: "0",
          meanOpenPrice: "0",
          realized: "0",
          unrealized: "0",
          total: "0",
        });
      },
    });
    test({
      description: "trades: [sell 10 @ 0.1, buy 10 @ 0.05], last price 0.05",
      trades: [{
        type: "sell",
        amount: "10",
        price: "0.1",
        maker: false,
      }, {
        type: "buy",
        amount: "10",
        price: "0.05",
        maker: false,
      }],
      lastPrice: "0.05",
      assertions: function (output) {
        assert.deepEqual(output, {
          position: "0",
          meanOpenPrice: "0",
          realized: "0.5",
          unrealized: "0",
          total: "0.5",
        });
      },
    });
    test({
      description: "trades: [sell 10 @ 0.1, buy 10 @ 0.05, sell complete sets 10], last price 0.05",
      trades: [{
        type: "sell",
        amount: "10",
        price: "0.1",
        maker: false,
      }, {
        type: "buy",
        amount: "10",
        price: "0.05",
        maker: false,
      }, {
        isCompleteSet: true,
        type: "sell",
        amount: "10",
        price: "0.2",
      }],
      lastPrice: "0.05",
      assertions: function (output) {
        assert.deepEqual(output, {
          position: "0",
          meanOpenPrice: "0",
          realized: "0.5",
          unrealized: "0",
          total: "0.5",
        });
      },
    });
    test({
      description: "trades: [sell 1 @ 0.1, buy 1 @ 0.05], last price 0.05",
      trades: [{
        type: "sell",
        amount: "1",
        price: "0.1",
        maker: false,
      }, {
        type: "buy",
        amount: "1",
        price: "0.05",
        maker: false,
      }],
      lastPrice: "0.05",
      assertions: function (output) {
        assert.deepEqual(output, {
          position: "0",
          meanOpenPrice: "0",
          realized: "0.05",
          unrealized: "0",
          total: "0.05",
        });
      },
    });
    test({
      description: "trades: [sell 2 @ 0.1, buy 1 @ 0.05], last price 0.05",
      trades: [{
        type: "sell",
        amount: "2",
        price: "0.1",
        maker: false,
      }, {
        type: "buy",
        amount: "1",
        price: "0.05",
        maker: false,
      }],
      lastPrice: "0.05",
      assertions: function (output) {
        assert.deepEqual(output, {
          position: "-1",
          meanOpenPrice: "0.1",
          realized: "0.05",
          unrealized: "0.05",
          total: "0.1",
        });
      },
    });
    test({
      description: "trades: [buy 2 @ 0.05, sell 1 @ 0.1], last price 0.1",
      trades: [{
        type: "buy",
        amount: "2",
        price: "0.05",
        maker: false,
      }, {
        type: "sell",
        amount: "1",
        price: "0.1",
        maker: false,
      }],
      lastPrice: "0.1",
      assertions: function (output) {
        assert.deepEqual(output, {
          position: "1",
          meanOpenPrice: "0.05",
          realized: "0.05",
          unrealized: "0.05",
          total: "0.1",
        });
      },
    });
    test({
      description: "trades: [sell 10 @ 0.1, buy 5 @ 0.05], last price 0.05",
      trades: [{
        type: "sell",
        amount: "10",
        price: "0.1",
        maker: false,
      }, {
        type: "buy",
        amount: "5",
        price: "0.05",
        maker: false,
      }],
      lastPrice: "0.05",
      assertions: function (output) {
        assert.deepEqual(output, {
          position: "-5",
          meanOpenPrice: "0.1",
          realized: "0.25",
          unrealized: "0.25",
          total: "0.5",
        });
      },
    });
    test({
      description: "trades: [sell 10 @ 0.1, buy 5 @ 0.15], last price 0.15",
      trades: [{
        type: "sell",
        amount: "10",
        price: "0.1",
        maker: false,
      }, {
        type: "buy",
        amount: "5",
        price: "0.15",
        maker: false,
      }],
      lastPrice: "0.15",
      assertions: function (output) {
        assert.deepEqual(output, {
          position: "-5",
          meanOpenPrice: "0.1",
          realized: "-0.25",
          unrealized: "-0.25",
          total: "-0.5",
        });
      },
    });
    test({
      description: "trades: [sell 10 @ 0.1, buy 20 @ 0.15], last price 0.15",
      trades: [{
        type: "sell",
        amount: "10",
        price: "0.1",
        maker: false,
      }, {
        type: "buy",
        amount: "20",
        price: "0.15",
        maker: false,
      }],
      lastPrice: "0.15",
      assertions: function (output) {
        assert.deepEqual(output, {
          position: "10",
          meanOpenPrice: "0.15",
          realized: "-0.5",
          unrealized: "0",
          total: "-0.5",
        });
      },
    });
    test({
      description: "trades: [sell 10 @ 0.1, buy 5 @ 0.05, sell complete sets 5], last price 0.05",
      trades: [{
        type: "sell",
        amount: "10",
        price: "0.1",
        maker: false,
      }, {
        type: "buy",
        amount: "5",
        price: "0.05",
        maker: false,
      }, {
        isCompleteSet: true,
        type: "sell",
        amount: 5,
        price: "0.2",
      }],
      lastPrice: "0.05",
      assertions: function (output) {
        assert.deepEqual(output, {
          position: "-5",
          meanOpenPrice: "0.1",
          realized: "0.25",
          unrealized: "0.25",
          total: "0.5",
        });
      },
    });
    test({
      description: "trades: [sell 10 @ 0.1, buy 1 @ 0.05, buy 4 @ 0.05], last price 0.05",
      trades: [{
        type: "sell",
        amount: "10",
        price: "0.1",
        maker: false,
      }, {
        type: "buy",
        amount: "1",
        price: "0.05",
        maker: false,
      }, {
        type: "buy",
        amount: "4",
        price: "0.05",
        maker: false,
      }],
      lastPrice: "0.05",
      assertions: function (output) {
        assert.deepEqual(output, {
          position: "-5",
          meanOpenPrice: "0.1",
          realized: "0.25",
          unrealized: "0.25",
          total: "0.5",
        });
      },
    });
    test({
      description: "trades: [sell 10 @ 0.1, buy 1 @ 0.05, buy 4 @ 0.05, sell complete sets 5], last price 0.05",
      trades: [{
        type: "sell",
        amount: "10",
        price: "0.1",
        maker: false,
      }, {
        type: "buy",
        amount: "1",
        price: "0.05",
        maker: false,
      }, {
        type: "buy",
        amount: "4",
        price: "0.05",
        maker: false,
      }, {
        isCompleteSet: true,
        type: "sell",
        amount: "5",
        price: "0.05",
      }],
      lastPrice: "0.05",
      assertions: function (output) {
        assert.deepEqual(output, {
          position: "-5",
          meanOpenPrice: "0.1",
          realized: "0.25",
          unrealized: "0.25",
          total: "0.5",
        });
      },
    });
    test({
      description: "trades: [sell 10 @ 0.1, buy 1 @ 0.05, buy 4 @ 0.1], last price 0.05",
      trades: [{
        type: "sell",
        amount: "10",
        price: "0.1",
        maker: false,
      }, {
        type: "buy",
        amount: "1",
        price: "0.05",
        maker: false,
      }, {
        type: "buy",
        amount: "4",
        price: "0.1",
        maker: false,
      }],
      lastPrice: "0.05",
      assertions: function (output) {
        assert.deepEqual(output, {
          position: "-5",
          meanOpenPrice: "0.1",
          realized: "0.05",
          unrealized: "0.25",
          total: "0.3",
        });
      },
    });
    test({
      description: "trades: [sell 10 @ 0.1, buy 1 @ 0.05, buy 4 @ 0.1, sell complete sets 5], last price 0.05",
      trades: [{
        type: "sell",
        amount: "10",
        price: "0.1",
        maker: false,
      }, {
        type: "buy",
        amount: "1",
        price: "0.05",
        maker: false,
      }, {
        type: "buy",
        amount: "4",
        price: "0.1",
        maker: false,
      }, {
        isCompleteSet: true,
        type: "sell",
        amount: "5",
        price: "0.1",
      }],
      lastPrice: "0.05",
      assertions: function (output) {
        assert.deepEqual(output, {
          position: "-5",
          meanOpenPrice: "0.1",
          realized: "0.05",
          unrealized: "0.25",
          total: "0.3",
        });
      },
    });
    test({
      description: "trades: [sell 10 @ 0.1, sell 10 @ 0.2, buy 10 @ 0.2], last price 0.2",
      trades: [{
        type: "sell",
        amount: "10",
        price: "0.1",
        maker: false,
      }, {
        type: "sell",
        amount: "10",
        price: "0.2",
        maker: false,
      }, {
        type: "buy",
        amount: "10",
        price: "0.2",
        maker: false,
      }],
      lastPrice: "0.2",
      assertions: function (output) {
        assert.deepEqual(output, {
          position: "-10",
          meanOpenPrice: "0.15",
          realized: "-0.5",
          unrealized: "-0.5",
          total: "-1",
        });
      },
    });
    test({
      description: "trades: [sell 10 @ 0.1, sell 10 @ 0.2, buy 10 @ 0.2, sell complete sets 10], last price 0.2",
      trades: [{
        type: "sell",
        amount: "10",
        price: "0.1",
        maker: false,
      }, {
        type: "sell",
        amount: "10",
        price: "0.2",
        maker: false,
      }, {
        type: "buy",
        amount: "10",
        price: "0.2",
        maker: false,
      }, {
        isCompleteSet: true,
        type: "sell",
        amount: "10",
        price: "0.2",
      }],
      lastPrice: "0.2",
      assertions: function (output) {
        assert.deepEqual(output, {
          position: "-10",
          meanOpenPrice: "0.15",
          realized: "-0.5",
          unrealized: "-0.5",
          total: "-1",
        });
      },
    });
    test({
      description: "trades: [buy 10 @ 0.52, sell 10 @ 0.48, sell 10 @ 0.48], last price 0.48",
      trades: [{
        type: "buy",
        amount: "10",
        price: "0.52",
        maker: false,
      }, {
        type: "sell",
        amount: "10",
        price: "0.48",
        maker: false,
      }, {
        type: "sell",
        amount: "10",
        price: "0.48",
        maker: false,
      }],
      lastPrice: "0.48",
      assertions: function (output) {
        assert.deepEqual(output, {
          position: "-10",
          meanOpenPrice: "0.48",
          realized: "-0.4",
          unrealized: "0",
          total: "-0.4",
        });
      },
    });
    test({
      description: "trades: [buy 10 @ 0.52, sell 20 @ 0.48], last price 0.48",
      trades: [{
        type: "buy",
        amount: "10",
        price: "0.52",
        maker: false,
      }, {
        type: "sell",
        amount: "20",
        price: "0.48",
        maker: false,
      }],
      lastPrice: "0.48",
      assertions: function (output) {
        assert.deepEqual(output, {
          position: "-10",
          meanOpenPrice: "0.48",
          realized: "-0.4",
          unrealized: "0",
          total: "-0.4",
        });
      },
    });
    test({
      description: "trades: [buy 10 @ 0.52, sell complete sets 10 @ 0.48, sell 10 @ 0.48], last price 0.48",
      trades: [{
        type: "buy",
        amount: "10",
        price: "0.52",
        maker: false,
      }, {
        isCompleteSet: true,
        type: "sell",
        amount: "10",
        price: "0.48",
      }, {
        type: "sell",
        amount: "10",
        price: "0.48",
        maker: false,
      }],
      lastPrice: "0.48",
      assertions: function (output) {
        assert.deepEqual(output, {
          position: "-10",
          meanOpenPrice: "0.48",
          realized: "-0.4",
          unrealized: "0",
          total: "-0.4",
        });
      },
    });
    test({
      description: "trades: [buy complete sets 10 @ 0.52, sell complete sets 10 @ 0.48, sell 10 @ 0.48], last price 0.48",
      trades: [{
        isCompleteSet: true,
        type: "buy",
        amount: "10",
        price: "0.52",
      }, {
        isCompleteSet: true,
        type: "sell",
        amount: "10",
        price: "0.48",
      }, {
        type: "sell",
        amount: "10",
        price: "0.48",
        maker: false,
      }],
      lastPrice: "0.48",
      assertions: function (output) {
        assert.deepEqual(output, {
          position: "-10",
          meanOpenPrice: "0.48",
          realized: "-0.4",
          unrealized: "0",
          total: "-0.4",
        });
      },
    });
    test({
      description: "trades: [buy 10 @ 0.52, sell 5 @ 0.48, sell complete sets 5 @ 0.48], last price 0.48",
      trades: [{
        type: "buy",
        amount: "10",
        price: "0.52",
      }, {
        type: "sell",
        amount: "5",
        price: "0.48",
        maker: false,
      }, {
        isCompleteSet: true,
        type: "sell",
        amount: "5",
        price: "0.48",
      }],
      lastPrice: "0.48",
      assertions: function (output) {
        assert.deepEqual(output, {
          position: "0",
          meanOpenPrice: "0",
          realized: "-0.4",
          unrealized: "0",
          total: "-0.4",
        });
      },
    });
    test({
      description: "trades: [buy 10 @ 0.52, sell 6 @ 0.48], last price 0.48",
      trades: [{
        type: "buy",
        amount: "10",
        price: "0.52",
      }, {
        type: "sell",
        amount: "6",
        price: "0.48",
        maker: false,
      }],
      lastPrice: "0.48",
      assertions: function (output) {
        assert.deepEqual(output, {
          position: "4",
          meanOpenPrice: "0.52",
          realized: "-0.24",
          unrealized: "-0.16",
          total: "-0.4",
        });
      },
    });
    test({
      description: "trades: [buy 10 @ 0.52, sell 5 @ 0.48, sell complete sets 1 @ 0.48], last price 0.48",
      trades: [{
        type: "buy",
        amount: "10",
        price: "0.52",
      }, {
        type: "sell",
        amount: "5",
        price: "0.48",
        maker: false,
      }, {
        isCompleteSet: true,
        type: "sell",
        amount: "1",
        price: "0.48",
      }],
      lastPrice: "0.48",
      assertions: function (output) {
        assert.deepEqual(output, {
          position: "4",
          meanOpenPrice: "0.52",
          realized: "-0.24",
          unrealized: "-0.16",
          total: "-0.4",
        });
      },
    });
    test({
      description: "trades: [sell 10 @ 0.48, buy 10 @ 0.52, buy 10 @ 0.52], last price 0.52",
      trades: [{
        type: "sell",
        amount: "10",
        price: "0.48",
        maker: false,
      }, {
        type: "buy",
        amount: "10",
        price: "0.52",
        maker: false,
      }, {
        type: "buy",
        amount: "10",
        price: "0.52",
        maker: false,
      }],
      lastPrice: "0.52",
      assertions: function (output) {
        assert.deepEqual(output, {
          position: "10",
          meanOpenPrice: "0.52",
          realized: "-0.4",
          unrealized: "0",
          total: "-0.4",
        });
      },
    });
    test({
      description: "trades: [sell 10 @ 0.48, buy 20 @ 0.52], last price 0.52",
      trades: [{
        type: "sell",
        amount: "10",
        price: "0.48",
        maker: false,
      }, {
        type: "buy",
        amount: "20",
        price: "0.52",
        maker: false,
      }],
      lastPrice: "0.52",
      assertions: function (output) {
        assert.deepEqual(output, {
          position: "10",
          meanOpenPrice: "0.52",
          realized: "-0.4",
          unrealized: "0",
          total: "-0.4",
        });
      },
    });
    test({
      description: "trades: [sell 10 @ 0.48, buy complete sets 20 @ 0.52], last price 0.52",
      trades: [{
        type: "sell",
        amount: "10",
        price: "0.48",
        maker: false,
      }, {
        isCompleteSet: true,
        type: "buy",
        amount: "20",
        price: "0.52",
      }],
      lastPrice: "0.52",
      assertions: function (output) {
        assert.deepEqual(output, {
          position: "10",
          meanOpenPrice: "0.52",
          realized: "-0.4",
          unrealized: "0",
          total: "-0.4",
        });
      },
    });
  });

  describe("maker trades", function () {
    test({
      description: "trades: [ask 1 @ 2], last price 2",
      trades: [{
        type: "sell",
        amount: "1",
        price: "2",
        maker: true,
      }],
      lastPrice: "2",
      assertions: function (output) {
        assert.deepEqual(output, {
          position: "1",
          meanOpenPrice: "2",
          realized: "0",
          unrealized: "0",
          total: "0",
        });
      },
    });
    test({
      description: "trades: [ask 1 @ 1], last price 2",
      trades: [{
        type: "sell",
        amount: "1",
        price: "1",
        maker: true,
      }],
      lastPrice: "2",
      assertions: function (output) {
        assert.deepEqual(output, {
          position: "1",
          meanOpenPrice: "1",
          realized: "0",
          unrealized: "1",
          total: "1",
        });
      },
    });
    test({
      description: "trades: [ask 1 @ 3], last price 2",
      trades: [{
        type: "sell",
        amount: "1",
        price: "3",
        maker: true,
      }],
      lastPrice: "2",
      assertions: function (output) {
        assert.deepEqual(output, {
          position: "1",
          meanOpenPrice: "3",
          realized: "0",
          unrealized: "-1",
          total: "-1",
        });
      },
    });
    test({
      description: "trades: [ask 2 @ 3], last price 2",
      trades: [{
        type: "sell",
        amount: "2",
        price: "3",
        maker: true,
      }],
      lastPrice: "2",
      assertions: function (output) {
        assert.deepEqual(output, {
          position: "2",
          meanOpenPrice: "3",
          realized: "0",
          unrealized: "-2",
          total: "-2",
        });
      },
    });
    test({
      description: "trades: [ask 2 @ 1], last price 1",
      trades: [{
        type: "sell",
        amount: "2",
        price: "1",
        maker: true,
      }],
      lastPrice: "1",
      assertions: function (output) {
        assert.deepEqual(output, {
          position: "2",
          meanOpenPrice: "1",
          realized: "0",
          unrealized: "0",
          total: "0",
        });
      },
    });
    test({
      description: "trades: [ask 2 @ 1, bid 1 @ 1], last price 2",
      trades: [{
        type: "sell",
        amount: "2",
        price: "1",
        maker: true,
      }, {
        type: "buy",
        amount: "1",
        price: "1",
        maker: true,
      }],
      lastPrice: "2",
      assertions: function (output) {
        assert.deepEqual(output, {
          position: "1",
          meanOpenPrice: "1",
          realized: "0",
          unrealized: "1",
          total: "1",
        });
      },
    });
    test({
      description: "trades: [ask 2 @ 1, bid 1 @ 2], last price 2",
      trades: [{
        type: "sell",
        amount: "2",
        price: "1",
        maker: true,
      }, {
        type: "buy",
        amount: "1",
        price: "2",
        maker: true,
      }],
      lastPrice: "2",
      assertions: function (output) {
        assert.deepEqual(output, {
          position: "1",
          meanOpenPrice: "1",
          realized: "1",
          unrealized: "1",
          total: "2",
        });
      },
    });
    test({
      description: "trades: [ask 2 @ 1, bid 2 @ 2], last price 2",
      trades: [{
        type: "sell",
        amount: "2",
        price: "1",
        maker: true,
      }, {
        type: "buy",
        amount: "2",
        price: "2",
        maker: true,
      }],
      lastPrice: "2",
      assertions: function (output) {
        assert.deepEqual(output, {
          position: "0",
          meanOpenPrice: "0",
          realized: "2",
          unrealized: "0",
          total: "2",
        });
      },
    });
    test({
      description: "trades: [ask 2 @ 1, bid 1 @ 1, bid 1 @ 2], last price 2",
      trades: [{
        type: "sell",
        amount: "2",
        price: "1",
        maker: true,
      }, {
        type: "buy",
        amount: "1",
        price: "1",
        maker: true,
      }, {
        type: "buy",
        amount: "1",
        price: "2",
        maker: true,
      }],
      lastPrice: "2",
      assertions: function (output) {
        assert.deepEqual(output, {
          position: "0",
          meanOpenPrice: "0",
          realized: "1",
          unrealized: "0",
          total: "1",
        });
      },
    });
    test({
      description: "trades: [ask 3 @ 1, bid 1 @ 1, bid 1 @ 2], last price 2",
      trades: [{
        type: "sell",
        amount: "3",
        price: "1",
        maker: true,
      }, {
        type: "buy",
        amount: "1",
        price: "1",
        maker: true,
      }, {
        type: "buy",
        amount: "1",
        price: "2",
        maker: true,
      }],
      lastPrice: "2",
      assertions: function (output) {
        assert.deepEqual(output, {
          position: "1",
          meanOpenPrice: "1",
          realized: "1",
          unrealized: "1",
          total: "2",
        });
      },
    });
    test({
      description: "trades: [ask 3 @ 1, bid 1 @ 2, bid 1 @ 1], last price 2",
      trades: [{
        type: "sell",
        amount: "3",
        price: "1",
        maker: true,
      }, {
        type: "buy",
        amount: "1",
        price: "2",
        maker: true,
      }, {
        type: "buy",
        amount: "1",
        price: "1",
        maker: true,
      }],
      lastPrice: "2",
      assertions: function (output) {
        assert.deepEqual(output, {
          position: "1",
          meanOpenPrice: "1",
          realized: "1",
          unrealized: "1",
          total: "2",
        });
      },
    });
    test({
      description: "trades: [ask 3 @ 1, bid 1 @ 2, bid 1 @ 1], last price 1",
      trades: [{
        type: "sell",
        amount: "3",
        price: "1",
        maker: true,
      }, {
        type: "buy",
        amount: "1",
        price: "2",
        maker: true,
      }, {
        type: "buy",
        amount: "1",
        price: "1",
        maker: true,
      }],
      lastPrice: "1",
      assertions: function (output) {
        assert.deepEqual(output, {
          position: "1",
          meanOpenPrice: "1",
          realized: "1",
          unrealized: "0",
          total: "1",
        });
      },
    });
    test({
      description: "trades: [ask 3 @ 1, bid 1 @ 3, bid 1 @ 1], last price 1",
      trades: [{
        type: "sell",
        amount: "3",
        price: "1",
        maker: true,
      }, {
        type: "buy",
        amount: "1",
        price: "3",
        maker: true,
      }, {
        type: "buy",
        amount: "1",
        price: "1",
        maker: true,
      }],
      lastPrice: "1",
      assertions: function (output) {
        assert.deepEqual(output, {
          position: "1",
          meanOpenPrice: "1",
          realized: "2",
          unrealized: "0",
          total: "2",
        });
      },
    });
    test({
      description: "trades: [ask 3 @ 2, bid 1 @ 1], last price 1",
      trades: [{
        type: "sell",
        amount: "3",
        price: "2",
        maker: true,
      }, {
        type: "buy",
        amount: "1",
        price: "1",
        maker: true,
      }],
      lastPrice: "1",
      assertions: function (output) {
        assert.deepEqual(output, {
          position: "2",
          meanOpenPrice: "2",
          realized: "-1",
          unrealized: "-2",
          total: "-3",
        });
      },
    });
    test({
      description: "trades: [ask 3 @ 2, bid 1 @ 1, bid 2 @ 2], last price 1",
      trades: [{
        type: "sell",
        amount: "3",
        price: "2",
        maker: true,
      }, {
        type: "buy",
        amount: "1",
        price: "1",
        maker: true,
      }, {
        type: "buy",
        amount: "2",
        price: "2",
        maker: true,
      }],
      lastPrice: "1",
      assertions: function (output) {
        assert.deepEqual(output, {
          position: "0",
          meanOpenPrice: "0",
          realized: "-1",
          unrealized: "0",
          total: "-1",
        });
      },
    });
    test({
      description: "trades: [ask 100 @ 0.5, bid 10 @ 0.5], last price 0.5",
      trades: [{
        type: "sell",
        amount: "100",
        price: "0.5",
        maker: true,
      }, {
        type: "buy",
        amount: "10",
        price: "0.5",
        maker: true,
      }],
      lastPrice: "0.5",
      assertions: function (output) {
        assert.deepEqual(output, {
          position: "90",
          meanOpenPrice: "0.5",
          realized: "0",
          unrealized: "0",
          total: "0",
        });
      },
    });
    test({
      description: "trades: [ask 10 @ 0.5, ask 90 @ 0.5, bid 10 @ 0.5], last price 0.5",
      trades: [{
        type: "sell",
        amount: "10",
        price: "0.5",
        maker: true,
      }, {
        type: "sell",
        amount: "90",
        price: "0.5",
        maker: true,
      }, {
        type: "buy",
        amount: "10",
        price: "0.5",
        maker: true,
      }],
      lastPrice: "0.5",
      assertions: function (output) {
        assert.deepEqual(output, {
          position: "90",
          meanOpenPrice: "0.5",
          realized: "0",
          unrealized: "0",
          total: "0",
        });
      },
    });
    test({
      description: "trades: [ask 10 @ 0.4, bid 10 @ 0.5], last price 0.5",
      trades: [{
        type: "sell",
        amount: "10",
        price: "0.4",
        maker: true,
      }, {
        type: "buy",
        amount: "10",
        price: "0.5",
        maker: true,
      }],
      lastPrice: "0.5",
      assertions: function (output) {
        assert.deepEqual(output, {
          position: "0",
          meanOpenPrice: "0",
          realized: "1",
          unrealized: "0",
          total: "1",
        });
      },
    });
    test({
      description: "trades: [ask 10 @ 0.4, ask 10 @ 0.5], last price 0.6",
      trades: [{
        type: "sell",
        amount: "10",
        price: "0.4",
        maker: true,
      }, {
        type: "sell",
        amount: "10",
        price: "0.5",
        maker: true,
      }],
      lastPrice: "0.6",
      assertions: function (output) {
        assert.deepEqual(output, {
          position: "20",
          meanOpenPrice: "0.45",
          realized: "0",
          unrealized: "3",
          total: "3",
        });
      },
    });
    test({
      description: "trades: [ask 10 @ 0.4, ask 10 @ 0.5], last price 0.3",
      trades: [{
        type: "sell",
        amount: "10",
        price: "0.4",
        maker: true,
      }, {
        type: "sell",
        amount: "10",
        price: "0.5",
        maker: true,
      }],
      lastPrice: "0.3",
      assertions: function (output) {
        assert.deepEqual(output, {
          position: "20",
          meanOpenPrice: "0.45",
          realized: "0",
          unrealized: "-3",
          total: "-3",
        });
      },
    });
    test({
      description: "trades: [ask 10 @ 0.4, ask 10 @ 0.5], last price 0.1",
      trades: [{
        type: "sell",
        amount: "10",
        price: "0.4",
        maker: true,
      }, {
        type: "sell",
        amount: "10",
        price: "0.5",
        maker: true,
      }],
      lastPrice: "0.1",
      assertions: function (output) {
        assert.deepEqual(output, {
          position: "20",
          meanOpenPrice: "0.45",
          realized: "0",
          unrealized: "-7",
          total: "-7",
        });
      },
    });
    test({
      description: "trades: [ask 10 @ 0.1, ask 10 @ 0.5, bid 10 @ 0.2], last price 0.2",
      trades: [{
        type: "sell",
        amount: "10",
        price: "0.1",
        maker: true,
      }, {
        type: "sell",
        amount: "10",
        price: "0.5",
        maker: true,
      }, {
        type: "buy",
        amount: "10",
        price: "0.2",
        maker: true,
      }],
      lastPrice: "0.2",
      assertions: function (output) {
        assert.deepEqual(output, {
          position: "10",
          meanOpenPrice: "0.3",
          realized: "-1",
          unrealized: "-1",
          total: "-2",
        });
      },
    });
    test({
      description: "trades: [ask 15 @ 0.1, ask 5 @ 0.5, bid 10 @ 0.2], last price 0.2",
      trades: [{
        type: "sell",
        amount: "15",
        price: "0.1",
        maker: true,
      }, {
        type: "sell",
        amount: "5",
        price: "0.5",
        maker: true,
      }, {
        type: "buy",
        amount: "10",
        price: "0.2",
        maker: true,
      }],
      lastPrice: "0.2",
      assertions: function (output) {
        assert.deepEqual(output, {
          position: "10",
          meanOpenPrice: "0.2",
          realized: "0",
          unrealized: "0",
          total: "0",
        });
      },
    });
    test({
      description: "trades: [ask 15 @ 0.1, ask 5 @ 0.5, bid 10 @ 0.2], last price 0.1",
      trades: [{
        type: "sell",
        amount: "15",
        price: "0.1",
        maker: true,
      }, {
        type: "sell",
        amount: "5",
        price: "0.5",
        maker: true,
      }, {
        type: "buy",
        amount: "10",
        price: "0.2",
        maker: true,
      }],
      lastPrice: "0.1",
      assertions: function (output) {
        assert.deepEqual(output, {
          position: "10",
          meanOpenPrice: "0.2",
          realized: "0",
          unrealized: "-1",
          total: "-1",
        });
      },
    });
    test({
      description: "trades: [ask 10 @ 0.1, bid 5 @ 0.1, ask 10 @ 0.1, bid 5 @ 0.1], last price 0.1",
      trades: [{
        type: "sell",
        amount: "10",
        price: "0.1",
        maker: true,
      }, {
        type: "buy",
        amount: "5",
        price: "0.1",
        maker: true,
      }, {
        type: "sell",
        amount: "10",
        price: "0.1",
        maker: true,
      }, {
        type: "buy",
        amount: "5",
        price: "0.1",
        maker: true,
      }],
      lastPrice: "0.1",
      assertions: function (output) {
        assert.deepEqual(output, {
          position: "10",
          meanOpenPrice: "0.1",
          realized: "0",
          unrealized: "0",
          total: "0",
        });
      },
    });
    test({
      description: "trades: [ask 10 @ 0.1, bid 5 @ 0.1, ask 10 @ 0.1, bid 5 @ 0.2], last price 0.1",
      trades: [{
        type: "sell",
        amount: "10",
        price: "0.1",
        maker: true,
      }, {
        type: "buy",
        amount: "5",
        price: "0.1",
        maker: true,
      }, {
        type: "sell",
        amount: "10",
        price: "0.1",
        maker: true,
      }, {
        type: "buy",
        amount: "5",
        price: "0.2",
        maker: true,
      }],
      lastPrice: "0.1",
      assertions: function (output) {
        assert.deepEqual(output, {
          position: "10",
          meanOpenPrice: "0.1",
          realized: "0.5",
          unrealized: "0",
          total: "0.5",
        });
      },
    });
    test({
      description: "trades: [ask 10 @ 0.1, bid 5 @ 0.1, ask 10 @ 0.2, bid 5 @ 0.2], last price 0.1",
      trades: [{
        type: "sell",
        amount: "10",
        price: "0.1",
        maker: true,
      }, {
        type: "buy",
        amount: "5",
        price: "0.1",
        maker: true,
      }, {
        type: "sell",
        amount: "10",
        price: "0.2",
        maker: true,
      }, {
        type: "buy",
        amount: "5",
        price: "0.2",
        maker: true,
      }],
      lastPrice: "0.1",
      assertions: function (output) {
        assert.deepEqual(output, {
          position: "10",
          meanOpenPrice: "0.166666666666666666667",
          realized: "0.166666666666666666665",
          unrealized: "-0.66666666666666666667",
          total: "-0.500000000000000000005",
        });
      },
    });
    test({
      description: "trades: [ask 10 @ 0.1, bid 5 @ 0.2, ask 10 @ 0.2, bid 5 @ 0.3], last price 0.3",
      trades: [{
        type: "sell",
        amount: "10",
        price: "0.1",
        maker: true,
      }, {
        type: "buy",
        amount: "5",
        price: "0.2",
        maker: true,
      }, {
        type: "sell",
        amount: "10",
        price: "0.2",
        maker: true,
      }, {
        type: "buy",
        amount: "5",
        price: "0.3",
        maker: true,
      }],
      lastPrice: "0.3",
      assertions: function (output) {
        assert.deepEqual(output, {
          position: "10",
          meanOpenPrice: "0.166666666666666666667",
          realized: "1.166666666666666666665",
          unrealized: "1.33333333333333333333",
          total: "2.499999999999999999995",
        });
      },
    });
  });
});
