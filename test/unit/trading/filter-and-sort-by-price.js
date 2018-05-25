/* eslint-env mocha */

"use strict";

var assert = require("chai").assert;
var BigNumber = require("bignumber.js");
var filterAndSortByPrice = require("../../../src/trading/filter-and-sort-by-price");

describe("trading/filter-and-sort-by-price", function () {
  var test = function (t) {
    it(t.description, function () {
      t.assertions(filterAndSortByPrice(t.params));
    });
  };
  test({
    description: "selling: 2 bids",
    params: {
      orderType: 1,
      price: "0.6",
      singleOutcomeOrderBookSide: {
        BID_0: {
          amount: "2",
          fullPrecisionPrice: "0.7",
          owner: "OWNER_ADDRESS",
        },
        BID_1: {
          amount: "1",
          fullPrecisionPrice: "0.6",
          owner: "OWNER_ADDRESS",
        },
      },
    },
    assertions: function (filteredSortedOrders) {
      assert.deepEqual(filteredSortedOrders, [{
        amount: "2",
        fullPrecisionPrice: "0.7",
        owner: "OWNER_ADDRESS",
      }, {
        amount: "1",
        fullPrecisionPrice: "0.6",
        owner: "OWNER_ADDRESS",
      }]);
    },
  });
  test({
    description: "selling: 4 bids, 2 with price too low",
    params: {
      orderType: 1,
      price: "0.6",
      singleOutcomeOrderBookSide: {
        BID_0: {
          amount: "2",
          fullPrecisionPrice: new BigNumber("0.6", 10),
          owner: "OWNER_ADDRESS",
        },
        BID_1: {
          amount: "1",
          fullPrecisionPrice: new BigNumber("0.5", 10),
          owner: "OWNER_ADDRESS",
        },
        BID_4: {
          amount: "3",
          fullPrecisionPrice: new BigNumber("0.7", 10),
          owner: "OWNER_ADDRESS",
        },
        BID_5: {
          amount: "42",
          fullPrecisionPrice: new BigNumber("0.4", 10),
          owner: "OWNER_ADDRESS",
        },
      },
    },
    assertions: function (filteredSortedOrders) {
      assert.deepEqual(filteredSortedOrders, [{
        amount: "3",
        fullPrecisionPrice: new BigNumber("0.7", 10),
        owner: "OWNER_ADDRESS",
      }, {
        amount: "2",
        fullPrecisionPrice: new BigNumber("0.6", 10),
        owner: "OWNER_ADDRESS",
      }]);
    },
  });
  test({
    description: "buying: 2 asks",
    params: {
      orderType: 0,
      price: "0.7",
      singleOutcomeOrderBookSide: {
        ASK_0: {
          amount: "2",
          fullPrecisionPrice: new BigNumber("0.7", 10),
          owner: "OWNER_ADDRESS",
        },
        ASK_1: {
          amount: "1",
          fullPrecisionPrice: new BigNumber("0.6", 10),
          owner: "OWNER_ADDRESS",
        },
      },
    },
    assertions: function (filteredSortedOrders) {
      assert.deepEqual(filteredSortedOrders, [{
        amount: "1",
        fullPrecisionPrice: new BigNumber("0.6", 10),
        owner: "OWNER_ADDRESS",
      }, {
        amount: "2",
        fullPrecisionPrice: new BigNumber("0.7", 10),
        owner: "OWNER_ADDRESS",
      }]);
    },
  });
  test({
    description: "buying: 4 asks, 2 with price too high",
    params: {
      orderType: 0,
      price: "0.7",
      singleOutcomeOrderBookSide: {
        ASK_0: {
          amount: "2",
          fullPrecisionPrice: new BigNumber("0.6", 10),
          owner: "OWNER_ADDRESS",
        },
        ASK_1: {
          amount: "1",
          fullPrecisionPrice: new BigNumber("0.9", 10),
          owner: "OWNER_ADDRESS",
        },
        ASK_4: {
          amount: "3",
          fullPrecisionPrice: new BigNumber("0.7", 10),
          owner: "OWNER_ADDRESS",
        },
        ASK_5: {
          amount: "42",
          fullPrecisionPrice: new BigNumber("0.71", 10),
          owner: "OWNER_ADDRESS",
        },
      },
    },
    assertions: function (filteredSortedOrders) {
      assert.deepEqual(filteredSortedOrders, [{
        amount: "2",
        fullPrecisionPrice: new BigNumber("0.6", 10),
        owner: "OWNER_ADDRESS",
      }, {
        amount: "3",
        fullPrecisionPrice: new BigNumber("0.7", 10),
        owner: "OWNER_ADDRESS",
      }]);
    },
  });
  test({
    description: "return empty array if no order book provided",
    params: {
      orderType: 1,
      price: "0.7",
      singleOutcomeOrderBookSide: {},
    },
    assertions: function (filteredSortedOrders) {
      assert.deepEqual(filteredSortedOrders, []);
    },
  });
});
