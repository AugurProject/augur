"use strict";

var assert = require("chai").assert;
var augur = require("../../../src");
var abi = require("augur-abi");
var BigNumber = require("bignumber.js");
var noop = require("../../../src/utilities").noop;

// 58 tests total
describe("buyAndSellShares Unit Tests", function() {
  describe('augur.cancel tests', function() {
		// 4 tests total
    var test = function (t) {
      it(t.description, function() {
        var transact = augur.transact;
        augur.transact = t.transact;

        augur.cancel(t.trade_id, t.onSent, t.onSuccess, t.onFailed);

        augur.transact = transact;
      });
    };

    test({
      description: "should send a cancel trade transaction with multiple arguments",
      transact: function(tx, onSent, onSuccess, onFailed) {
        assert.deepEqual(tx.to, augur.tx.BuyAndSellShares.cancel.to);
        assert.deepEqual(tx.params, ["tradeID"]);
        assert.isFunction(onSent);
        assert.isFunction(onSuccess);
        assert.isFunction(onFailed);
      },
      trade_id: ['tradeID'],
      onSent: noop,
      onSuccess: noop,
      onFailed: noop
    });
    test({
      description: "should send a cancel trade transaction with 1 object arg",
      transact: function(tx, onSent, onSuccess, onFailed) {
        assert.deepEqual(tx.to, augur.tx.BuyAndSellShares.cancel.to);
        assert.deepEqual(tx.params, ["tradeID"]);
        assert.isFunction(onSent);
        assert.isFunction(onSuccess);
        assert.isFunction(onFailed);
      },
      trade_id: {
        trade_id: ['tradeID'],
        onSent: noop,
        onSuccess: noop,
        onFailed: noop
      },
      onSent: undefined,
      onSuccess: undefined,
      onFailed: undefined
    });
    test({
      description: "should send a cancel trade transaction with 1 trade_id arg only",
      transact: function(tx, onSent, onSuccess, onFailed) {
        assert.deepEqual(tx.to, augur.tx.BuyAndSellShares.cancel.to);
        assert.deepEqual(tx.params, ["tradeID"]);
        assert.isFunction(onSent);
        assert.isFunction(onSuccess);
        assert.isFunction(onFailed);
      },
      trade_id: ['tradeID'],
      onSent: undefined,
      onSuccess: undefined,
      onFailed: undefined
    });
    test({
      description: "should send a cancel trade transaction with 1 object arg but with undefined onSent, onSuccess, onFailed",
      transact: function(tx, onSent, onSuccess, onFailed) {
        assert.deepEqual(tx.to, augur.tx.BuyAndSellShares.cancel.to);
        assert.deepEqual(tx.params, ["tradeID"]);
        assert.isFunction(onSent);
        assert.isFunction(onSuccess);
        assert.isFunction(onFailed);
      },
      trade_id: {
        trade_id: ['tradeID'],
        onSent: undefined,
        onSuccess: undefined,
        onFailed: undefined
      },
      onSent: undefined,
      onSuccess: undefined,
      onFailed: undefined
    });
  });
  describe('augur.buy tests', function() {
		// 18 tests total
    var test = function (t) {
      it(t.description, function() {
        var transact = augur.transact;
        var shrinkScalarPrice = augur.shrinkScalarPrice;
        augur.transact = t.transact;
        augur.shrinkScalarPrice = t.shrinkScalarPrice;

        augur.buy(t.amount, t.price, t.market, t.outcome, t.tradeGroupID, t.scalarMinMax, t.onSent, t.onSuccess, t.onFailed);

        augur.transact = transact;
        augur.shrinkScalarPrice = shrinkScalarPrice;
      });
    };
    test({
      description: "Should handle a binary market buy using JS Number inputs",
      transact: function(tx, onSent, onSuccess, onFailed) {
        assert.deepEqual(tx.to, augur.tx.BuyAndSellShares.buy.to);
        assert.deepEqual(tx.params, ["0x8ac7230489e80000", "0x6f05b59d3b20000", 'testBinaryMarketID', '1', "0x2386f26fc10000", 0]);
        assert.isFunction(onSent);
        assert.isFunction(onSuccess);
        assert.isFunction(onFailed);
      },
      shrinkScalarPrice: function(minValue, price) {
        assert.equal(price, 55);
        assert.equal(minValue, -10);
        if (minValue.constructor !== BigNumber) minValue = abi.bignum(minValue);
        if (price.constructor !== BigNumber) price = abi.bignum(price);
        return price.minus(minValue).toFixed();
      },
      amount: 10,
      price: 0.5,
      market: "testBinaryMarketID",
      outcome: "1",
      scalarMinMax: null,
      onSent: noop,
      onSuccess: noop,
      onFailed: noop
    });
    test({
      description: "Should handle a binary market buy using String inputs",
      transact: function(tx, onSent, onSuccess, onFailed) {
        assert.deepEqual(tx.to, augur.tx.BuyAndSellShares.buy.to);
        assert.deepEqual(tx.params, ["0x8ac7230489e80000", "0x6f05b59d3b20000", 'testBinaryMarketID', '1', "0x2386f26fc10000", 0]);
        assert.isFunction(onSent);
        assert.isFunction(onSuccess);
        assert.isFunction(onFailed);
      },
      shrinkScalarPrice: function(minValue, price) {
        assert.equal(price, 55);
        assert.equal(minValue, -10);
        if (minValue.constructor !== BigNumber) minValue = abi.bignum(minValue);
        if (price.constructor !== BigNumber) price = abi.bignum(price);
        return price.minus(minValue).toFixed();
      },
      amount: "10",
      price: "0.5",
      market: "testBinaryMarketID",
      outcome: "1",
      scalarMinMax: null,
      onSent: noop,
      onSuccess: noop,
      onFailed: noop
    });
    test({
      description: "Should handle a binary market buy using Big Number inputs",
      transact: function(tx, onSent, onSuccess, onFailed) {
        assert.deepEqual(tx.to, augur.tx.BuyAndSellShares.buy.to);
        assert.deepEqual(tx.params, ["0x8ac7230489e80000", "0x6f05b59d3b20000", 'testBinaryMarketID', '1', "0x2386f26fc10000", 0]);
        assert.isFunction(onSent);
        assert.isFunction(onSuccess);
        assert.isFunction(onFailed);
      },
      shrinkScalarPrice: function(minValue, price) {
        assert.equal(price, 55);
        assert.equal(minValue, -10);
        if (minValue.constructor !== BigNumber) minValue = abi.bignum(minValue);
        if (price.constructor !== BigNumber) price = abi.bignum(price);
        return price.minus(minValue).toFixed();
      },
      amount: abi.bignum(10),
      price: abi.bignum(0.5),
      market: "testBinaryMarketID",
      outcome: "1",
      scalarMinMax: null,
      onSent: noop,
      onSuccess: noop,
      onFailed: noop
    });
    test({
      description: "Should handle a binary market buy using String inputs but missing function hooks",
      transact: function(tx, onSent, onSuccess, onFailed) {
        assert.deepEqual(tx.to, augur.tx.BuyAndSellShares.buy.to);
        assert.deepEqual(tx.params, ["0x8ac7230489e80000", "0x6f05b59d3b20000", 'testBinaryMarketID', '1', "0x2386f26fc10000", 0]);
        assert.isFunction(onSent);
        assert.isFunction(onSuccess);
        assert.isFunction(onFailed);
      },
      shrinkScalarPrice: function(minValue, price) {
        assert.equal(price, 55);
        assert.equal(minValue, -10);
        if (minValue.constructor !== BigNumber) minValue = abi.bignum(minValue);
        if (price.constructor !== BigNumber) price = abi.bignum(price);
        return price.minus(minValue).toFixed();
      },
      amount: "10",
      price: "0.5",
      market: "testBinaryMarketID",
      outcome: "1",
      scalarMinMax: null
    });
    test({
      description: "Should handle a binary market buy using String inputs in a single object argument",
      transact: function(tx, onSent, onSuccess, onFailed) {
        assert.deepEqual(tx.to, augur.tx.BuyAndSellShares.buy.to);
        assert.deepEqual(tx.params, ["0x8ac7230489e80000", "0x6f05b59d3b20000", 'testBinaryMarketID', '1', "0x2386f26fc10000", 0]);
        assert.isFunction(onSent);
        assert.isFunction(onSuccess);
        assert.isFunction(onFailed);
      },
      shrinkScalarPrice: function(minValue, price) {
        assert.equal(price, 55);
        assert.equal(minValue, -10);
        if (minValue.constructor !== BigNumber) minValue = abi.bignum(minValue);
        if (price.constructor !== BigNumber) price = abi.bignum(price);
        return price.minus(minValue).toFixed();
      },
      amount: { amount: '10', price: '0.5', market: 'testBinaryMarketID', outcome: '1', scalarMinMax: null, onSent: noop, onSuccess: noop, onFailed: noop}
    });
    test({
      description: "Should handle a binary market buy using String inputs in a single object argument missing the function hooks",
      transact: function(tx, onSent, onSuccess, onFailed) {
        assert.deepEqual(tx.to, augur.tx.BuyAndSellShares.buy.to);
        assert.deepEqual(tx.params, ["0x8ac7230489e80000", "0x6f05b59d3b20000", 'testBinaryMarketID', '1', "0x2386f26fc10000", 0]);
        assert.isFunction(onSent);
        assert.isFunction(onSuccess);
        assert.isFunction(onFailed);
      },
      shrinkScalarPrice: function(minValue, price) {
        assert.equal(price, 55);
        assert.equal(minValue, -10);
        if (minValue.constructor !== BigNumber) minValue = abi.bignum(minValue);
        if (price.constructor !== BigNumber) price = abi.bignum(price);
        return price.minus(minValue).toFixed();
      },
      amount: { amount: '10', price: '0.5', market: 'testBinaryMarketID', outcome: '1', scalarMinMax: null }
    });

    test({
      description: "Should handle a scalar market buy using JS Number inputs",
      transact: function(tx, onSent, onSuccess, onFailed) {
        assert.deepEqual(tx.to, augur.tx.BuyAndSellShares.buy.to);
        assert.deepEqual(tx.params, ["0x8ac7230489e80000", "0x3860e639d80640000", 'testScalarMarketID', '1', "0x2386f26fc10000", 0]);
        assert.isFunction(onSent);
        assert.isFunction(onSuccess);
        assert.isFunction(onFailed);
      },
      shrinkScalarPrice: function(minValue, price) {
        assert.equal(price, 55);
        assert.equal(minValue, -10);
        if (minValue.constructor !== BigNumber) minValue = abi.bignum(minValue);
        if (price.constructor !== BigNumber) price = abi.bignum(price);
        return price.minus(minValue).toFixed();
      },
      amount: 10,
      price: 55,
      market: "testScalarMarketID",
      outcome: "1",
      scalarMinMax: { minValue: -10, maxValue: 140 },
      onSent: noop,
      onSuccess: noop,
      onFailed: noop
    });
    test({
      description: "Should handle a scalar market buy using String inputs",
      transact: function(tx, onSent, onSuccess, onFailed) {
        assert.deepEqual(tx.to, augur.tx.BuyAndSellShares.buy.to);
        assert.deepEqual(tx.params, ["0x8ac7230489e80000", "0x3860e639d80640000", 'testScalarMarketID', '1', "0x2386f26fc10000", 0]);
        assert.isFunction(onSent);
        assert.isFunction(onSuccess);
        assert.isFunction(onFailed);
      },
      shrinkScalarPrice: function(minValue, price) {
        assert.equal(price, 55);
        assert.equal(minValue, -10);
        if (minValue.constructor !== BigNumber) minValue = abi.bignum(minValue);
        if (price.constructor !== BigNumber) price = abi.bignum(price);
        return price.minus(minValue).toFixed();
      },
      amount: "10",
      price: "55",
      market: "testScalarMarketID",
      outcome: "1",
      scalarMinMax: { minValue: '-10', maxValue: '140' },
      onSent: noop,
      onSuccess: noop,
      onFailed: noop
    });
    test({
      description: "Should handle a scalar market buy using Big Number inputs",
      transact: function(tx, onSent, onSuccess, onFailed) {
        assert.deepEqual(tx.to, augur.tx.BuyAndSellShares.buy.to);
        assert.deepEqual(tx.params, ["0x8ac7230489e80000", "0x3860e639d80640000", 'testScalarMarketID', '1', "0x2386f26fc10000", 0]);
        assert.isFunction(onSent);
        assert.isFunction(onSuccess);
        assert.isFunction(onFailed);
      },
      shrinkScalarPrice: function(minValue, price) {
        assert.equal(price, 55);
        assert.equal(minValue, -10);
        if (minValue.constructor !== BigNumber) minValue = abi.bignum(minValue);
        if (price.constructor !== BigNumber) price = abi.bignum(price);
        return price.minus(minValue).toFixed();
      },
      amount: abi.bignum(10),
      price: abi.bignum(55),
      market: "testScalarMarketID",
      outcome: "1",
      scalarMinMax: { minValue: abi.bignum(-10), maxValue: abi.bignum(140) },
      onSent: noop,
      onSuccess: noop,
      onFailed: noop
    });
    test({
      description: "Should handle a scalar market buy using String inputs but missing function hooks",
      transact: function(tx, onSent, onSuccess, onFailed) {
        assert.deepEqual(tx.to, augur.tx.BuyAndSellShares.buy.to);
        assert.deepEqual(tx.params, ["0x8ac7230489e80000", "0x3860e639d80640000", 'testScalarMarketID', '1', "0x2386f26fc10000", 0]);
        assert.isFunction(onSent);
        assert.isFunction(onSuccess);
        assert.isFunction(onFailed);
      },
      shrinkScalarPrice: function(minValue, price) {
        assert.equal(price, 55);
        assert.equal(minValue, -10);
        if (minValue.constructor !== BigNumber) minValue = abi.bignum(minValue);
        if (price.constructor !== BigNumber) price = abi.bignum(price);
        return price.minus(minValue).toFixed();
      },
      amount: "10",
      price: "55",
      market: "testScalarMarketID",
      outcome: "1",
      scalarMinMax: { minValue: abi.bignum(-10), maxValue: abi.bignum(140) }
    });
    test({
      description: "Should handle a scalar market buy using String inputs in a single object argument",
      transact: function(tx, onSent, onSuccess, onFailed) {
        assert.deepEqual(tx.to, augur.tx.BuyAndSellShares.buy.to);
        assert.deepEqual(tx.params, ["0x8ac7230489e80000", "0x3860e639d80640000", 'testScalarMarketID', '1', "0x2386f26fc10000", 0]);
        assert.isFunction(onSent);
        assert.isFunction(onSuccess);
        assert.isFunction(onFailed);
      },
      shrinkScalarPrice: function(minValue, price) {
        assert.equal(price, 55);
        assert.equal(minValue, -10);
        if (minValue.constructor !== BigNumber) minValue = abi.bignum(minValue);
        if (price.constructor !== BigNumber) price = abi.bignum(price);
        return price.minus(minValue).toFixed();
      },
      amount: { amount: '10', price: '55', market: 'testScalarMarketID', outcome: '1', scalarMinMax: { minValue: abi.bignum(-10), maxValue: abi.bignum(140) }, onSent: noop, onSuccess: noop, onFailed: noop}
    });
    test({
      description: "Should handle a scalar market buy using String inputs in a single object argument missing the function hooks",
      transact: function(tx, onSent, onSuccess, onFailed) {
        assert.deepEqual(tx.to, augur.tx.BuyAndSellShares.buy.to);
        assert.deepEqual(tx.params, ["0x8ac7230489e80000", "0x3860e639d80640000", 'testScalarMarketID', '1', "0x2386f26fc10000", 0]);
        assert.isFunction(onSent);
        assert.isFunction(onSuccess);
        assert.isFunction(onFailed);
      },
      shrinkScalarPrice: function(minValue, price) {
        assert.equal(price, 55);
        assert.equal(minValue, -10);
        if (minValue.constructor !== BigNumber) minValue = abi.bignum(minValue);
        if (price.constructor !== BigNumber) price = abi.bignum(price);
        return price.minus(minValue).toFixed();
      },
      amount: { amount: '10', price: '55', market: 'testScalarMarketID', outcome: '1', scalarMinMax: { minValue: abi.bignum(-10), maxValue: abi.bignum(140) } }
    });

    test({
      description: "Should handle a categorical market buy using JS Number inputs",
      transact: function(tx, onSent, onSuccess, onFailed) {
        assert.deepEqual(tx.to, augur.tx.BuyAndSellShares.buy.to);
        assert.deepEqual(tx.params, ["0x8ac7230489e80000", "0x6f05b59d3b20000", 'testCategoricalMarketID', '1', "0x2386f26fc10000", 0]);
        assert.isFunction(onSent);
        assert.isFunction(onSuccess);
        assert.isFunction(onFailed);
      },
      shrinkScalarPrice: function(minValue, price) {
        assert.equal(price, 55);
        assert.equal(minValue, -10);
        if (minValue.constructor !== BigNumber) minValue = abi.bignum(minValue);
        if (price.constructor !== BigNumber) price = abi.bignum(price);
        return price.minus(minValue).toFixed();
      },
      amount: 10,
      price: 0.5,
      market: "testCategoricalMarketID",
      outcome: "1",
      scalarMinMax: null,
      onSent: noop,
      onSuccess: noop,
      onFailed: noop
    });
    test({
      description: "Should handle a categorical market buy using String inputs",
      transact: function(tx, onSent, onSuccess, onFailed) {
        assert.deepEqual(tx.to, augur.tx.BuyAndSellShares.buy.to);
        assert.deepEqual(tx.params, ["0x8ac7230489e80000", "0x6f05b59d3b20000", 'testCategoricalMarketID', '1', "0x2386f26fc10000", 0]);
        assert.isFunction(onSent);
        assert.isFunction(onSuccess);
        assert.isFunction(onFailed);
      },
      shrinkScalarPrice: function(minValue, price) {
        assert.equal(price, 55);
        assert.equal(minValue, -10);
        if (minValue.constructor !== BigNumber) minValue = abi.bignum(minValue);
        if (price.constructor !== BigNumber) price = abi.bignum(price);
        return price.minus(minValue).toFixed();
      },
      amount: "10",
      price: "0.5",
      market: "testCategoricalMarketID",
      outcome: "1",
      scalarMinMax: null,
      onSent: noop,
      onSuccess: noop,
      onFailed: noop
    });
    test({
      description: "Should handle a categorical market buy using Big Number inputs",
      transact: function(tx, onSent, onSuccess, onFailed) {
        assert.deepEqual(tx.to, augur.tx.BuyAndSellShares.buy.to);
        assert.deepEqual(tx.params, ["0x8ac7230489e80000", "0x6f05b59d3b20000", 'testCategoricalMarketID', '1', "0x2386f26fc10000", 0]);
        assert.isFunction(onSent);
        assert.isFunction(onSuccess);
        assert.isFunction(onFailed);
      },
      shrinkScalarPrice: function(minValue, price) {
        assert.equal(price, 55);
        assert.equal(minValue, -10);
        if (minValue.constructor !== BigNumber) minValue = abi.bignum(minValue);
        if (price.constructor !== BigNumber) price = abi.bignum(price);
        return price.minus(minValue).toFixed();
      },
      amount: abi.bignum(10),
      price: abi.bignum(0.5),
      market: "testCategoricalMarketID",
      outcome: "1",
      scalarMinMax: null,
      onSent: noop,
      onSuccess: noop,
      onFailed: noop
    });
    test({
      description: "Should handle a categorical market buy using String inputs but missing function hooks",
      transact: function(tx, onSent, onSuccess, onFailed) {
        assert.deepEqual(tx.to, augur.tx.BuyAndSellShares.buy.to);
        assert.deepEqual(tx.params, ["0x8ac7230489e80000", "0x6f05b59d3b20000", 'testCategoricalMarketID', '1', "0x2386f26fc10000", 0]);
        assert.isFunction(onSent);
        assert.isFunction(onSuccess);
        assert.isFunction(onFailed);
      },
      shrinkScalarPrice: function(minValue, price) {
        assert.equal(price, 55);
        assert.equal(minValue, -10);
        if (minValue.constructor !== BigNumber) minValue = abi.bignum(minValue);
        if (price.constructor !== BigNumber) price = abi.bignum(price);
        return price.minus(minValue).toFixed();
      },
      amount: "10",
      price: "0.5",
      market: "testCategoricalMarketID",
      outcome: "1",
      scalarMinMax: null
    });
    test({
      description: "Should handle a categorical market buy using String inputs in a single object argument",
      transact: function(tx, onSent, onSuccess, onFailed) {
        assert.deepEqual(tx.to, augur.tx.BuyAndSellShares.buy.to);
        assert.deepEqual(tx.params, ["0x8ac7230489e80000", "0x6f05b59d3b20000", 'testCategoricalMarketID', '1', "0x2386f26fc10000", 0]);
        assert.isFunction(onSent);
        assert.isFunction(onSuccess);
        assert.isFunction(onFailed);
      },
      shrinkScalarPrice: function(minValue, price) {
        assert.equal(price, 55);
        assert.equal(minValue, -10);
        if (minValue.constructor !== BigNumber) minValue = abi.bignum(minValue);
        if (price.constructor !== BigNumber) price = abi.bignum(price);
        return price.minus(minValue).toFixed();
      },
      amount: { amount: '10', price: '0.5', market: 'testCategoricalMarketID', outcome: '1', scalarMinMax: null, onSent: noop, onSuccess: noop, onFailed: noop}
    });
    test({
      description: "Should handle a categorical market buy using String inputs in a single object argument missing the function hooks",
      transact: function(tx, onSent, onSuccess, onFailed) {
        assert.deepEqual(tx.to, augur.tx.BuyAndSellShares.buy.to);
        assert.deepEqual(tx.params, ["0x8ac7230489e80000", "0x6f05b59d3b20000", 'testCategoricalMarketID', '1', "0x2386f26fc10000", 0]);
        assert.isFunction(onSent);
        assert.isFunction(onSuccess);
        assert.isFunction(onFailed);
      },
      shrinkScalarPrice: function(minValue, price) {
        assert.equal(price, 55);
        assert.equal(minValue, -10);
        if (minValue.constructor !== BigNumber) minValue = abi.bignum(minValue);
        if (price.constructor !== BigNumber) price = abi.bignum(price);
        return price.minus(minValue).toFixed();
      },
      amount: { amount: '10', price: '0.5', market: 'testCategoricalMarketID', outcome: '1', scalarMinMax: null }
    });
  });
  describe('augur.sell tests', function() {
		// 18 tests total
    var test = function (t) {
      it(t.description, function() {
        var transact = augur.transact;
        var shrinkScalarPrice = augur.shrinkScalarPrice;
        augur.transact = t.transact;
        augur.shrinkScalarPrice = t.shrinkScalarPrice;

        augur.sell(t.amount, t.price, t.market, t.outcome, t.tradeGroupID, t.scalarMinMax, t.onSent, t.onSuccess, t.onFailed);

        augur.transact = transact;
        augur.shrinkScalarPrice = shrinkScalarPrice;
      });
    };

    test({
      description: "Should handle a binary market sell using JS Number inputs",
      transact: function(tx, onSent, onSuccess, onFailed) {
        assert.deepEqual(tx.to, augur.tx.BuyAndSellShares.sell.to);
        assert.deepEqual(tx.params, ["0x8ac7230489e80000", "0x6f05b59d3b20000", 'testBinaryMarketID', '1', "0x2386f26fc10000", "0x0", 0]);
        assert.isFunction(onSent);
        assert.isFunction(onSuccess);
        assert.isFunction(onFailed);
      },
      shrinkScalarPrice: function(minValue, price) {
        assert.equal(price, 55);
        assert.equal(minValue, -10);
        if (minValue.constructor !== BigNumber) minValue = abi.bignum(minValue);
        if (price.constructor !== BigNumber) price = abi.bignum(price);
        return price.minus(minValue).toFixed();
      },
      amount: 10,
      price: 0.5,
      market: "testBinaryMarketID",
      outcome: "1",
      scalarMinMax: null,
      onSent: noop,
      onSuccess: noop,
      onFailed: noop
    });
    test({
      description: "Should handle a binary market sell using String inputs",
      transact: function(tx, onSent, onSuccess, onFailed) {
        assert.deepEqual(tx.to, augur.tx.BuyAndSellShares.sell.to);
        assert.deepEqual(tx.params, ["0x8ac7230489e80000", "0x6f05b59d3b20000", 'testBinaryMarketID', '1', "0x2386f26fc10000", "0x0", 0]);
        assert.isFunction(onSent);
        assert.isFunction(onSuccess);
        assert.isFunction(onFailed);
      },
      shrinkScalarPrice: function(minValue, price) {
        assert.equal(price, 55);
        assert.equal(minValue, -10);
        if (minValue.constructor !== BigNumber) minValue = abi.bignum(minValue);
        if (price.constructor !== BigNumber) price = abi.bignum(price);
        return price.minus(minValue).toFixed();
      },
      amount: "10",
      price: "0.5",
      market: "testBinaryMarketID",
      outcome: "1",
      scalarMinMax: null,
      onSent: noop,
      onSuccess: noop,
      onFailed: noop
    });
    test({
      description: "Should handle a binary market sell using Big Number inputs",
      transact: function(tx, onSent, onSuccess, onFailed) {
        assert.deepEqual(tx.to, augur.tx.BuyAndSellShares.sell.to);
        assert.deepEqual(tx.params, ["0x8ac7230489e80000", "0x6f05b59d3b20000", 'testBinaryMarketID', '1', "0x2386f26fc10000", "0x0", 0]);
        assert.isFunction(onSent);
        assert.isFunction(onSuccess);
        assert.isFunction(onFailed);
      },
      shrinkScalarPrice: function(minValue, price) {
        assert.equal(price, 55);
        assert.equal(minValue, -10);
        if (minValue.constructor !== BigNumber) minValue = abi.bignum(minValue);
        if (price.constructor !== BigNumber) price = abi.bignum(price);
        return price.minus(minValue).toFixed();
      },
      amount: abi.bignum(10),
      price: abi.bignum(0.5),
      market: "testBinaryMarketID",
      outcome: "1",
      scalarMinMax: null,
      onSent: noop,
      onSuccess: noop,
      onFailed: noop
    });
    test({
      description: "Should handle a binary market sell using String inputs but missing function hooks",
      transact: function(tx, onSent, onSuccess, onFailed) {
        assert.deepEqual(tx.to, augur.tx.BuyAndSellShares.sell.to);
        assert.deepEqual(tx.params, ["0x8ac7230489e80000", "0x6f05b59d3b20000", 'testBinaryMarketID', '1', "0x2386f26fc10000", "0x0", 0]);
        assert.isFunction(onSent);
        assert.isFunction(onSuccess);
        assert.isFunction(onFailed);
      },
      shrinkScalarPrice: function(minValue, price) {
        assert.equal(price, 55);
        assert.equal(minValue, -10);
        if (minValue.constructor !== BigNumber) minValue = abi.bignum(minValue);
        if (price.constructor !== BigNumber) price = abi.bignum(price);
        return price.minus(minValue).toFixed();
      },
      amount: "10",
      price: "0.5",
      market: "testBinaryMarketID",
      outcome: "1",
      scalarMinMax: null
    });
    test({
      description: "Should handle a binary market sell using String inputs in a single object argument",
      transact: function(tx, onSent, onSuccess, onFailed) {
        assert.deepEqual(tx.to, augur.tx.BuyAndSellShares.sell.to);
        assert.deepEqual(tx.params, ["0x8ac7230489e80000", "0x6f05b59d3b20000", 'testBinaryMarketID', '1', "0x2386f26fc10000", "0x0", 0]);
        assert.isFunction(onSent);
        assert.isFunction(onSuccess);
        assert.isFunction(onFailed);
      },
      shrinkScalarPrice: function(minValue, price) {
        assert.equal(price, 55);
        assert.equal(minValue, -10);
        if (minValue.constructor !== BigNumber) minValue = abi.bignum(minValue);
        if (price.constructor !== BigNumber) price = abi.bignum(price);
        return price.minus(minValue).toFixed();
      },
      amount: { amount: '10', price: '0.5', market: 'testBinaryMarketID', outcome: '1', scalarMinMax: null, onSent: noop, onSuccess: noop, onFailed: noop}
    });
    test({
      description: "Should handle a binary market sell using String inputs in a single object argument missing the function hooks",
      transact: function(tx, onSent, onSuccess, onFailed) {
        assert.deepEqual(tx.to, augur.tx.BuyAndSellShares.sell.to);
        assert.deepEqual(tx.params, ["0x8ac7230489e80000", "0x6f05b59d3b20000", 'testBinaryMarketID', '1', "0x2386f26fc10000", "0x0", 0]);
        assert.isFunction(onSent);
        assert.isFunction(onSuccess);
        assert.isFunction(onFailed);
      },
      shrinkScalarPrice: function(minValue, price) {
        assert.equal(price, 55);
        assert.equal(minValue, -10);
        if (minValue.constructor !== BigNumber) minValue = abi.bignum(minValue);
        if (price.constructor !== BigNumber) price = abi.bignum(price);
        return price.minus(minValue).toFixed();
      },
      amount: { amount: '10', price: '0.5', market: 'testBinaryMarketID', outcome: '1', scalarMinMax: null }
    });


    test({
      description: "Should handle a scalar market sell using JS Number inputs",
      transact: function(tx, onSent, onSuccess, onFailed) {
        assert.deepEqual(tx.to, augur.tx.BuyAndSellShares.sell.to);
        assert.deepEqual(tx.params, ["0x8ac7230489e80000", "0x3860e639d80640000", 'testScalarMarketID', '1', "0x2386f26fc10000", "0x0", 0]);
        assert.isFunction(onSent);
        assert.isFunction(onSuccess);
        assert.isFunction(onFailed);
      },
      shrinkScalarPrice: function(minValue, price) {
        assert.equal(price, 55);
        assert.equal(minValue, -10);
        if (minValue.constructor !== BigNumber) minValue = abi.bignum(minValue);
        if (price.constructor !== BigNumber) price = abi.bignum(price);
        return price.minus(minValue).toFixed();
      },
      amount: 10,
      price: 55,
      market: "testScalarMarketID",
      outcome: "1",
      scalarMinMax: { minValue: -10, maxValue: 140 },
      onSent: noop,
      onSuccess: noop,
      onFailed: noop
    });
    test({
      description: "Should handle a scalar market sell using String inputs",
      transact: function(tx, onSent, onSuccess, onFailed) {
        assert.deepEqual(tx.to, augur.tx.BuyAndSellShares.sell.to);
        assert.deepEqual(tx.params, ["0x8ac7230489e80000", "0x3860e639d80640000", 'testScalarMarketID', '1', "0x2386f26fc10000", "0x0", 0]);
        assert.isFunction(onSent);
        assert.isFunction(onSuccess);
        assert.isFunction(onFailed);
      },
      shrinkScalarPrice: function(minValue, price) {
        assert.equal(price, 55);
        assert.equal(minValue, -10);
        if (minValue.constructor !== BigNumber) minValue = abi.bignum(minValue);
        if (price.constructor !== BigNumber) price = abi.bignum(price);
        return price.minus(minValue).toFixed();
      },
      amount: "10",
      price: "55",
      market: "testScalarMarketID",
      outcome: "1",
      scalarMinMax: { minValue: '-10', maxValue: '140' },
      onSent: noop,
      onSuccess: noop,
      onFailed: noop
    });
    test({
      description: "Should handle a scalar market sell using Big Number inputs",
      transact: function(tx, onSent, onSuccess, onFailed) {
        assert.deepEqual(tx.to, augur.tx.BuyAndSellShares.sell.to);
        assert.deepEqual(tx.params, ["0x8ac7230489e80000", "0x3860e639d80640000", 'testScalarMarketID', '1', "0x2386f26fc10000", "0x0", 0]);
        assert.isFunction(onSent);
        assert.isFunction(onSuccess);
        assert.isFunction(onFailed);
      },
      shrinkScalarPrice: function(minValue, price) {
        assert.equal(price, 55);
        assert.equal(minValue, -10);
        if (minValue.constructor !== BigNumber) minValue = abi.bignum(minValue);
        if (price.constructor !== BigNumber) price = abi.bignum(price);
        return price.minus(minValue).toFixed();
      },
      amount: abi.bignum(10),
      price: abi.bignum(55),
      market: "testScalarMarketID",
      outcome: "1",
      scalarMinMax: { minValue: abi.bignum(-10), maxValue: abi.bignum(140) },
      onSent: noop,
      onSuccess: noop,
      onFailed: noop
    });
    test({
      description: "Should handle a scalar market sell using String inputs but missing function hooks",
      transact: function(tx, onSent, onSuccess, onFailed) {
        assert.deepEqual(tx.to, augur.tx.BuyAndSellShares.sell.to);
        assert.deepEqual(tx.params, ["0x8ac7230489e80000", "0x3860e639d80640000", 'testScalarMarketID', '1', "0x2386f26fc10000", "0x0", 0]);
        assert.isFunction(onSent);
        assert.isFunction(onSuccess);
        assert.isFunction(onFailed);
      },
      shrinkScalarPrice: function(minValue, price) {
        assert.equal(price, 55);
        assert.equal(minValue, -10);
        if (minValue.constructor !== BigNumber) minValue = abi.bignum(minValue);
        if (price.constructor !== BigNumber) price = abi.bignum(price);
        return price.minus(minValue).toFixed();
      },
      amount: "10",
      price: "55",
      market: "testScalarMarketID",
      outcome: "1",
      scalarMinMax: { minValue: abi.bignum(-10), maxValue: abi.bignum(140) }
    });
    test({
      description: "Should handle a scalar market sell using String inputs in a single object argument",
      transact: function(tx, onSent, onSuccess, onFailed) {
        assert.deepEqual(tx.to, augur.tx.BuyAndSellShares.sell.to);
        assert.deepEqual(tx.params, ["0x8ac7230489e80000", "0x3860e639d80640000", 'testScalarMarketID', '1', "0x2386f26fc10000", "0x0", 0]);
        assert.isFunction(onSent);
        assert.isFunction(onSuccess);
        assert.isFunction(onFailed);
      },
      shrinkScalarPrice: function(minValue, price) {
        assert.equal(price, 55);
        assert.equal(minValue, -10);
        if (minValue.constructor !== BigNumber) minValue = abi.bignum(minValue);
        if (price.constructor !== BigNumber) price = abi.bignum(price);
        return price.minus(minValue).toFixed();
      },
      amount: { amount: '10', price: '55', market: 'testScalarMarketID', outcome: '1', scalarMinMax: { minValue: abi.bignum(-10), maxValue: abi.bignum(140) }, onSent: noop, onSuccess: noop, onFailed: noop}
    });
    test({
      description: "Should handle a scalar market sell using String inputs in a single object argument missing the function hooks",
      transact: function(tx, onSent, onSuccess, onFailed) {
        assert.deepEqual(tx.to, augur.tx.BuyAndSellShares.sell.to);
        assert.deepEqual(tx.params, ["0x8ac7230489e80000", "0x3860e639d80640000", 'testScalarMarketID', '1', "0x2386f26fc10000", "0x0", 0]);
        assert.isFunction(onSent);
        assert.isFunction(onSuccess);
        assert.isFunction(onFailed);
      },
      shrinkScalarPrice: function(minValue, price) {
        assert.equal(price, 55);
        assert.equal(minValue, -10);
        if (minValue.constructor !== BigNumber) minValue = abi.bignum(minValue);
        if (price.constructor !== BigNumber) price = abi.bignum(price);
        return price.minus(minValue).toFixed();
      },
      amount: { amount: '10', price: '55', market: 'testScalarMarketID', outcome: '1', scalarMinMax: { minValue: abi.bignum(-10), maxValue: abi.bignum(140) } }
    });

    test({
      description: "Should handle a categorical market sell using JS Number inputs",
      transact: function(tx, onSent, onSuccess, onFailed) {
        assert.deepEqual(tx.to, augur.tx.BuyAndSellShares.sell.to);
        assert.deepEqual(tx.params, ["0x8ac7230489e80000", "0x6f05b59d3b20000", 'testCategoricalMarketID', '1', "0x2386f26fc10000", "0x0", 0]);
        assert.isFunction(onSent);
        assert.isFunction(onSuccess);
        assert.isFunction(onFailed);
      },
      shrinkScalarPrice: function(minValue, price) {
        assert.equal(price, 55);
        assert.equal(minValue, -10);
        if (minValue.constructor !== BigNumber) minValue = abi.bignum(minValue);
        if (price.constructor !== BigNumber) price = abi.bignum(price);
        return price.minus(minValue).toFixed();
      },
      amount: 10,
      price: 0.5,
      market: "testCategoricalMarketID",
      outcome: "1",
      scalarMinMax: null,
      onSent: noop,
      onSuccess: noop,
      onFailed: noop
    });
    test({
      description: "Should handle a categorical market sell using String inputs",
      transact: function(tx, onSent, onSuccess, onFailed) {
        assert.deepEqual(tx.to, augur.tx.BuyAndSellShares.sell.to);
        assert.deepEqual(tx.params, ["0x8ac7230489e80000", "0x6f05b59d3b20000", 'testCategoricalMarketID', '1', "0x2386f26fc10000", "0x0", 0]);
        assert.isFunction(onSent);
        assert.isFunction(onSuccess);
        assert.isFunction(onFailed);
      },
      shrinkScalarPrice: function(minValue, price) {
        assert.equal(price, 55);
        assert.equal(minValue, -10);
        if (minValue.constructor !== BigNumber) minValue = abi.bignum(minValue);
        if (price.constructor !== BigNumber) price = abi.bignum(price);
        return price.minus(minValue).toFixed();
      },
      amount: "10",
      price: "0.5",
      market: "testCategoricalMarketID",
      outcome: "1",
      scalarMinMax: null,
      onSent: noop,
      onSuccess: noop,
      onFailed: noop
    });
    test({
      description: "Should handle a categorical market sell using Big Number inputs",
      transact: function(tx, onSent, onSuccess, onFailed) {
        assert.deepEqual(tx.to, augur.tx.BuyAndSellShares.sell.to);
        assert.deepEqual(tx.params, ["0x8ac7230489e80000", "0x6f05b59d3b20000", 'testCategoricalMarketID', '1', "0x2386f26fc10000", "0x0", 0]);
        assert.isFunction(onSent);
        assert.isFunction(onSuccess);
        assert.isFunction(onFailed);
      },
      shrinkScalarPrice: function(minValue, price) {
        assert.equal(price, 55);
        assert.equal(minValue, -10);
        if (minValue.constructor !== BigNumber) minValue = abi.bignum(minValue);
        if (price.constructor !== BigNumber) price = abi.bignum(price);
        return price.minus(minValue).toFixed();
      },
      amount: abi.bignum(10),
      price: abi.bignum(0.5),
      market: "testCategoricalMarketID",
      outcome: "1",
      scalarMinMax: null,
      onSent: noop,
      onSuccess: noop,
      onFailed: noop
    });
    test({
      description: "Should handle a categorical market sell using String inputs but missing function hooks",
      transact: function(tx, onSent, onSuccess, onFailed) {
        assert.deepEqual(tx.to, augur.tx.BuyAndSellShares.sell.to);
        assert.deepEqual(tx.params, ["0x8ac7230489e80000", "0x6f05b59d3b20000", 'testCategoricalMarketID', '1', "0x2386f26fc10000", "0x0", 0]);
        assert.isFunction(onSent);
        assert.isFunction(onSuccess);
        assert.isFunction(onFailed);
      },
      shrinkScalarPrice: function(minValue, price) {
        assert.equal(price, 55);
        assert.equal(minValue, -10);
        if (minValue.constructor !== BigNumber) minValue = abi.bignum(minValue);
        if (price.constructor !== BigNumber) price = abi.bignum(price);
        return price.minus(minValue).toFixed();
      },
      amount: "10",
      price: "0.5",
      market: "testCategoricalMarketID",
      outcome: "1",
      scalarMinMax: null
    });
    test({
      description: "Should handle a categorical market sell using String inputs in a single object argument",
      transact: function(tx, onSent, onSuccess, onFailed) {
        assert.deepEqual(tx.to, augur.tx.BuyAndSellShares.sell.to);
        assert.deepEqual(tx.params, ["0x8ac7230489e80000", "0x6f05b59d3b20000", 'testCategoricalMarketID', '1', "0x2386f26fc10000", "0x0", 0]);
        assert.isFunction(onSent);
        assert.isFunction(onSuccess);
        assert.isFunction(onFailed);
      },
      shrinkScalarPrice: function(minValue, price) {
        assert.equal(price, 55);
        assert.equal(minValue, -10);
        if (minValue.constructor !== BigNumber) minValue = abi.bignum(minValue);
        if (price.constructor !== BigNumber) price = abi.bignum(price);
        return price.minus(minValue).toFixed();
      },
      amount: { amount: '10', price: '0.5', market: 'testCategoricalMarketID', outcome: '1', scalarMinMax: null, onSent: noop, onSuccess: noop, onFailed: noop}
    });
    test({
      description: "Should handle a categorical market sell using String inputs in a single object argument missing the function hooks",
      transact: function(tx, onSent, onSuccess, onFailed) {
        assert.deepEqual(tx.to, augur.tx.BuyAndSellShares.sell.to);
        assert.deepEqual(tx.params, ["0x8ac7230489e80000", "0x6f05b59d3b20000", 'testCategoricalMarketID', '1', "0x2386f26fc10000", "0x0", 0]);
        assert.isFunction(onSent);
        assert.isFunction(onSuccess);
        assert.isFunction(onFailed);
      },
      shrinkScalarPrice: function(minValue, price) {
        assert.equal(price, 55);
        assert.equal(minValue, -10);
        if (minValue.constructor !== BigNumber) minValue = abi.bignum(minValue);
        if (price.constructor !== BigNumber) price = abi.bignum(price);
        return price.minus(minValue).toFixed();
      },
      amount: { amount: '10', price: '0.5', market: 'testCategoricalMarketID', outcome: '1', scalarMinMax: null }
    });
  });
  describe('augur.shortAsk tests', function() {
		// 18 tests total
    var test = function (t) {
      it(t.description, function() {
        var transact = augur.transact;
        var shrinkScalarPrice = augur.shrinkScalarPrice;
        augur.transact = t.transact;
        augur.shrinkScalarPrice = t.shrinkScalarPrice;

        augur.shortAsk(t.amount, t.price, t.market, t.outcome, t.tradeGroupID, t.scalarMinMax, t.onSent, t.onSuccess, t.onFailed);

        augur.transact = transact;
        augur.shrinkScalarPrice = shrinkScalarPrice;
      });
    };

    test({
      description: "Should handle a binary market shortAsk using JS Number inputs",
      transact: function(tx, onSent, onSuccess, onFailed) {
        assert.deepEqual(tx.to, augur.tx.BuyAndSellShares.shortAsk.to);
        assert.deepEqual(tx.params, ["0x8ac7230489e80000", "0x6f05b59d3b20000", 'testBinaryMarketID', '1', "0x2386f26fc10000", 0]);
        assert.isFunction(onSent);
        assert.isFunction(onSuccess);
        assert.isFunction(onFailed);
      },
      shrinkScalarPrice: function(minValue, price) {
        assert.equal(price, 55);
        assert.equal(minValue, -10);
        if (minValue.constructor !== BigNumber) minValue = abi.bignum(minValue);
        if (price.constructor !== BigNumber) price = abi.bignum(price);
        return price.minus(minValue).toFixed();
      },
      amount: 10,
      price: 0.5,
      market: "testBinaryMarketID",
      outcome: "1",
      scalarMinMax: null,
      onSent: noop,
      onSuccess: noop,
      onFailed: noop
    });
    test({
      description: "Should handle a binary market shortAsk using String inputs",
      transact: function(tx, onSent, onSuccess, onFailed) {
        assert.deepEqual(tx.to, augur.tx.BuyAndSellShares.shortAsk.to);
        assert.deepEqual(tx.params, ["0x8ac7230489e80000", "0x6f05b59d3b20000", 'testBinaryMarketID', '1', "0x2386f26fc10000", 0]);
        assert.isFunction(onSent);
        assert.isFunction(onSuccess);
        assert.isFunction(onFailed);
      },
      shrinkScalarPrice: function(minValue, price) {
        assert.equal(price, 55);
        assert.equal(minValue, -10);
        if (minValue.constructor !== BigNumber) minValue = abi.bignum(minValue);
        if (price.constructor !== BigNumber) price = abi.bignum(price);
        return price.minus(minValue).toFixed();
      },
      amount: "10",
      price: "0.5",
      market: "testBinaryMarketID",
      outcome: "1",
      scalarMinMax: null,
      onSent: noop,
      onSuccess: noop,
      onFailed: noop
    });
    test({
      description: "Should handle a binary market shortAsk using Big Number inputs",
      transact: function(tx, onSent, onSuccess, onFailed) {
        assert.deepEqual(tx.to, augur.tx.BuyAndSellShares.shortAsk.to);
        assert.deepEqual(tx.params, ["0x8ac7230489e80000", "0x6f05b59d3b20000", 'testBinaryMarketID', '1', "0x2386f26fc10000", 0]);
        assert.isFunction(onSent);
        assert.isFunction(onSuccess);
        assert.isFunction(onFailed);
      },
      shrinkScalarPrice: function(minValue, price) {
        assert.equal(price, 55);
        assert.equal(minValue, -10);
        if (minValue.constructor !== BigNumber) minValue = abi.bignum(minValue);
        if (price.constructor !== BigNumber) price = abi.bignum(price);
        return price.minus(minValue).toFixed();
      },
      amount: abi.bignum(10),
      price: abi.bignum(0.5),
      market: "testBinaryMarketID",
      outcome: "1",
      scalarMinMax: null,
      onSent: noop,
      onSuccess: noop,
      onFailed: noop
    });
    test({
      description: "Should handle a binary market shortAsk using String inputs but missing function hooks",
      transact: function(tx, onSent, onSuccess, onFailed) {
        assert.deepEqual(tx.to, augur.tx.BuyAndSellShares.shortAsk.to);
        assert.deepEqual(tx.params, ["0x8ac7230489e80000", "0x6f05b59d3b20000", 'testBinaryMarketID', '1', "0x2386f26fc10000", 0]);
        assert.isFunction(onSent);
        assert.isFunction(onSuccess);
        assert.isFunction(onFailed);
      },
      shrinkScalarPrice: function(minValue, price) {
        assert.equal(price, 55);
        assert.equal(minValue, -10);
        if (minValue.constructor !== BigNumber) minValue = abi.bignum(minValue);
        if (price.constructor !== BigNumber) price = abi.bignum(price);
        return price.minus(minValue).toFixed();
      },
      amount: "10",
      price: "0.5",
      market: "testBinaryMarketID",
      outcome: "1",
      scalarMinMax: null
    });
    test({
      description: "Should handle a binary market shortAsk using String inputs in a single object argument",
      transact: function(tx, onSent, onSuccess, onFailed) {
        assert.deepEqual(tx.to, augur.tx.BuyAndSellShares.shortAsk.to);
        assert.deepEqual(tx.params, ["0x8ac7230489e80000", "0x6f05b59d3b20000", 'testBinaryMarketID', '1', "0x2386f26fc10000", 0]);
        assert.isFunction(onSent);
        assert.isFunction(onSuccess);
        assert.isFunction(onFailed);
      },
      shrinkScalarPrice: function(minValue, price) {
        assert.equal(price, 55);
        assert.equal(minValue, -10);
        if (minValue.constructor !== BigNumber) minValue = abi.bignum(minValue);
        if (price.constructor !== BigNumber) price = abi.bignum(price);
        return price.minus(minValue).toFixed();
      },
      amount: { amount: '10', price: '0.5', market: 'testBinaryMarketID', outcome: '1', scalarMinMax: null, onSent: noop, onSuccess: noop, onFailed: noop}
    });
    test({
      description: "Should handle a binary market shortAsk using String inputs in a single object argument missing the function hooks",
      transact: function(tx, onSent, onSuccess, onFailed) {
        assert.deepEqual(tx.to, augur.tx.BuyAndSellShares.shortAsk.to);
        assert.deepEqual(tx.params, ["0x8ac7230489e80000", "0x6f05b59d3b20000", 'testBinaryMarketID', '1', "0x2386f26fc10000", 0]);
        assert.isFunction(onSent);
        assert.isFunction(onSuccess);
        assert.isFunction(onFailed);
      },
      shrinkScalarPrice: function(minValue, price) {
        assert.equal(price, 55);
        assert.equal(minValue, -10);
        if (minValue.constructor !== BigNumber) minValue = abi.bignum(minValue);
        if (price.constructor !== BigNumber) price = abi.bignum(price);
        return price.minus(minValue).toFixed();
      },
      amount: { amount: '10', price: '0.5', market: 'testBinaryMarketID', outcome: '1', scalarMinMax: null }
    });

    test({
      description: "Should handle a scalar market shortAsk using JS Number inputs",
      transact: function(tx, onSent, onSuccess, onFailed) {
        assert.deepEqual(tx.to, augur.tx.BuyAndSellShares.shortAsk.to);
        assert.deepEqual(tx.params, ["0x8ac7230489e80000", "0x3860e639d80640000", 'testScalarMarketID', '1', "0x2386f26fc10000", 0]);
        assert.isFunction(onSent);
        assert.isFunction(onSuccess);
        assert.isFunction(onFailed);
      },
      shrinkScalarPrice: function(minValue, price) {
        assert.equal(price, 55);
        assert.equal(minValue, -10);
        if (minValue.constructor !== BigNumber) minValue = abi.bignum(minValue);
        if (price.constructor !== BigNumber) price = abi.bignum(price);
        return price.minus(minValue).toFixed();
      },
      amount: 10,
      price: 55,
      market: "testScalarMarketID",
      outcome: "1",
      scalarMinMax: { minValue: -10, maxValue: 140 },
      onSent: noop,
      onSuccess: noop,
      onFailed: noop
    });
    test({
      description: "Should handle a scalar market shortAsk using String inputs",
      transact: function(tx, onSent, onSuccess, onFailed) {
        assert.deepEqual(tx.to, augur.tx.BuyAndSellShares.shortAsk.to);
        assert.deepEqual(tx.params, ["0x8ac7230489e80000", "0x3860e639d80640000", 'testScalarMarketID', '1', "0x2386f26fc10000", 0]);
        assert.isFunction(onSent);
        assert.isFunction(onSuccess);
        assert.isFunction(onFailed);
      },
      shrinkScalarPrice: function(minValue, price) {
        assert.equal(price, 55);
        assert.equal(minValue, -10);
        if (minValue.constructor !== BigNumber) minValue = abi.bignum(minValue);
        if (price.constructor !== BigNumber) price = abi.bignum(price);
        return price.minus(minValue).toFixed();
      },
      amount: "10",
      price: "55",
      market: "testScalarMarketID",
      outcome: "1",
      scalarMinMax: { minValue: '-10', maxValue: '140' },
      onSent: noop,
      onSuccess: noop,
      onFailed: noop
    });
    test({
      description: "Should handle a scalar market shortAsk using Big Number inputs",
      transact: function(tx, onSent, onSuccess, onFailed) {
        assert.deepEqual(tx.to, augur.tx.BuyAndSellShares.shortAsk.to);
        assert.deepEqual(tx.params, ["0x8ac7230489e80000", "0x3860e639d80640000", 'testScalarMarketID', '1', "0x2386f26fc10000", 0]);
        assert.isFunction(onSent);
        assert.isFunction(onSuccess);
        assert.isFunction(onFailed);
      },
      shrinkScalarPrice: function(minValue, price) {
        assert.equal(price, 55);
        assert.equal(minValue, -10);
        if (minValue.constructor !== BigNumber) minValue = abi.bignum(minValue);
        if (price.constructor !== BigNumber) price = abi.bignum(price);
        return price.minus(minValue).toFixed();
      },
      amount: abi.bignum(10),
      price: abi.bignum(55),
      market: "testScalarMarketID",
      outcome: "1",
      scalarMinMax: { minValue: abi.bignum(-10), maxValue: abi.bignum(140) },
      onSent: noop,
      onSuccess: noop,
      onFailed: noop
    });
    test({
      description: "Should handle a scalar market shortAsk using String inputs but missing function hooks",
      transact: function(tx, onSent, onSuccess, onFailed) {
        assert.deepEqual(tx.to, augur.tx.BuyAndSellShares.shortAsk.to);
        assert.deepEqual(tx.params, ["0x8ac7230489e80000", "0x3860e639d80640000", 'testScalarMarketID', '1', "0x2386f26fc10000", 0]);
        assert.isFunction(onSent);
        assert.isFunction(onSuccess);
        assert.isFunction(onFailed);
      },
      shrinkScalarPrice: function(minValue, price) {
        assert.equal(price, 55);
        assert.equal(minValue, -10);
        if (minValue.constructor !== BigNumber) minValue = abi.bignum(minValue);
        if (price.constructor !== BigNumber) price = abi.bignum(price);
        return price.minus(minValue).toFixed();
      },
      amount: "10",
      price: "55",
      market: "testScalarMarketID",
      outcome: "1",
      scalarMinMax: { minValue: abi.bignum(-10), maxValue: abi.bignum(140) }
    });
    test({
      description: "Should handle a scalar market shortAsk using String inputs in a single object argument",
      transact: function(tx, onSent, onSuccess, onFailed) {
        assert.deepEqual(tx.to, augur.tx.BuyAndSellShares.shortAsk.to);
        assert.deepEqual(tx.params, ["0x8ac7230489e80000", "0x3860e639d80640000", 'testScalarMarketID', '1', "0x2386f26fc10000", 0]);
        assert.isFunction(onSent);
        assert.isFunction(onSuccess);
        assert.isFunction(onFailed);
      },
      shrinkScalarPrice: function(minValue, price) {
        assert.equal(price, 55);
        assert.equal(minValue, -10);
        if (minValue.constructor !== BigNumber) minValue = abi.bignum(minValue);
        if (price.constructor !== BigNumber) price = abi.bignum(price);
        return price.minus(minValue).toFixed();
      },
      amount: { amount: '10', price: '55', market: 'testScalarMarketID', outcome: '1', scalarMinMax: { minValue: abi.bignum(-10), maxValue: abi.bignum(140) }, onSent: noop, onSuccess: noop, onFailed: noop}
    });
    test({
      description: "Should handle a scalar market shortAsk using String inputs in a single object argument missing the function hooks",
      transact: function(tx, onSent, onSuccess, onFailed) {
        assert.deepEqual(tx.to, augur.tx.BuyAndSellShares.shortAsk.to);
        assert.deepEqual(tx.params, ["0x8ac7230489e80000", "0x3860e639d80640000", 'testScalarMarketID', '1', "0x2386f26fc10000", 0]);
        assert.isFunction(onSent);
        assert.isFunction(onSuccess);
        assert.isFunction(onFailed);
      },
      shrinkScalarPrice: function(minValue, price) {
        assert.equal(price, 55);
        assert.equal(minValue, -10);
        if (minValue.constructor !== BigNumber) minValue = abi.bignum(minValue);
        if (price.constructor !== BigNumber) price = abi.bignum(price);
        return price.minus(minValue).toFixed();
      },
      amount: { amount: '10', price: '55', market: 'testScalarMarketID', outcome: '1', scalarMinMax: { minValue: abi.bignum(-10), maxValue: abi.bignum(140) } }
    });

    test({
      description: "Should handle a categorical market shortAsk using JS Number inputs",
      transact: function(tx, onSent, onSuccess, onFailed) {
        assert.deepEqual(tx.to, augur.tx.BuyAndSellShares.shortAsk.to);
        assert.deepEqual(tx.params, ["0x8ac7230489e80000", "0x6f05b59d3b20000", 'testCategoricalMarketID', '1', "0x2386f26fc10000", 0]);
        assert.isFunction(onSent);
        assert.isFunction(onSuccess);
        assert.isFunction(onFailed);
      },
      shrinkScalarPrice: function(minValue, price) {
        assert.equal(price, 55);
        assert.equal(minValue, -10);
        if (minValue.constructor !== BigNumber) minValue = abi.bignum(minValue);
        if (price.constructor !== BigNumber) price = abi.bignum(price);
        return price.minus(minValue).toFixed();
      },
      amount: 10,
      price: 0.5,
      market: "testCategoricalMarketID",
      outcome: "1",
      scalarMinMax: null,
      onSent: noop,
      onSuccess: noop,
      onFailed: noop
    });
    test({
      description: "Should handle a categorical market shortAsk using String inputs",
      transact: function(tx, onSent, onSuccess, onFailed) {
        assert.deepEqual(tx.to, augur.tx.BuyAndSellShares.shortAsk.to);
        assert.deepEqual(tx.params, ["0x8ac7230489e80000", "0x6f05b59d3b20000", 'testCategoricalMarketID', '1', "0x2386f26fc10000", 0]);
        assert.isFunction(onSent);
        assert.isFunction(onSuccess);
        assert.isFunction(onFailed);
      },
      shrinkScalarPrice: function(minValue, price) {
        assert.equal(price, 55);
        assert.equal(minValue, -10);
        if (minValue.constructor !== BigNumber) minValue = abi.bignum(minValue);
        if (price.constructor !== BigNumber) price = abi.bignum(price);
        return price.minus(minValue).toFixed();
      },
      amount: "10",
      price: "0.5",
      market: "testCategoricalMarketID",
      outcome: "1",
      scalarMinMax: null,
      onSent: noop,
      onSuccess: noop,
      onFailed: noop
    });
    test({
      description: "Should handle a categorical market shortAsk using Big Number inputs",
      transact: function(tx, onSent, onSuccess, onFailed) {
        assert.deepEqual(tx.to, augur.tx.BuyAndSellShares.shortAsk.to);
        assert.deepEqual(tx.params, ["0x8ac7230489e80000", "0x6f05b59d3b20000", 'testCategoricalMarketID', '1', "0x2386f26fc10000", 0]);
        assert.isFunction(onSent);
        assert.isFunction(onSuccess);
        assert.isFunction(onFailed);
      },
      shrinkScalarPrice: function(minValue, price) {
        assert.equal(price, 55);
        assert.equal(minValue, -10);
        if (minValue.constructor !== BigNumber) minValue = abi.bignum(minValue);
        if (price.constructor !== BigNumber) price = abi.bignum(price);
        return price.minus(minValue).toFixed();
      },
      amount: abi.bignum(10),
      price: abi.bignum(0.5),
      market: "testCategoricalMarketID",
      outcome: "1",
      scalarMinMax: null,
      onSent: noop,
      onSuccess: noop,
      onFailed: noop
    });
    test({
      description: "Should handle a categorical market shortAsk using String inputs but missing function hooks",
      transact: function(tx, onSent, onSuccess, onFailed) {
        assert.deepEqual(tx.to, augur.tx.BuyAndSellShares.shortAsk.to);
        assert.deepEqual(tx.params, ["0x8ac7230489e80000", "0x6f05b59d3b20000", 'testCategoricalMarketID', '1', "0x2386f26fc10000", 0]);
        assert.isFunction(onSent);
        assert.isFunction(onSuccess);
        assert.isFunction(onFailed);
      },
      shrinkScalarPrice: function(minValue, price) {
        assert.equal(price, 55);
        assert.equal(minValue, -10);
        if (minValue.constructor !== BigNumber) minValue = abi.bignum(minValue);
        if (price.constructor !== BigNumber) price = abi.bignum(price);
        return price.minus(minValue).toFixed();
      },
      amount: "10",
      price: "0.5",
      market: "testCategoricalMarketID",
      outcome: "1",
      scalarMinMax: null
    });
    test({
      description: "Should handle a categorical market shortAsk using String inputs in a single object argument",
      transact: function(tx, onSent, onSuccess, onFailed) {
        assert.deepEqual(tx.to, augur.tx.BuyAndSellShares.shortAsk.to);
        assert.deepEqual(tx.params, ["0x8ac7230489e80000", "0x6f05b59d3b20000", 'testCategoricalMarketID', '1', "0x2386f26fc10000", 0]);
        assert.isFunction(onSent);
        assert.isFunction(onSuccess);
        assert.isFunction(onFailed);
      },
      shrinkScalarPrice: function(minValue, price) {
        assert.equal(price, 55);
        assert.equal(minValue, -10);
        if (minValue.constructor !== BigNumber) minValue = abi.bignum(minValue);
        if (price.constructor !== BigNumber) price = abi.bignum(price);
        return price.minus(minValue).toFixed();
      },
      amount: { amount: '10', price: '0.5', market: 'testCategoricalMarketID', outcome: '1', scalarMinMax: null, onSent: noop, onSuccess: noop, onFailed: noop}
    });
    test({
      description: "Should handle a categorical market shortAsk using String inputs in a single object argument missing the function hooks",
      transact: function(tx, onSent, onSuccess, onFailed) {
        assert.deepEqual(tx.to, augur.tx.BuyAndSellShares.shortAsk.to);
        assert.deepEqual(tx.params, ["0x8ac7230489e80000", "0x6f05b59d3b20000", 'testCategoricalMarketID', '1', "0x2386f26fc10000", 0]);
        assert.isFunction(onSent);
        assert.isFunction(onSuccess);
        assert.isFunction(onFailed);
      },
      shrinkScalarPrice: function(minValue, price) {
        assert.equal(price, 55);
        assert.equal(minValue, -10);
        if (minValue.constructor !== BigNumber) minValue = abi.bignum(minValue);
        if (price.constructor !== BigNumber) price = abi.bignum(price);
        return price.minus(minValue).toFixed();
      },
      amount: { amount: '10', price: '0.5', market: 'testCategoricalMarketID', outcome: '1', scalarMinMax: null }
    });
  });
});
