"use strict";

var assert = require("chai").assert;
var augur = require("../../../src");
var abi = require("augur-abi");
var utils = require("../../../src/utilities");

describe("cash", function() {
	// 9 total tests
	function noop() {};
	var transact = augur.transact;

	describe("sendEther", function() {
		// 6 total tests
		var test = function(t) {
			it(t.description, function() {
				t.assertions(augur.sendEther(t.to, t.value, t.from, t.onSent, t.onSuccess, t.onFailed));
			});
		};

		before(function() {
			augur.transact = function (tx, onSent, onSuccess, onFailed, onConfirmed) {
				assert.deepEqual(onSent, utils.noop);
				assert.deepEqual(onSuccess, utils.noop);
				assert.deepEqual(onFailed, utils.noop)
				// currently never gets passed onConfirmed...
				return tx;
			};
		});

		after(function() {
			augur.transact = transact;
		});

		test({
			to: 'toAddress',
			value: '10',
			from: 'fromAddress',
			onSent: utils.noop,
			onSuccess: utils.noop,
			onFailed: utils.noop,
			description: "handles a string input for value",
			assertions: function(out) {
				assert.deepEqual(out.from, 'fromAddress');
				assert.deepEqual(out.to, 'toAddress');
				assert.deepEqual(out.value, '0x8ac7230489e80000');
				assert.deepEqual(out.gas, '0xcf08');
				assert.deepEqual(out.returns, "null");
			}
		});
		test({
			to: 'toAddress',
			value: 25,
			from: 'fromAddress',
			onSent: utils.noop,
			onSuccess: utils.noop,
			onFailed: utils.noop,
			description: "handles a JS Number input for value",
			assertions: function(out) {
				assert.deepEqual(out.from, 'fromAddress');
				assert.deepEqual(out.to, 'toAddress');
				assert.deepEqual(out.value, '0x15af1d78b58c40000');
				assert.deepEqual(out.gas, '0xcf08');
				assert.deepEqual(out.returns, "null");
			}
		});
		test({
			to: 'toAddress',
			value: abi.bignum(215.02345),
			from: 'fromAddress',
			onSent: utils.noop,
			onSuccess: utils.noop,
			onFailed: utils.noop,
			description: "handles a Big Number input for value",
			assertions: function(out) {
				assert.deepEqual(out.from, 'fromAddress');
				assert.deepEqual(out.to, 'toAddress');
				assert.deepEqual(out.value, '0xba80cc0882cf7a000');
				assert.deepEqual(out.gas, '0xcf08');
				assert.deepEqual(out.returns, "null");
			}
		});
		test({
			to: {
				to: 'toAddress',
				value: '8.027033',
				from: 'fromAddress',
				onSent: utils.noop,
				onSuccess: utils.noop,
				onFailed: utils.noop,
			},
			description: "handles a string input for value, args passed as single arg object",
			assertions: function(out) {
				assert.deepEqual(out.from, 'fromAddress');
				assert.deepEqual(out.to, 'toAddress');
				assert.deepEqual(out.value, '0x6f65bffc05569000');
				assert.deepEqual(out.gas, '0xcf08');
				assert.deepEqual(out.returns, "null");
			}
		});
		test({
			to: {
				to: 'toAddress',
				value: 47,
				from: 'fromAddress',
				onSent: utils.noop,
				onSuccess: utils.noop,
				onFailed: utils.noop,
			},
			description: "handles a JS Number input for value, args passed as single arg object",
			assertions: function(out) {
				assert.deepEqual(out.from, 'fromAddress');
				assert.deepEqual(out.to, 'toAddress');
				assert.deepEqual(out.value, '0x28c418afbbb5c0000');
				assert.deepEqual(out.gas, '0xcf08');
				assert.deepEqual(out.returns, "null");
			}
		});
		test({
			to: {
				to: 'toAddress',
				value: abi.bignum(9.005),
				from: 'fromAddress',
				onSent: utils.noop,
				onSuccess: utils.noop,
				onFailed: utils.noop,
			},
			description: "handles a Big Number input for value, args passed as single arg object",
			assertions: function(out) {
				assert.deepEqual(out.from, 'fromAddress');
				assert.deepEqual(out.to, 'toAddress');
				assert.deepEqual(out.value, '0x7cf82fca1a648000');
				assert.deepEqual(out.gas, '0xcf08');
				assert.deepEqual(out.returns, "null");
			}
		});
	});

	describe("depositEther", function() {
		// 3 total tests
		var test = function(t) {
			it(t.description, function() {
				t.assertions(augur.depositEther(t.to, t.value, t.from, t.onSent, t.onSuccess, t.onFailed));
			});
		};

		before(function() {
			augur.transact = function (tx, onSent, onSuccess, onFailed, onConfirmed) {
				assert.deepEqual(onSent, utils.noop);
				assert.deepEqual(onSuccess, utils.noop);
				assert.deepEqual(onFailed, utils.noop)
				// currently never gets passed onConfirmed...
				return tx;
			};
		});

		after(function() {
			augur.transact = transact;
		});

		test({
			value: 100.19530,
			onSent: utils.noop,
			onSuccess: utils.noop,
			onFailed: utils.noop,
			description: "depositeEther with a JS Number input for value",
			assertions: function(out) {
				assert.deepEqual(out.method, 'depositEther');
				assert.deepEqual(out.returns, 'number');
				assert.deepEqual(out.send, true);
				assert.deepEqual(out.to, '0xa470f24e2f44b1373a201b8b876361352a5044ca');
				assert.deepEqual(out.value, '0x56e7d367e17b24000');
			}
		});
		test({
			value: '73.239003',
			onSent: utils.noop,
			onSuccess: utils.noop,
			onFailed: utils.noop,
			description: "depositeEther with a String input for value",
			assertions: function(out) {
				assert.deepEqual(out.method, 'depositEther');
				assert.deepEqual(out.returns, 'number');
				assert.deepEqual(out.send, true);
				assert.deepEqual(out.to, '0xa470f24e2f44b1373a201b8b876361352a5044ca');
				assert.deepEqual(out.value, '0x3f86535310ec4b000');
			}
		});
		test({
			value: abi.bignum('88.323332'),
			onSent: utils.noop,
			onSuccess: utils.noop,
			onFailed: utils.noop,
			description: "depositeEther with a Big Number input for value",
			assertions: function(out) {
				assert.deepEqual(out.method, 'depositEther');
				assert.deepEqual(out.returns, 'number');
				assert.deepEqual(out.send, true);
				assert.deepEqual(out.to, '0xa470f24e2f44b1373a201b8b876361352a5044ca');
				assert.deepEqual(out.value, '0x4c9bb827f36e44000');
			}
		});
	});
	// getCashBalance, sendCash, sendCashFrom are straight forward pass through functions and probably don't need unit tests.
});
