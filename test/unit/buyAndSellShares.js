"use strict";

var assert = require("chai").assert;
var sinon = require("sinon");
var augur = require("../../src");
var abi = require("augur-abi");

// - tests total
describe("buyAndSellShares Unit Tests", function() {

	function onSent() {
		console.log("onSent");
	}

	function onSuccess() {
		console.log("onSuccess");
	}

	function onFailed() {
		console.log("onFailed");
	}

	before(function() {
		sinon.stub(augur, "transact", function(tx, onSent, onSucces, onFailed) {
			assert.isObject(tx, "tx sent to this.transact is not a Object");
			assert.isArray(tx.inputs, "tx.inputs sent to this.transact isn't an array as expected");

			assert.deepEqual(tx.inputs, [ "amount", "price", "market", "outcome" ], "tx.inputs didn't contain the expected values");

			assert.isString(tx.method, "tx.method sent to this.transact isn't an String as expected");
			assert.isString(tx.returns, "tx.returns sent to this.transact isn't an String as expected");
			assert.isBoolean(tx.send, "tx.send sent to this.transact isn't a Boolean as expected");
			assert.isArray(tx.signature, "tx.signature sent to this.transact isn't an Array as expected");

			assert.deepEqual(tx.signature, ["int256", "int256", "int256", "int256"], "tx.signature didn't contain the expected values");

			assert.isString(tx.to, "tx.to sent to this.transact isn't an String as expected");
			assert.equal(tx.to, "0xd996967fd46e7cae18e3ae8ffc4b4f000f11f454", "tx.to wasn't the default to address expected");
			assert.isString(tx.from, "tx.from sent to this.transact isn't an String as expected");
			assert.equal(tx.from, "0x00bae5113ee9f252cceb0001205b88fad175461a", "tx.from wasn't the expected default from string");
			assert.isArray(tx.params, "tx.params sent to this.transact isn't an array as expected");

			assert.deepEqual(tx.params, [abi.fix(10, "hex"), abi.fix(0.5, "hex"), 'testBinaryMarketID', '1'], "tx.params didn't contain the expected values");

			assert.isFunction(onSent, "onSent passed to this.transact is not a function");
			assert.isFunction(onSuccess, "onSuccess passed to this.transact is not a function");
			assert.isFunction(onFailed, "onFailed passed to this.transact is not a function");
		});
	});

	after(function() {
		augur.transact.restore();
	});

	it('Should handle a binary market buy using JS Numbers', function () {
		augur.buy(10, 0.5, 'testBinaryMarketID', '1', null, onSent, onSuccess, onFailed);
	});
});
