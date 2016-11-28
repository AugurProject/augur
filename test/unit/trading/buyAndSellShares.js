"use strict";

var assert = require("chai").assert;
// var sinon = require("sinon");
var augur = require("../../../src");
var abi = require("augur-abi");
var BigNumber = require("bignumber.js");

// 58 tests total
describe("buyAndSellShares Unit Tests", function() {
	// define noop to use as dummy functions for onSent, onSuccess, onFailed...
	function noop() {};
	var transactCallCount = 0;
	var transact = augur.transact;
	var shrinkScalarPrice = augur.shrinkScalarPrice;
	function sharedTransactMock(tx, onSent, onSuccess, onFailed) {
		// inc the call count...
		transactCallCount++;

		assert.isObject(tx, "tx sent to this.transact is not a Object");
		assert.isNumber(tx.gas, "tx.gas sent to this.transact isn't a number as expected");
		assert.isArray(tx.inputs, "tx.inputs sent to this.transact isn't an array as expected");

		assert.deepEqual(tx.inputs, [ "amount", "price", "market", "outcome" ], "tx.inputs didn't contain the expected values");

		assert.isString(tx.method, "tx.method sent to this.transact isn't an String as expected");
		assert.isBoolean(tx.mutable, "tx.mutable sent to this.transact isn't a Boolean as expected");
		assert.isString(tx.returns, "tx.returns sent to this.transact isn't an String as expected");
		// if it's not a shortAsk method then we are going to look for send also
		if (tx.method !== 'shortAsk') assert.isBoolean(tx.send, "tx.send sent to this.transact isn't a Boolean as expected");


		assert.isArray(tx.signature, "tx.signature sent to this.transact isn't an Array as expected");

		assert.deepEqual(tx.signature, ["int256", "int256", "int256", "int256"], "tx.signature didn't contain the expected values");

		assert.isString(tx.to, "tx.to sent to this.transact isn't an String as expected");
		// since this is a unit test, we aren't going to actually connect so the tx.from field will be undefined...
		// assert.isString(tx.from, "tx.from sent to this.transact isn't an String as expected");
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
			assert.deepEqual(tx.params, [abi.fix(10, "hex"), abi.fix(10.5, "hex"), 'testScalarMarketID', '1'], "tx.params didn't contain the expected values");
			break;
		case 13:
		case 14:
		case 15:
		case 16:
		case 17:
		case 18:
			// adjust for categorical tests...
			assert.deepEqual(tx.params, [abi.fix(10, "hex"), abi.fix(0.5, "hex"), 'testCategoricalMarketID', '1'], "tx.params didn't contain the expected values");
			break;
		default:
			assert.deepEqual(tx.params, [abi.fix(10, "hex"), abi.fix(0.5, "hex"), 'testBinaryMarketID', '1'], "tx.params didn't contain the expected values");
			break;
		}

		assert.isFunction(onSent, "onSent passed to this.transact is not a function");
		assert.isFunction(onSuccess, "onSuccess passed to this.transact is not a function");
		assert.isFunction(onFailed, "onFailed passed to this.transact is not a function");
	};
	function sharedShrinkScalarPriceMock(minValue, price) {
		assert.equal(price, 0.5);
		assert.equal(minValue, -10);
		if (minValue.constructor !== BigNumber) minValue = abi.bignum(minValue);
		if (price.constructor !== BigNumber) price = abi.bignum(price);
		return price.minus(minValue).toFixed();
	};

	describe('augur.cancel tests', function() {
		// 4 tests total
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
				// since this is a unit test, we aren't going to actually connect so the tx.from field will be undefined...
				// assert.isString(tx.from, "tx.from sent to this.transact isn't an String as expected");
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

		it('should send a cancel trade transaction with multiple arguments', function() {
			augur.cancel(['tradeID'], noop, noop, noop);
		});

		it('should send a cancel trade transaction with 1 object arg', function() {
			augur.cancel({ trade_id: ['tradeID'], onSent: noop, onSuccess: noop, onFailed: noop });
		});

		it('should send a cancel trade transaction with 1 trade_id arg only', function() {
			augur.cancel(['tradeID']);
		});

		it('should send a cancel trade transaction with 1 object arg but with undefined onSent, onSuccess, onFailed' , function() {
			augur.cancel({ trade_id: ['tradeID'] });
		});
	});

	describe('augur.buy tests', function() {
		// 18 tests total
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

		it('Should handle a binary market buy using JS Number inputs', function () {
			augur.buy(10, 0.5, 'testBinaryMarketID', '1', null, noop, noop, noop);
		});

		it('Should handle a binary market buy using String inputs', function () {
			augur.buy('10', '0.5', 'testBinaryMarketID', '1', null, noop, noop, noop);
		});

		it('Should handle a binary market buy using Big Number inputs', function () {
				augur.buy(abi.bignum('10'), abi.bignum('0.5'), 'testBinaryMarketID', '1', null, noop, noop, noop);
		});

		it('Should handle a binary market buy using String inputs but missing function hooks', function () {
			augur.buy('10', '0.5', 'testBinaryMarketID', '1', null);
		});

		it('Should handle a binary market buy using String inputs in a single object argument', function () {
			augur.buy({ amount: '10', price: '0.5', market: 'testBinaryMarketID', outcome: '1', scalarMinMax: null, onSent: noop, onSuccess: noop, onFailed: noop});
		});

		it('Should handle a binary market buy using String inputs in a single object argument missing the function hooks', function () {
			augur.buy({ amount: '10', price: '0.5', market: 'testBinaryMarketID', outcome: '1', scalarMinMax: null});
		});

		it('Should handle a scalar market buy using JS Number inputs', function () {
			augur.buy(10, 0.5, 'testScalarMarketID', '1', { minValue: -10, maxValue: 140 }, noop, noop, noop);
		});

		it('Should handle a scalar market buy using String inputs', function () {
			augur.buy('10', '0.5', 'testScalarMarketID', '1', { minValue: '-10', maxValue: '140' }, noop, noop, noop);
		});

		it('Should handle a scalar market buy using BigNumber inputs', function () {
			augur.buy(abi.bignum(10), abi.bignum(0.5), 'testScalarMarketID', '1', { minValue: abi.bignum(-10), maxValue: abi.bignum(140) }, noop, noop, noop);
		});

		it('Should handle a scalar market buy using String inputs but missing function hooks', function () {
			augur.buy('10', '0.5', 'testScalarMarketID', '1', { minValue: abi.bignum(-10), maxValue: abi.bignum(140) });
		});

		it('Should handle a scalar market buy using String inputs in a single object argument', function () {
			augur.buy({ amount: '10', price: '0.5', market: 'testScalarMarketID', outcome: '1', scalarMinMax: { minValue: abi.bignum(-10), maxValue: abi.bignum(140) }, onSent: noop, onSuccess: noop, onFailed: noop});
		});

		it('Should handle a scalar market buy using String inputs in a single object argument missing the function hooks', function () {
			augur.buy({ amount: '10', price: '0.5', market: 'testScalarMarketID', outcome: '1', scalarMinMax: { minValue: abi.bignum(-10), maxValue: abi.bignum(140) }});
		});

		it('Should handle a categorical market buy using JS Number inputs', function () {
			augur.buy(10, 0.5, 'testCategoricalMarketID', '1', null, noop, noop, noop);
		});

		it('Should handle a categorical market buy using String inputs', function () {
			augur.buy('10', '0.5', 'testCategoricalMarketID', '1', null, noop, noop, noop);
		});

		it('Should handle a categorical market buy using Big Number inputs', function () {
				augur.buy(abi.bignum('10'), abi.bignum('0.5'), 'testCategoricalMarketID', '1', null, noop, noop, noop);
		});

		it('Should handle a categorical market buy using String inputs but missing function hooks', function () {
			augur.buy('10', '0.5', 'testCategoricalMarketID', '1', null);
		});

		it('Should handle a categorical market buy using String inputs in a single object argument', function () {
			augur.buy({ amount: '10', price: '0.5', market: 'testCategoricalMarketID', outcome: '1', scalarMinMax: null, onSent: noop, onSuccess: noop, onFailed: noop});
		});

		it('Should handle a categorical market buy using String inputs in a single object argument missing the function hooks', function () {
			augur.buy({ amount: '10', price: '0.5', market: 'testCategoricalMarketID', outcome: '1', scalarMinMax: null});
		});
	});

	describe('augur.sell tests', function() {
		// 18 tests total
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

		it('Should handle a binary market sell using JS Number inputs', function () {
			augur.sell(10, 0.5, 'testBinaryMarketID', '1', null, noop, noop, noop);
		});

		it('Should handle a binary market sell using String inputs', function () {
			augur.sell('10', '0.5', 'testBinaryMarketID', '1', null, noop, noop, noop);
		});

		it('Should handle a binary market sell using Big Number inputs', function () {
				augur.sell(abi.bignum('10'), abi.bignum('0.5'), 'testBinaryMarketID', '1', null, noop, noop, noop);
		});

		it('Should handle a binary market sell using String inputs but missing function hooks', function () {
			augur.sell('10', '0.5', 'testBinaryMarketID', '1', null);
		});

		it('Should handle a binary market sell using String inputs in a single object argument', function () {
			augur.sell({ amount: '10', price: '0.5', market: 'testBinaryMarketID', outcome: '1', scalarMinMax: null, onSent: noop, onSuccess: noop, onFailed: noop});
		});

		it('Should handle a binary market sell using String inputs in a single object argument missing the function hooks', function () {
			augur.sell({ amount: '10', price: '0.5', market: 'testBinaryMarketID', outcome: '1', scalarMinMax: null});
		});

		it('Should handle a scalar market sell using JS Number inputs', function () {
			augur.sell(10, 0.5, 'testScalarMarketID', '1', { minValue: -10, maxValue: 140 }, noop, noop, noop);
		});

		it('Should handle a scalar market sell using String inputs', function () {
			augur.sell('10', '0.5', 'testScalarMarketID', '1', { minValue: '-10', maxValue: '140' }, noop, noop, noop);
		});

		it('Should handle a scalar market sell using BigNumber inputs', function () {
			augur.sell(abi.bignum(10), abi.bignum(0.5), 'testScalarMarketID', '1', { minValue: abi.bignum(-10), maxValue: abi.bignum(140) }, noop, noop, noop);
		});

		it('Should handle a scalar market sell using String inputs but missing function hooks', function () {
			augur.sell('10', '0.5', 'testScalarMarketID', '1', { minValue: abi.bignum(-10), maxValue: abi.bignum(140) });
		});

		it('Should handle a scalar market sell using String inputs in a single object argument', function () {
			augur.sell({ amount: '10', price: '0.5', market: 'testScalarMarketID', outcome: '1', scalarMinMax: { minValue: abi.bignum(-10), maxValue: abi.bignum(140) }, onSent: noop, onSuccess: noop, onFailed: noop});
		});

		it('Should handle a scalar market sell using String inputs in a single object argument missing the function hooks', function () {
			augur.sell({ amount: '10', price: '0.5', market: 'testScalarMarketID', outcome: '1', scalarMinMax: { minValue: abi.bignum(-10), maxValue: abi.bignum(140) }});
		});

		it('Should handle a categorical market sell using JS Number inputs', function () {
			augur.sell(10, 0.5, 'testCategoricalMarketID', '1', null, noop, noop, noop);
		});

		it('Should handle a categorical market sell using String inputs', function () {
			augur.sell('10', '0.5', 'testCategoricalMarketID', '1', null, noop, noop, noop);
		});

		it('Should handle a categorical market sell using Big Number inputs', function () {
				augur.sell(abi.bignum('10'), abi.bignum('0.5'), 'testCategoricalMarketID', '1', null, noop, noop, noop);
		});

		it('Should handle a categorical market sell using String inputs but missing function hooks', function () {
			augur.sell('10', '0.5', 'testCategoricalMarketID', '1', null);
		});

		it('Should handle a categorical market sell using String inputs in a single object argument', function () {
			augur.sell({ amount: '10', price: '0.5', market: 'testCategoricalMarketID', outcome: '1', scalarMinMax: null, onSent: noop, onSuccess: noop, onFailed: noop});
		});

		it('Should handle a categorical market sell using String inputs in a single object argument missing the function hooks', function () {
			augur.sell({ amount: '10', price: '0.5', market: 'testCategoricalMarketID', outcome: '1', scalarMinMax: null});
		});
	});

	describe('augur.shortAsk tests', function() {
		// 18 tests total
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

		it('Should handle a binary market shortAsk using JS Number inputs', function () {
			augur.shortAsk(10, 0.5, 'testBinaryMarketID', '1', null, noop, noop, noop);
		});

		it('Should handle a binary market shortAsk using String inputs', function () {
			augur.shortAsk('10', '0.5', 'testBinaryMarketID', '1', null, noop, noop, noop);
		});

		it('Should handle a binary market shortAsk using Big Number inputs', function () {
				augur.shortAsk(abi.bignum('10'), abi.bignum('0.5'), 'testBinaryMarketID', '1', null, noop, noop, noop);
		});

		it('Should handle a binary market shortAsk using String inputs but missing function hooks', function () {
			augur.shortAsk('10', '0.5', 'testBinaryMarketID', '1', null);
		});

		it('Should handle a binary market shortAsk using String inputs in a single object argument', function () {
			augur.shortAsk({ amount: '10', price: '0.5', market: 'testBinaryMarketID', outcome: '1', scalarMinMax: null, onSent: noop, onSuccess: noop, onFailed: noop});
		});

		it('Should handle a binary market shortAsk using String inputs in a single object argument missing the function hooks', function () {
			augur.shortAsk({ amount: '10', price: '0.5', market: 'testBinaryMarketID', outcome: '1', scalarMinMax: null});
		});

		it('Should handle a scalar market shortAsk using JS Number inputs', function () {
			augur.shortAsk(10, 0.5, 'testScalarMarketID', '1', { minValue: -10, maxValue: 140 }, noop, noop, noop);
		});

		it('Should handle a scalar market shortAsk using String inputs', function () {
			augur.shortAsk('10', '0.5', 'testScalarMarketID', '1', { minValue: '-10', maxValue: '140' }, noop, noop, noop);
		});

		it('Should handle a scalar market shortAsk using BigNumber inputs', function () {
			augur.shortAsk(abi.bignum(10), abi.bignum(0.5), 'testScalarMarketID', '1', { minValue: abi.bignum(-10), maxValue: abi.bignum(140) }, noop, noop, noop);
		});

		it('Should handle a scalar market shortAsk using String inputs but missing function hooks', function () {
			augur.shortAsk('10', '0.5', 'testScalarMarketID', '1', { minValue: abi.bignum(-10), maxValue: abi.bignum(140) });
		});

		it('Should handle a scalar market shortAsk using String inputs in a single object argument', function () {
			augur.shortAsk({ amount: '10', price: '0.5', market: 'testScalarMarketID', outcome: '1', scalarMinMax: { minValue: abi.bignum(-10), maxValue: abi.bignum(140) }, onSent: noop, onSuccess: noop, onFailed: noop});
		});

		it('Should handle a scalar market shortAsk using String inputs in a single object argument missing the function hooks', function () {
			augur.shortAsk({ amount: '10', price: '0.5', market: 'testScalarMarketID', outcome: '1', scalarMinMax: { minValue: abi.bignum(-10), maxValue: abi.bignum(140) }});
		});

		it('Should handle a categorical market shortAsk using JS Number inputs', function () {
			augur.shortAsk(10, 0.5, 'testCategoricalMarketID', '1', null, noop, noop, noop);
		});

		it('Should handle a categorical market shortAsk using String inputs', function () {
			augur.shortAsk('10', '0.5', 'testCategoricalMarketID', '1', null, noop, noop, noop);
		});

		it('Should handle a categorical market shortAsk using Big Number inputs', function () {
				augur.shortAsk(abi.bignum('10'), abi.bignum('0.5'), 'testCategoricalMarketID', '1', null, noop, noop, noop);
		});

		it('Should handle a categorical market shortAsk using String inputs but missing function hooks', function () {
			augur.shortAsk('10', '0.5', 'testCategoricalMarketID', '1', null);
		});

		it('Should handle a categorical market shortAsk using String inputs in a single object argument', function () {
			augur.shortAsk({ amount: '10', price: '0.5', market: 'testCategoricalMarketID', outcome: '1', scalarMinMax: null, onSent: noop, onSuccess: noop, onFailed: noop});
		});

		it('Should handle a categorical market shortAsk using String inputs in a single object argument missing the function hooks', function () {
			augur.shortAsk({ amount: '10', price: '0.5', market: 'testCategoricalMarketID', outcome: '1', scalarMinMax: null});
		});
	});
});
