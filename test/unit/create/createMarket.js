"use strict";

var assert = require('chai').assert;
var utils = require('../../../src/utilities.js');
var abi = require("augur-abi");
var augur = require('../../../src/');
var transact;
// 6 tests total

describe("createMarket.createEvent", function() {
	// 3 tests total
	var test = function(t) {
		it(t.testDescription, function() {
			t.assertions(augur.createEvent(t.branchId, t.description, t.expDate, t.minValue, t.maxValue, t.numOutcomes, t.resolution, t.onSent, t.onSuccess, t.onFailed));
		});
	};

	before(function() {
		augur.transact = transact;
		augur.transact = function(tx, onSent, onSuccess, onFailed) {
			assert.isFunction(onSent);
			assert.isFunction(onSuccess);
			assert.isFunction(onFailed);
			// return tx to be tested by the t.assertions function of each test call
			return tx;
		};
	});

	after(function() {
		augur.transact = transact;
	});

	test({
		testDescription: "Should handle a createEvent call",
		branchId: '010101',
		description: 'This is a test event description',
		expDate: 1500000000,
		minValue: '1',
		maxValue: '2',
		numOutcomes: '2',
		resolution: 'https://iknoweverything.com',
		onSent: utils.noop,
		onSuccess: utils.noop,
		onFailed: utils.noop,
		assertions: function(out) {
			assert.deepEqual(out.to, augur.tx.CreateMarket.createEvent.to);
			assert.deepEqual(out.params, ['010101', 'This is a test event description', 1500000000, '0xde0b6b3a7640000', '0x1bc16d674ec80000', '2', 'https://iknoweverything.com']);
			assert.deepEqual(out.label, 'Create Event');
			assert.deepEqual(out.method, 'createEvent');
			assert.deepEqual(out.description, 'This is a test event description');
		}
	});
	test({
		testDescription: "Should handle a createEvent call with space padded description and resolution",
		branchId: '010101',
		description: '        This is a test event description',
		expDate: 1500000000,
		minValue: '1',
		maxValue: '2',
		numOutcomes: '2',
		resolution: '     https://iknoweverything.com',
		onSent: utils.noop,
		onSuccess: utils.noop,
		onFailed: utils.noop,
		assertions: function(out) {
			assert.deepEqual(out.to, augur.tx.CreateMarket.createEvent.to);
			assert.deepEqual(out.params, ['010101', 'This is a test event description', 1500000000, '0xde0b6b3a7640000', '0x1bc16d674ec80000', '2', 'https://iknoweverything.com']);
			assert.deepEqual(out.label, 'Create Event');
			assert.deepEqual(out.method, 'createEvent');
			assert.deepEqual(out.description, 'This is a test event description');
		}
	});
	test({
		testDescription: "Should handle a createEvent call with one argument object",
		branchId: {
			branchId: '010101',
			description: '        This is a test event description',
			expDate: 1500000000,
			minValue: '1',
			maxValue: '5',
			numOutcomes: '5',
			resolution: '     https://iknowmostthings.com',
			onSent: utils.noop,
			onSuccess: utils.noop,
			onFailed: utils.noop,
		},
		assertions: function(out) {
			assert.deepEqual(out.to, augur.tx.CreateMarket.createEvent.to);
			assert.deepEqual(out.params, ['010101', 'This is a test event description', 1500000000, '0xde0b6b3a7640000', '0x4563918244f40000', '5', 'https://iknowmostthings.com']);
			assert.deepEqual(out.label, 'Create Event');
			assert.deepEqual(out.method, 'createEvent');
			assert.deepEqual(out.description, 'This is a test event description');
		}
	});
});

describe("createMarket.updateTradingFee", function() {
	// 3 tests total
	var currentAssertions;
	var test = function(t) {
		it(t.testDescription, function() {
			currentAssertions = t.assertions;
			augur.updateTradingFee(t.branchId, t.market, t.takerFee, t.makerFee, t.onSent, t.onSuccess, t.onFailed);
		});
	};

	before(function() {
		augur.transact = transact;
		augur.transact = function(tx, onSent, onSuccess, onFailed) {
			// if onSent is defined then callbacks where passed, check that they are functions.
			if (onSent) {
				assert.isFunction(onSent);
				assert.isFunction(onSuccess);
				assert.isFunction(onFailed);
			}
			// pass transaction object to assertions
			currentAssertions(tx);
		};
	});

	after(function() {
		augur.transact = transact;
	});

	test({
		testDescription: 'Should be able to send an updateTradingFee transaction',
		assertions: function(out) {
			assert.deepEqual(out.to, augur.tx.CreateMarket.updateTradingFee.to);
			assert.deepEqual(out.label, 'Update Trading Fee');
			assert.deepEqual(out.method, 'updateTradingFee');
			assert.deepEqual(out.params, ['010101', 'someFakeMarketID', '0x470de4df820000', '0x6f05b59d3b20000']);
		},
		branchId: '010101',
		market: 'someFakeMarketID',
		takerFee: 0.02,
		makerFee: 0.01,
		onSent: utils.noop,
		onSuccess: utils.noop,
		onFailed: utils.noop
	});

	test({
		testDescription: 'Should be able to send an updateTradingFee transaction as one object',
		assertions: function(out) {
			assert.deepEqual(out.to, augur.tx.CreateMarket.updateTradingFee.to);
			assert.deepEqual(out.label, 'Update Trading Fee');
			assert.deepEqual(out.method, 'updateTradingFee');
			assert.deepEqual(out.params, ['010101', 'someFakeMarketID', '0x470de4df820000', '0x6f05b59d3b20000']);
		},
		branchId: {
			branchId: '010101',
			market: 'someFakeMarketID',
			takerFee: 0.02,
			makerFee: 0.01,
			onSent: utils.noop,
			onSuccess: utils.noop,
			onFailed: utils.noop
		}
	});

	test({
		testDescription: 'Should be able to send an updateTradingFee transaction without passing callbacks',
		assertions: function(out) {
			assert.deepEqual(out.to, augur.tx.CreateMarket.updateTradingFee.to);
			assert.deepEqual(out.label, 'Update Trading Fee');
			assert.deepEqual(out.method, 'updateTradingFee');
			assert.deepEqual(out.params, ['010101', 'someFakeMarketID', '0x470de4df820000', '0x6f05b59d3b20000']);
		},
		branchId: {
			branchId: '010101',
			market: 'someFakeMarketID',
			takerFee: 0.02,
			makerFee: 0.01,
		}
	});
});
