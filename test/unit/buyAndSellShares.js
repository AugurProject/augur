"use strict";

var assert = require("chai").assert;
var sinon = require("sinon");
var augur = require("../../src");
var abi = require("augur-abi");
var BigNumber = require("bignumber.js");

// 13 tests total
describe("buyAndSellShares Unit Tests", function() {
	// define noop to use as dummy functions for onSent, onSuccess, onFailed...
	function noop() {};

	describe('augur.cancel tests', function() {
		// 4 tests total
		before(function() {
			// add a stub to augur functions used in this file before running any tests...
			sinon.stub(augur, "transact", function(tx, onSent, onSuccess, onFailed) {
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
			});
		});

		after(function() {
			augur.transact.restore();
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
		// 9 tests total
		before(function() {
			// add a stub to augur functions used in this file before running any tests...
			sinon.stub(augur, "transact", function(tx, onSent, onSuccess, onFailed) {
				assert.isObject(tx, "tx sent to this.transact is not a Object");
				assert.isArray(tx.inputs, "tx.inputs sent to this.transact isn't an array as expected");

				assert.deepEqual(tx.inputs, [ "amount", "price", "market", "outcome" ], "tx.inputs didn't contain the expected values");

				assert.isString(tx.method, "tx.method sent to this.transact isn't an String as expected");
				assert.isString(tx.returns, "tx.returns sent to this.transact isn't an String as expected");
				assert.isBoolean(tx.send, "tx.send sent to this.transact isn't a Boolean as expected");
				assert.isArray(tx.signature, "tx.signature sent to this.transact isn't an Array as expected");

				assert.deepEqual(tx.signature, ["int256", "int256", "int256", "int256"], "tx.signature didn't contain the expected values");

				assert.isString(tx.to, "tx.to sent to this.transact isn't an String as expected");
				// since this is a unit test, we aren't going to actually connect so the tx.from field will be undefined...
				// assert.isString(tx.from, "tx.from sent to this.transact isn't an String as expected");
				assert.isArray(tx.params, "tx.params sent to this.transact isn't an array as expected");
				// handles different expected params based on inputs...
			 	switch (augur.transact.callCount) {
				case 4:
				case 5:
				case 6:
					// adjust for scalar calcs...
					assert.deepEqual(tx.params, [abi.fix(10, "hex"), abi.fix(10.5, "hex"), 'testScalarMarketID', '1'], "tx.params didn't contain the expected values");
					break;
				case 7:
				case 8:
				case 9:
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
			});

			sinon.stub(augur, 'shrinkScalarPrice', function(minValue, price) {
				assert.equal(price, 0.5);
				assert.equal(minValue, -10);
				if (minValue.constructor !== BigNumber) minValue = abi.bignum(minValue);
        if (price.constructor !== BigNumber) price = abi.bignum(price);
        return price.minus(minValue).toFixed();
			});

		});

		after(function() {
			// after all the tests in this describe block, remove the stubs...
			augur.shrinkScalarPrice.restore();
			augur.transact.restore();
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

		it('Should handle a scalar market buy using JS Number inputs', function () {
			augur.buy(10, 0.5, 'testScalarMarketID', '1', { minValue: -10, maxValue: 140 }, noop, noop, noop);
		});

		it('Should handle a scalar market buy using String inputs', function () {
			augur.buy('10', '0.5', 'testScalarMarketID', '1', { minValue: '-10', maxValue: '140' }, noop, noop, noop);
		});

		it('Should handle a scalar market buy using BigNumber inputs', function () {
			augur.buy(abi.bignum(10), abi.bignum(0.5), 'testScalarMarketID', '1', { minValue: abi.bignum(-10), maxValue: abi.bignum(140) }, noop, noop, noop);
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
	});
});
