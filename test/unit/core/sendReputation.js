"use strict";

var assert = require("chai").assert;
var augur = require("../../../src");
var abi = require("augur-abi");
var contracts = require('augur-contracts');
// 10 tests total

describe("sendReputation Unit Tests", () => {
	// define noop to use as dummy functions for onSent
	function noop() {};
	function failedError(e) {
		// this is a function for onFailed placeholder to fail if it's called for tests that shouldn't be calling onFailed.
		assert.deepEqual(e, 'onFailed should never have been called if this test worked correctly!');
	};
	function successError(r) {
		// this is a function for onSuccess placeholder to fail if it's called for tests that shouldn't be calling onSuccess.
		assert.deepEqual(r, 'onSuccess should never have been called if this test worked correctly!');
	};
	var transact = augur.transact;
	var getRepBalance = augur.getRepBalance;
	var getRepRedistributionDone = augur.getRepRedistributionDone;
	var onSuccessToTest;
	var	getRepBalanceCallCount = 0;
	var	getRepRedistributionDoneCallCount = 0;
	var test = function (t) {
		it(t.description, function() {
			augur.sendReputation(t.branch, t.recver, t.value, t.onSent, t.onSuccess, t.onFailed);
			onSuccessToTest(t.successResult);
		});
	};

	before(function() {
		augur.transact = function(tx, onSent, onSuccess, onFailed) {
			assert.isObject(tx, "tx sent to this.transact is not a Object");
			assert.isArray(tx.inputs, "tx.inputs sent to this.transact isn't an array as expected");

			assert.deepEqual(tx.inputs, [ "branch", "recver", "value" ], "tx.inputs didn't contain the expected values");

			assert.isString(tx.method, "tx.method sent to this.transact isn't an String as expected");
			assert.isString(tx.returns, "tx.returns sent to this.transact isn't an String as expected");
			assert.isBoolean(tx.send, "tx.send sent to this.transact isn't a Boolean as expected");
			assert.isArray(tx.signature, "tx.signature sent to this.transact isn't an Array as expected");

			assert.deepEqual(tx.signature, ["int256", "int256", "int256"], "tx.signature didn't contain the expected values");

			assert.isString(tx.to, "tx.to sent to this.transact isn't an String as expected");
			// make sure the tx.to is sending to the correct contract.
			// contracts[branch][method] - 2 = test trans, SendReputation is method
			assert.deepEqual(tx.to, contracts['2']['SendReputation'], "tx.to didn't point to the sendReputation contract");
			assert.isArray(tx.params, "tx.params sent to this.transact isn't an array as expected");

			assert.deepEqual(tx.params, ["2", "recipientAddress", abi.fix(5, "hex")], "tx.params didn't contain the expected values");

			assert.isFunction(onSent, "onSent passed to this.transact is not a function");
			assert.isFunction(onSuccess, "onSuccess passed to this.transact is not a function");
			assert.isFunction(onFailed, "onFailed passed to this.transact is not a function");
			// save the onSuccess function produced by sendReputation so we can test the prepare function contained within
			onSuccessToTest = onSuccess;
		};
		augur.getRepBalance = function(branch, from, cb) {
			getRepBalanceCallCount++;
			switch (getRepBalanceCallCount) {
			case 2:
				cb('1.5');
				break;
			case 3:
				cb({ error: "-1", message: "There was an issue with getRepBalance()."});
				break;
			case 4:
				cb(undefined);
				break;
			default:
				cb('1000.0');
				break;
			}
		};
		augur.getRepRedistributionDone = function(branch, from, cb) {
			getRepRedistributionDoneCallCount++;
			switch (getRepRedistributionDoneCallCount) {
			case 1:
				cb("1");
				break;
			case 2:
				cb("0");
				break;
			default:
				cb(undefined);
				break;
			}
		};
	});

	after(function() {
		augur.transact = transact;
		augur.getRepBalance = getRepBalance;
		augur.getRepRedistributionDone = getRepRedistributionDone;
	});

	test({
		description: "Should handle a request to send rep given a JS Number 'value'",
		branch: "2",
		recver: "recipientAddress",
		value: 5,
		onSent: noop,
		onSuccess: function (r) {
			assert.deepEqual(r, { callReturn: "1", from: 'fromAddress' });
		},
		onFailed: failedError,
		successResult: { callReturn: "1", from: 'fromAddress' }
	});
	test({
		description: "Should handle a request to send rep given a String 'value'",
		branch: "2",
		recver: "recipientAddress",
		value: "5",
		onSent: noop,
		onSuccess: function (r) {
			assert.deepEqual(r, { callReturn: "1", from: 'fromAddress' });
		},
		onFailed: noop,
		successResult: { callReturn: "1", from: 'fromAddress' }
	});
	test({
		description: "Should handle a request to send rep given a BigNumber 'value'",
		branch: "2",
		recver: "recipientAddress",
		value: abi.bignum(5),
		onSent: noop,
		onSuccess: function (r) {
			assert.deepEqual(r, { callReturn: "1", from: 'fromAddress' });
		},
		onFailed: failedError,
		successResult: { callReturn: "1", from: 'fromAddress' }
	});
	test({
		description: "Should handle a request to send rep with only 1 large object arg",
		branch: {
			branch: "2",
			recver: "recipientAddress",
			value: "5",
			onSent: noop,
			onSuccess: function (r) {
				assert.deepEqual(r, { callReturn: "1", from: 'fromAddress' });
			},
			onFailed: failedError
		},
		successResult: { callReturn: "1", from: 'fromAddress' }
	});
	test({
		description: "Should handle a request to send rep that requires a retry to send the rep",
		branch: "2",
		recver: "recipientAddress",
		value: 5,
		onSent: noop,
		onSuccess: successError,
		onFailed: failedError,
		successResult: { callReturn: "0", from: 'fromAddress' }
	});
	test({
		description: "Should handle a request to send rep that fails due to not enough rep on the account",
		branch: "2",
		recver: "recipientAddress",
		value: 5,
		onSent: noop,
		onSuccess: successError,
		onFailed: function(e) {
			assert.deepEqual(e, { error: '0', message: 'not enough reputation' });
		},
		successResult: { callReturn: "0", from: 'fromAddress' }
	});
	test({
		description: "Should handle a request to send rep that fails because getRepBalance returns an error",
		branch: "2",
		recver: "recipientAddress",
		value: 5,
		onSent: noop,
		onSuccess: successError,
		onFailed: function(e) {
			assert.deepEqual(e, { error: "-1", message: "There was an issue with getRepBalance()."});
		},
		successResult: { callReturn: "0", from: 'fromAddress' }
	});
	test({
		description: "Should handle a request to send rep that fails because getRepBalance returns undefined",
		branch: "2",
		recver: "recipientAddress",
		value: 5,
		onSent: noop,
		onSuccess: successError,
		onFailed: function(e) {
			assert.deepEqual(e, undefined);
		},
		successResult: { callReturn: "0", from: 'fromAddress' }
	});
	test({
		description: "Should handle a request to send rep that fails because repRedistribution is not complete.",
		branch: "2",
		recver: "recipientAddress",
		value: 5,
		onSent: noop,
		onSuccess: successError,
		onFailed: function(e) {
			assert.deepEqual(e, {error: "-3", message: "cannot send reputation until redistribution is complete"});
		},
		successResult: { callReturn: "0", from: 'fromAddress' }
	});
	test({
		description: "Should handle a request to send rep that fails because repRedistributionDone returns undefined.",
		branch: "2",
		recver: "recipientAddress",
		value: 5,
		onSent: noop,
		onSuccess: successError,
		onFailed: function(e) {
			assert.deepEqual(e, {error: "-3", message: "cannot send reputation until redistribution is complete"});
		},
		successResult: { callReturn: "0", from: 'fromAddress' }
	});
});
