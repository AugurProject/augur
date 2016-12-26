"use strict";

var assert = require("chai").assert;
var augur = require("../../../src");
var abi = require("augur-abi");
var BigNumber = require("bignumber.js");

// 58 tests total
describe("buyAndSellShares Unit Tests", function() {
	// define noop to use as dummy functions for onSent, onSuccess, onFailed...
	function noop() {};
	var transactCallCount = 0;
	var transact = augur.transact;
	var currentMethod = '';
	var shrinkScalarPrice = augur.shrinkScalarPrice;
	function sharedTransactMock(tx, onSent, onSuccess, onFailed) {
		// inc the call count...
		transactCallCount++;
		assert.isObject(tx, "tx sent to this.transact is not a Object");
		assert.isNumber(tx.gas, "tx.gas sent to this.transact isn't a number as expected");
		assert.isArray(tx.inputs, "tx.inputs sent to this.transact isn't an array as expected");

		assert.deepEqual(tx.inputs, [ "amount", "price", "market", "outcome", "minimumTradeSize" ], "tx.inputs didn't contain the expected values");

		assert.isString(tx.method, "tx.method sent to this.transact isn't an String as expected");
		assert.deepEqual(tx.method, currentMethod, "tx.method sent to this.transact isn't the expected method");

		assert.isString(tx.to, "tx.to sent to this.transact isn't an String as expected");
		assert.deepEqual(tx.to, augur.tx.BuyAndSellShares[currentMethod].to, "tx.to didn't point to the BuyAndSellShares contract");

		assert.isArray(tx.params, "tx.params sent to this.transact isn't an array as expected");
		// handles different expected params based on inputs...
		switch (transactCallCount) {
		case 7:
		case 8:
		case 9:
		case 10:
		case 11:
		case 12:
			// adjust for scalar calcs...
			assert.deepEqual(tx.params, ["0x8ac7230489e80000", "0x3860e639d80640000", 'testScalarMarketID', '1', "0x2386f26fc10000"], "tx.params didn't contain the expected values");
			break;
		case 13:
		case 14:
		case 15:
		case 16:
		case 17:
		case 18:
			// adjust for categorical tests...
			assert.deepEqual(tx.params, ["0x8ac7230489e80000", "0x6f05b59d3b20000", 'testCategoricalMarketID', '1', "0x2386f26fc10000"], "tx.params didn't contain the expected values");
			break;
		default:
			assert.deepEqual(tx.params, ["0x8ac7230489e80000", "0x6f05b59d3b20000", 'testBinaryMarketID', '1', "0x2386f26fc10000"], "tx.params didn't contain the expected values");
			break;
		}

		assert.isFunction(onSent, "onSent passed to this.transact is not a function");
		assert.isFunction(onSuccess, "onSuccess passed to this.transact is not a function");
		assert.isFunction(onFailed, "onFailed passed to this.transact is not a function");
	};
	function sharedShrinkScalarPriceMock(minValue, price) {
		assert.equal(price, 55);
		assert.equal(minValue, -10);
		if (minValue.constructor !== BigNumber) minValue = abi.bignum(minValue);
		if (price.constructor !== BigNumber) price = abi.bignum(price);
		return price.minus(minValue).toFixed();
	};

	describe('augur.cancel tests', function() {
		// 4 tests total
		var test = function (t) {
			it(t.description, function() {
				//assertions aren't provied since we are testing in transact since there is no output of the cancel function.
				currentMethod = 'cancel';
				augur.cancel(t.trade_id, t.onSent, t.onSuccess, t.onFailed);
			});
		};

		before(function() {
			augur.transact = function(tx, onSent, onSuccess, onFailed) {
				assert.isObject(tx, "tx sent to this.transact is not a Object");
				assert.isArray(tx.inputs, "tx.inputs sent to this.transact isn't an array as expected");

				assert.deepEqual(tx.inputs, [ "trade_id" ], "tx.inputs didn't contain the expected values");

				assert.isString(tx.method, "tx.method sent to this.transact isn't an String as expected");
				assert.isString(tx.returns, "tx.returns sent to this.transact isn't an String as expected");
				assert.isBoolean(tx.send, "tx.send sent to this.transact isn't a Boolean as expected");
				assert.isArray(tx.signature, "tx.signature sent to this.transact isn't an Array as expected");

				assert.deepEqual(tx.signature, ["int256"], "tx.signature didn't contain the expected values");

				assert.isString(tx.to, "tx.to sent to this.transact isn't an String as expected");
				assert.deepEqual(tx.to, augur.tx.BuyAndSellShares[currentMethod].to, "tx.to didn't point to the BuyAndSellShares contract");
				assert.isArray(tx.params, "tx.params sent to this.transact isn't an array as expected");

				assert.deepEqual(tx.params, ["tradeID"], "tx.params didn't contain the expected values");

				assert.isFunction(onSent, "onSent passed to this.transact is not a function");
				assert.isFunction(onSuccess, "onSuccess passed to this.transact is not a function");
				assert.isFunction(onFailed, "onFailed passed to this.transact is not a function");
			};
		});

		after(function() {
			augur.transact = transact;
		});

		test({
			description: "should send a cancel trade transaction with multiple arguments",
			trade_id: ['tradeID'],
			onSent: noop,
			onSuccess: noop,
			onFailed: noop
		});
		test({
			description: "should send a cancel trade transaction with 1 object arg",
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
			trade_id: ['tradeID'],
			onSent: undefined,
			onSuccess: undefined,
			onFailed: undefined
		});
		test({
			description: "should send a cancel trade transaction with 1 object arg but with undefined onSent, onSuccess, onFailed",
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
				currentMethod = 'buy';
				augur.buy(t.amount, t.price, t.market, t.outcome, t.scalarMinMax, t.onSent, t.onSuccess, t.onFailed);
			});
		};

		before(function() {
			augur.transact = sharedTransactMock;
			augur.shrinkScalarPrice = sharedShrinkScalarPriceMock;
		});

		after(function() {
			// after all the tests in this describe block, remove the stubs...
			augur.shrinkScalarPrice = shrinkScalarPrice;
			augur.transact = transact;
			transactCallCount = 0;
		});

		test({
			description: "Should handle a binary market buy using JS Number inputs",
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
			amount: "10",
			price: "0.5",
			market: "testBinaryMarketID",
			outcome: "1",
			scalarMinMax: null
		});
		test({
			description: "Should handle a binary market buy using String inputs in a single object argument",
			amount: { amount: '10', price: '0.5', market: 'testBinaryMarketID', outcome: '1', scalarMinMax: null, onSent: noop, onSuccess: noop, onFailed: noop}
		});
		test({
			description: "Should handle a binary market buy using String inputs in a single object argument missing the function hooks",
			amount: { amount: '10', price: '0.5', market: 'testBinaryMarketID', outcome: '1', scalarMinMax: null }
		});


		test({
			description: "Should handle a scalar market buy using JS Number inputs",
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
			amount: "10",
			price: "55",
			market: "testScalarMarketID",
			outcome: "1",
			scalarMinMax: { minValue: abi.bignum(-10), maxValue: abi.bignum(140) }
		});
		test({
			description: "Should handle a scalar market buy using String inputs in a single object argument",
			amount: { amount: '10', price: '55', market: 'testScalarMarketID', outcome: '1', scalarMinMax: { minValue: abi.bignum(-10), maxValue: abi.bignum(140) }, onSent: noop, onSuccess: noop, onFailed: noop}
		});
		test({
			description: "Should handle a scalar market buy using String inputs in a single object argument missing the function hooks",
			amount: { amount: '10', price: '55', market: 'testScalarMarketID', outcome: '1', scalarMinMax: { minValue: abi.bignum(-10), maxValue: abi.bignum(140) } }
		});

		test({
			description: "Should handle a categorical market buy using JS Number inputs",
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
			amount: "10",
			price: "0.5",
			market: "testCategoricalMarketID",
			outcome: "1",
			scalarMinMax: null
		});
		test({
			description: "Should handle a categorical market buy using String inputs in a single object argument",
			amount: { amount: '10', price: '0.5', market: 'testCategoricalMarketID', outcome: '1', scalarMinMax: null, onSent: noop, onSuccess: noop, onFailed: noop}
		});
		test({
			description: "Should handle a categorical market buy using String inputs in a single object argument missing the function hooks",
			amount: { amount: '10', price: '0.5', market: 'testCategoricalMarketID', outcome: '1', scalarMinMax: null }
		});
	});

	describe('augur.sell tests', function() {
		// 18 tests total
		var test = function (t) {
			it(t.description, function() {
				currentMethod = 'sell';
				augur.sell(t.amount, t.price, t.market, t.outcome, t.scalarMinMax, t.onSent, t.onSuccess, t.onFailed);
			});
		};

		before(function() {
			augur.transact = sharedTransactMock;
			augur.shrinkScalarPrice = sharedShrinkScalarPriceMock;
		});

		after(function() {
			// after all the tests in this describe block, remove the stubs...
			augur.shrinkScalarPrice = shrinkScalarPrice;
			augur.transact = transact;
			transactCallCount = 0;
		});

		test({
			description: "Should handle a binary market sell using JS Number inputs",
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
			amount: "10",
			price: "0.5",
			market: "testBinaryMarketID",
			outcome: "1",
			scalarMinMax: null
		});
		test({
			description: "Should handle a binary market sell using String inputs in a single object argument",
			amount: { amount: '10', price: '0.5', market: 'testBinaryMarketID', outcome: '1', scalarMinMax: null, onSent: noop, onSuccess: noop, onFailed: noop}
		});
		test({
			description: "Should handle a binary market sell using String inputs in a single object argument missing the function hooks",
			amount: { amount: '10', price: '0.5', market: 'testBinaryMarketID', outcome: '1', scalarMinMax: null }
		});


		test({
			description: "Should handle a scalar market sell using JS Number inputs",
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
			amount: "10",
			price: "55",
			market: "testScalarMarketID",
			outcome: "1",
			scalarMinMax: { minValue: abi.bignum(-10), maxValue: abi.bignum(140) }
		});
		test({
			description: "Should handle a scalar market sell using String inputs in a single object argument",
			amount: { amount: '10', price: '55', market: 'testScalarMarketID', outcome: '1', scalarMinMax: { minValue: abi.bignum(-10), maxValue: abi.bignum(140) }, onSent: noop, onSuccess: noop, onFailed: noop}
		});
		test({
			description: "Should handle a scalar market sell using String inputs in a single object argument missing the function hooks",
			amount: { amount: '10', price: '55', market: 'testScalarMarketID', outcome: '1', scalarMinMax: { minValue: abi.bignum(-10), maxValue: abi.bignum(140) } }
		});

		test({
			description: "Should handle a categorical market sell using JS Number inputs",
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
			amount: "10",
			price: "0.5",
			market: "testCategoricalMarketID",
			outcome: "1",
			scalarMinMax: null
		});
		test({
			description: "Should handle a categorical market sell using String inputs in a single object argument",
			amount: { amount: '10', price: '0.5', market: 'testCategoricalMarketID', outcome: '1', scalarMinMax: null, onSent: noop, onSuccess: noop, onFailed: noop}
		});
		test({
			description: "Should handle a categorical market sell using String inputs in a single object argument missing the function hooks",
			amount: { amount: '10', price: '0.5', market: 'testCategoricalMarketID', outcome: '1', scalarMinMax: null }
		});
	});

	describe('augur.shortAsk tests', function() {
		// 18 tests total
		var test = function (t) {
			it(t.description, function() {
				currentMethod = 'shortAsk';
				augur.shortAsk(t.amount, t.price, t.market, t.outcome, t.scalarMinMax, t.onSent, t.onSuccess, t.onFailed);
			});
		};

		before(function() {
			augur.transact = sharedTransactMock;
			augur.shrinkScalarPrice = sharedShrinkScalarPriceMock;
		});

		after(function() {
			// after all the tests in this describe block, remove the stubs...
			augur.shrinkScalarPrice = shrinkScalarPrice;
			augur.transact = transact;
			transactCallCount = 0;
		});

		test({
			description: "Should handle a binary market shortAsk using JS Number inputs",
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
			amount: "10",
			price: "0.5",
			market: "testBinaryMarketID",
			outcome: "1",
			scalarMinMax: null
		});
		test({
			description: "Should handle a binary market shortAsk using String inputs in a single object argument",
			amount: { amount: '10', price: '0.5', market: 'testBinaryMarketID', outcome: '1', scalarMinMax: null, onSent: noop, onSuccess: noop, onFailed: noop}
		});
		test({
			description: "Should handle a binary market shortAsk using String inputs in a single object argument missing the function hooks",
			amount: { amount: '10', price: '0.5', market: 'testBinaryMarketID', outcome: '1', scalarMinMax: null }
		});


		test({
			description: "Should handle a scalar market shortAsk using JS Number inputs",
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
			amount: "10",
			price: "55",
			market: "testScalarMarketID",
			outcome: "1",
			scalarMinMax: { minValue: abi.bignum(-10), maxValue: abi.bignum(140) }
		});
		test({
			description: "Should handle a scalar market shortAsk using String inputs in a single object argument",
			amount: { amount: '10', price: '55', market: 'testScalarMarketID', outcome: '1', scalarMinMax: { minValue: abi.bignum(-10), maxValue: abi.bignum(140) }, onSent: noop, onSuccess: noop, onFailed: noop}
		});
		test({
			description: "Should handle a scalar market shortAsk using String inputs in a single object argument missing the function hooks",
			amount: { amount: '10', price: '55', market: 'testScalarMarketID', outcome: '1', scalarMinMax: { minValue: abi.bignum(-10), maxValue: abi.bignum(140) } }
		});

		test({
			description: "Should handle a categorical market shortAsk using JS Number inputs",
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
			amount: "10",
			price: "0.5",
			market: "testCategoricalMarketID",
			outcome: "1",
			scalarMinMax: null
		});
		test({
			description: "Should handle a categorical market shortAsk using String inputs in a single object argument",
			amount: { amount: '10', price: '0.5', market: 'testCategoricalMarketID', outcome: '1', scalarMinMax: null, onSent: noop, onSuccess: noop, onFailed: noop}
		});
		test({
			description: "Should handle a categorical market shortAsk using String inputs in a single object argument missing the function hooks",
			amount: { amount: '10', price: '0.5', market: 'testCategoricalMarketID', outcome: '1', scalarMinMax: null }
		});
	});
});
