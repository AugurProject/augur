"use strict";

var assert = require("chai").assert;
var augur = require("../../../src");
var abi = require("augur-abi");
// 4 tests total

describe("sendReputation Unit Tests", () => {
	// define noop to use as dummy functions for onSent, onSuccess, onFailed, onConfirmed...
	function noop() {};
	var transact = augur.transact;
	var test = function (t) {
		it(t.description, function() {
			augur.sendReputation(t.branch, t.recver, t.value, t.onSent, t.onSuccess, t.onFailed, t.onConfirmed);
		});
	};
	before(function() {
		augur.transact = function(tx, onSent, onSuccess, onFailed, onConfirmed) {
			assert.isObject(tx, "tx sent to this.transact is not a Object");
			assert.isArray(tx.inputs, "tx.inputs sent to this.transact isn't an array as expected");

			assert.deepEqual(tx.inputs, [ "branch", "recver", "value" ], "tx.inputs didn't contain the expected values");

			assert.isString(tx.method, "tx.method sent to this.transact isn't an String as expected");
			assert.isString(tx.returns, "tx.returns sent to this.transact isn't an String as expected");
			assert.isBoolean(tx.send, "tx.send sent to this.transact isn't a Boolean as expected");
			assert.isArray(tx.signature, "tx.signature sent to this.transact isn't an Array as expected");

			assert.deepEqual(tx.signature, ["int256", "int256", "int256"], "tx.signature didn't contain the expected values");

			assert.isString(tx.to, "tx.to sent to this.transact isn't an String as expected");
			// assert.isString(tx.from, "tx.from sent to this.transact isn't an String as expected");
			assert.isArray(tx.params, "tx.params sent to this.transact isn't an array as expected");

			assert.deepEqual(tx.params, ["010101", "recipientAddress", abi.fix(10, "hex")], "tx.params didn't contain the expected values");

			assert.isFunction(onSent, "onSent passed to this.transact is not a function");
			assert.isFunction(onSuccess, "onSuccess passed to this.transact is not a function");
			assert.isFunction(onFailed, "onFailed passed to this.transact is not a function");
			assert.isFunction(onConfirmed, "onConfirmed passed to this.transact is not a function");
		};

	});

	after(function() {
		augur.transact = transact;
	});

	test({
		description: "Should handle a request to send rep given a JS Number 'value'",
		branch: "010101",
		recver: "recipientAddress",
		value: 10,
		onSent: noop,
		onSuccess: noop,
		onFailed: noop,
		onConfirmed: noop
	});
	test({
		description: "Should handle a request to send rep given a String 'value'",
		branch: "010101",
		recver: "recipientAddress",
		value: "10",
		onSent: noop,
		onSuccess: noop,
		onFailed: noop,
		onConfirmed: noop
	});
	test({
		description: "Should handle a request to send rep given a BigNumber 'value'",
		branch: "010101",
		recver: "recipientAddress",
		value: abi.bignum(10),
		onSent: noop,
		onSuccess: noop,
		onFailed: noop,
		onConfirmed: noop
	});
	test({
		description: "Should handle a request to send rep with only 1 large object arg",
		branch: {
			branch: "010101",
			recver: "recipientAddress",
			value: "10",
			onSent: noop,
			onSuccess: noop,
			onFailed: noop,
			onConfirmed: noop
		}
	});
});
