/* eslint-env mocha */

"use strict";

var assert = require("chai").assert;
var BigNumber = require("bignumber.js");
var filterByPriceAndUserSortByPrice = require("../../../src/trading/filter-by-price-and-user-sort-by-price");

describe("trading/filter-by-price-and-user-sort-by-price", function () {
  var test = function (t) {
    it(t.description, function () {
      t.assertions(filterByPriceAndUserSortByPrice(t.params));
    });
  };
  test({
    description: "selling: 2 bids",
    params: {
      orderType: 1,
      userAddress: "USER_ADDRESS",
      price: "0.6",
      singleOutcomeOrderBookSide: {
        BID_0: {
          amount: "2",
          fullPrecisionPrice: new BigNumber("0.7", 10),
          owner: "OWNER_ADDRESS",
        },
        BID_1: {
          amount: "1",
          fullPrecisionPrice: new BigNumber("0.6", 10),
          owner: "OWNER_ADDRESS",
        },
      },
    },
    assertions: function (filteredSortedOrders) {
      assert.deepEqual(filteredSortedOrders, [{
        amount: "2",
        fullPrecisionPrice: new BigNumber("0.7", 10),
        owner: "OWNER_ADDRESS",
      }, {
        amount: "1",
        fullPrecisionPrice: new BigNumber("0.6", 10),
        owner: "OWNER_ADDRESS",
      }]);
    },
  });
  test({
    description: "selling: 3 bids, 1 from user",
    params: {
      orderType: 1,
      userAddress: "USER_ADDRESS",
      price: "0.6",
      singleOutcomeOrderBookSide: {
        BID_0: {
          amount: "2",
          fullPrecisionPrice: new BigNumber("0.7", 10),
          owner: "OWNER_ADDRESS",
        },
        BID_1: {
          amount: "1",
          fullPrecisionPrice: new BigNumber("0.6", 10),
          owner: "OWNER_ADDRESS",
        },
        BID_3: {
          amount: "7",
          fullPrecisionPrice: new BigNumber("0.6", 10),
          owner: "USER_ADDRESS",
        },
      },
    },
    assertions: function (filteredSortedOrders) {
      assert.deepEqual(filteredSortedOrders, [{
        amount: "2",
        fullPrecisionPrice: new BigNumber("0.7", 10),
        owner: "OWNER_ADDRESS",
      }, {
        amount: "1",
        fullPrecisionPrice: new BigNumber("0.6", 10),
        owner: "OWNER_ADDRESS",
      }]);
    },
  });
  test({
    description: "selling: 5 bids, 1 from user, 2 with price too low",
    params: {
      orderType: 1,
      userAddress: "USER_ADDRESS",
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
        BID_3: {
          amount: "7",
          fullPrecisionPrice: new BigNumber("0.8", 10),
          owner: "USER_ADDRESS",
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
      userAddress: "USER_ADDRESS",
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
    description: "buying: 3 asks, 1 from user",
    params: {
      orderType: 0,
      userAddress: "USER_ADDRESS",
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
        ASK_3: {
          amount: "1",
          fullPrecisionPrice: new BigNumber("0.65", 10),
          owner: "USER_ADDRESS",
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
    description: "buying: 5 asks, 1 from user, 2 with price too high",
    params: {
      orderType: 0,
      userAddress: "USER_ADDRESS",
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
        ASK_3: {
          amount: "7",
          fullPrecisionPrice: new BigNumber("0.6", 10),
          owner: "USER_ADDRESS",
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
      userAddress: "USER_ADDRESS",
      price: "0.7",
      singleOutcomeOrderBookSide: {},
    },
    assertions: function (filteredSortedOrders) {
      assert.deepEqual(filteredSortedOrders, []);
    },
  });
});
