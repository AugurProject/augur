"use strict";

var assert = require("chai").assert;
var sinon = require("sinon");
var augur = require("../../../src");
var abi = require("augur-abi");
// 4 tests total

describe("sendReputation Unit Tests", () => {
	// define noop to use as dummy functions for onSent, onSuccess, onFailed, onConfirmed...
	function noop() {};

	before(function() {
		sinon.stub(augur, "transact", function(tx, onSent, onSuccess, onFailed, onConfirmed) {
			// console.log(tx);
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
		});
	});

	after(function() {
		augur.transact.restore();
	});

	it("Should handle a request to send rep given a JS Number 'value'", function() {
		augur.sendReputation("010101", "recipientAddress", 10, noop, noop, noop, noop);
	});

	it("Should handle a request to send rep given a string 'value'", function() {
		augur.sendReputation("010101", "recipientAddress", "10", noop, noop, noop, noop);
	});

	it("Should handle a request to send rep given a bigNumber 'value'", function() {
		augur.sendReputation("010101", "recipientAddress", abi.bignum(10), noop, noop, noop, noop);
	});

	it("Should handle a request to send rep with only 1 large object arg", function() {
		var branch = {
			branch: "010101",
			recver: "recipientAddress",
			value: "10",
			onSent: noop,
			onSuccess: noop,
			onFailed: noop,
			onConfirmed: noop
		};

		augur.sendReputation(branch);
	});
});
