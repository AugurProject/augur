"use strict";

var assert = require('chai').assert;
var augur = require('../../../src');
var utils = require("../../../src/utilities");
var abi = require("augur-abi");
// 34 tests total

describe("logs.parseShortSellLogs", function() {
	// 3 tests total
	var test = function(t) {
		it(t.description, function() {
			t.assertions(augur.parseShortSellLogs(t.logs, t.isMaker));
		});
	};

	test({
		description: 'Should handle one log in the logs argument array.',
		logs: [{
			data: [ abi.fix('100'), abi.fix('10'), '0x00a1', '1' ],
			topics: ['0x00d1', '0x00c1'],
			blockNumber: '010101'
		}],
		isMaker: false,
		assertions: function(o) {
			assert.deepEqual(o, {
				'0x00c1': {
					'1': [{
						type: 'sell',
						price: '100',
						amount: '10',
						tradeid: '0x00a1',
						blockNumber: 65793,
						maker: false
					}]
				}
			});
		}
	});

	test({
		description: 'Should handle multiple logs in the logs argument array.',
		logs: [{
			data: [ abi.fix('23.34'), abi.fix('3'), '0x00a1', '1' ],
			topics: ['0x00d1', '0x00c1'],
			blockNumber: '010101'
		},
		{
			data: [ abi.fix('92.00334'), abi.fix('17'), '0x00a2', '2' ],
			topics: ['0x00d2', '0x00c2'],
			blockNumber: '010101'
		},
		{
			data: [ abi.fix('45.34'), abi.fix('5'), '0x00a3', '1' ],
			topics: ['0x00d3', '0x00c3'],
			blockNumber: '010101'
		}],
		isMaker: false,
		assertions: function(o) {
			assert.deepEqual(o, {
				'0x00c1': {
					'1': [{
						type: 'sell',
						price: '23.34',
						amount: '3',
						tradeid: '0x00a1',
						blockNumber: 65793,
						maker: false
					}]
				},
				'0x00c2': {
					'2': [{
						type: 'sell',
						price: '92.00334',
						amount: '17',
						tradeid: '0x00a2',
						blockNumber: 65793,
						maker: false
					}]
				},
				'0x00c3': {
					'1': [{
						type: 'sell',
						price: '45.34',
						amount: '5',
						tradeid: '0x00a3',
						blockNumber: 65793,
						maker: false
					}]
				}
			});
		}
	});

	test({
		description: 'Should handle multiple logs in the logs argument array where some of the logs should be skipped.',
		logs: [{
			data: [ abi.fix('9384'), abi.fix('200'), '0x00a1', '1' ],
			topics: ['0x00d1', '0x00c1'],
			blockNumber: '010101'
		},
		{
			data: '0x',
			topics: ['0x00d2', '0x00c2'],
			blockNumber: '010101'
		},
		{
			data: [ abi.fix('7384.32993'), abi.fix('53'), '0x00a3', '1' ],
			topics: ['0x00d3', '0x00c3'],
			blockNumber: '010101'
		}],
		isMaker: true,
		assertions: function(o) {
			assert.deepEqual(o, {
				'0x00c1': {
					'1': [{
						type: 'sell',
						price: '9384',
						amount: '200',
						tradeid: '0x00a1',
						blockNumber: 65793,
						maker: true
					}]
				},
				'0x00c3': {
					'1': [{
						type: 'sell',
						price: '7384.32993',
						amount: '53',
						tradeid: '0x00a3',
						blockNumber: 65793,
						maker: true
					}]
				}
			});
		}
	});
});

describe("logs.parseCompleteSetsLogs", function() {
	// 6 tests total
	var test = function(t) {
		it(t.description, function() {
			t.assertions(augur.parseCompleteSetsLogs(t.logs, t.mergeInto));
		});
	};

	test({
		description: 'Should handle one log in the logs argument array without passing a mergeInto argument.',
		logs: [{
			data: [ abi.fix('100'), '2' ],
			topics: ['0x00a1', '0x00b1', '0x00c1', '1'],
			blockNumber: '010101'
		}],
		mergeInto: undefined,
		assertions: function(o) {
			assert.deepEqual(o, {
				'0x00c1': [{
					amount: '100',
					blockNumber: 65793,
					numOutcomes: 2,
					type: 'buy'
				}]
			});
		}
	});

	test({
		description: 'Should handle multiple logs in the logs argument array without passing a mergeInto argument.',
		logs: [{
			data: [ abi.fix('100'), '2' ],
			topics: ['0x00a1', '0x00b1', '0x00c1', '1'],
			blockNumber: '010101'
		},
		{
			data: [ abi.fix('43'), '2' ],
			topics: ['0x00a1', '0x00b1', '0x00c1', '1'],
			blockNumber: '010101'
		},
		{
			data: [ abi.fix('985.23'), '2' ],
			topics: ['0x00a1', '0x00b1', '0x00c1', '1'],
			blockNumber: '010101'
		}],
		mergeInto: undefined,
		assertions: function(o) {
			assert.deepEqual(o, {
				'0x00c1': [{
					amount: '100',
					blockNumber: 65793,
					numOutcomes: 2,
					type: 'buy'
				},{
					amount: '43',
					blockNumber: 65793,
					numOutcomes: 2,
					type: 'buy'
				},{
					amount: '985.23',
					blockNumber: 65793,
					numOutcomes: 2,
					type: 'buy'
				}],
			});
		}
	});

	test({
		description: 'Should handle multiple logs in the logs argument array without passing a mergeInto argument and given multiple markets.',
		logs: [{
			data: [ abi.fix('100'), '2' ],
			topics: ['0x00a1', '0x00b1', '0x00c1', '1'],
			blockNumber: '010101'
		},
		{
			data: [ abi.fix('43'), '2' ],
			topics: ['0x00a1', '0x00b1', '0x00c1', '1'],
			blockNumber: '010101'
		},
		{
			data: [ abi.fix('985.23'), '2' ],
			topics: ['0x00a1', '0x00b1', '0x00c1', '1'],
			blockNumber: '010101'
		},
		{
			data: "0x",
			topics: ['0x00a1', '0x00b1', '0x00c1', '1'],
			blockNumber: '010101'
		},
		{
			data: [ abi.fix('3245.22'), '5' ],
			topics: ['0x00a1', '0x00b1', '0x00c2', '2'],
			blockNumber: '010101'
		},
		{
			data: "0x",
			topics: ['0x00a1', '0x00b1', '0x00c2', '2'],
			blockNumber: '010101'
		},
		{
			data: [ abi.fix('940'), '5' ],
			topics: ['0x00a1', '0x00b1', '0x00c2', '2'],
			blockNumber: '010101'
		},
		{
			data: [ abi.fix('15.0203'), '5' ],
			topics: ['0x00a1', '0x00b1', '0x00c2', '2'],
			blockNumber: '010101'
		}],
		mergeInto: undefined,
		assertions: function(o) {
			assert.deepEqual(o, {
				'0x00c1': [{
					amount: '100',
					blockNumber: 65793,
					numOutcomes: 2,
					type: 'buy'
				},{
					amount: '43',
					blockNumber: 65793,
					numOutcomes: 2,
					type: 'buy'
				},{
					amount: '985.23',
					blockNumber: 65793,
					numOutcomes: 2,
					type: 'buy'
				}],
				'0x00c2': [{
					amount: '3245.22',
					blockNumber: 65793,
					numOutcomes: 5,
					type: 'sell'
				},{
					amount: '940',
					blockNumber: 65793,
					numOutcomes: 5,
					type: 'sell'
				},{
					amount: '15.0203',
					blockNumber: 65793,
					numOutcomes: 5,
					type: 'sell'
				}],
			});
		}
	});

	test({
		description: 'Should handle one log in the logs argument array while also passing a mergeInto argument.',
		logs: [{
			data: [ abi.fix('100'), '2' ],
			topics: ['0x00a1', '0x00b1', '0x00c1', '1'],
			blockNumber: '010101'
		}],
		mergeInto: {
			'0x00c1': [{
				amount: '5',
				blockNumber: 65793,
				numOutcomes: 2,
				type: 'buy'
			}]
		},
		assertions: function(o) {
			assert.deepEqual(o, {
				'0x00c1': [
					{
						amount: '5',
						blockNumber: 65793,
						numOutcomes: 2,
						type: 'buy'
					},
					[{
						amount: '100',
						blockNumber: 65793,
						isCompleteSet: true,
						price: '0.5',
						type: 'buy'
					}],
					[{
						amount: '100',
						blockNumber: 65793,
						isCompleteSet: true,
						price: '0.5',
						type: 'buy'
					}]
				]
			});
		}
	});

	test({
		description: 'Should handle multiple logs in the logs argument array while also passing a mergeInto argument.',
		logs: [{
			data: [ abi.fix('100'), '2' ],
			topics: ['0x00a1', '0x00b1', '0x00c1', '1'],
			blockNumber: '010101'
		},
		{
			data: [ abi.fix('234'), '4' ],
			topics: ['0x00a2', '0x00b2', '0x00c2', '2'],
			blockNumber: '010101'
		}],
		mergeInto: {
			'0x00c1': [{
				amount: '50',
				blockNumber: 65793,
				numOutcomes: 2,
				type: 'buy'
			}],
			'0x00c2': [{
				amount: '120',
				blockNumber: 65793,
				numOutcomes: 4,
				type: 'sell'
			}]
		},
		assertions: function(o) {
			assert.deepEqual(o, {
				'0x00c1': [
					{
						amount: '50',
						blockNumber: 65793,
						numOutcomes: 2,
						type: 'buy'
					},
					[{
						amount: '100',
						blockNumber: 65793,
						isCompleteSet: true,
						price: '0.5',
						type: 'buy'
					}],
					[{
						amount: '100',
						blockNumber: 65793,
						isCompleteSet: true,
						price: '0.5',
						type: 'buy'
					}]
				],
				'0x00c2': [
					{
						amount: '120',
						blockNumber: 65793,
						numOutcomes: 4,
						type: 'sell'
					},
					[{
						amount: '234',
						blockNumber: 65793,
						isCompleteSet: true,
						price: '0.25',
						type: 'sell'
					}],
					[{
						amount: '234',
						blockNumber: 65793,
						isCompleteSet: true,
						price: '0.25',
						type: 'sell'
					}],
					[{
						amount: '234',
						blockNumber: 65793,
						isCompleteSet: true,
						price: '0.25',
						type: 'sell'
					}],
					[{
						amount: '234',
						blockNumber: 65793,
						isCompleteSet: true,
						price: '0.25',
						type: 'sell'
					}]
				]
			});
		}
	});
});

describe("logs.getMarketPriceHistory", function() {
	// 3 tests total
	var test = function(t) {
		it(t.description, function() {
			var getLogs = augur.getLogs;
			augur.getLogs = t.getLogs;

			t.assertions(augur.getMarketPriceHistory(t.market, t.options, t.callback));

			augur.getLogs = getLogs;
		});
	};

	test({
		description: 'Should pass the market merged with the options arg to getLogs',
		market: '0x00a1',
		options: { test: 'hello world' },
		callback: utils.noop,
		getLogs: function(type, params, index, callback) {
			return params;
		},
		assertions: function(o) {
			assert.deepEqual(o, { test: 'hello world', market: '0x00a1' });
		}
	});

	test({
		description: 'Should pass the market as the params if options is undefined',
		market: '0x00a1',
		options: undefined,
		callback: utils.noop,
		getLogs: function(type, params, index, callback) {
			return params;
		},
		assertions: function(o) {
			assert.deepEqual(o, { market: '0x00a1' });
		}
	});

	test({
		description: 'Should be able to be passed just market and cb and still handle the request',
		market: '0x00a1',
		options: utils.noop,
		callback: undefined,
		getLogs: function(type, params, index, callback) {
			return params;
		},
		assertions: function(o) {
			assert.deepEqual(o, { market: '0x00a1' });
		}
	});
});

describe("logs.getShortSellLogs", function() {
	// 6 tests total
	var test = function(t) {
		it(t.description, function() {
			var getLogs = augur.rpc.getLogs;
			augur.rpc.getLogs = t.getLogs;

			t.assertions(augur.getShortSellLogs(t.account, t.options, t.callback));

			augur.rpc.getLogs = getLogs;
		});
	};

	test({
		description: 'Should handle an empty options object as well as no callback passed',
		account: '0x02a32d32ca2b37495839dd932c9e92fea10cba12',
		options: {},
		callback: undefined,
		getLogs: function(filter) { return filter; },
		assertions: function(o) {
			assert.deepEqual(o, {
				fromBlock: augur.constants.GET_LOGS_DEFAULT_FROM_BLOCK,
				toBlock: augur.constants.GET_LOGS_DEFAULT_TO_BLOCK,
				address: augur.contracts.Trade,
				topics: [augur.api.events.log_short_fill_tx.signature, null, '0x00000000000000000000000002a32d32ca2b37495839dd932c9e92fea10cba12', null],
				timeout: augur.constants.GET_LOGS_TIMEOUT
			});
 		}
	});

	test({
		description: 'Should handle options object where maker is false no callback passed',
		account: '0x02a32d32ca2b37495839dd932c9e92fea10cba12',
		options: { maker: false, market: '0x0a1', fromBlock: '0x0b1', toBlock: '0x0c1' },
		callback: undefined,
		getLogs: function(filter) { return filter; },
		assertions: function(o) {
			assert.deepEqual(o, {
				fromBlock: '0x0b1',
				toBlock: '0x0c1',
				address: augur.contracts.Trade,
				topics: [augur.api.events.log_short_fill_tx.signature, '0x00000000000000000000000000000000000000000000000000000000000000a1', '0x00000000000000000000000002a32d32ca2b37495839dd932c9e92fea10cba12', null],
				timeout: augur.constants.GET_LOGS_TIMEOUT
			});
 		}
	});

	test({
		description: 'Should handle options object where maker is true there is a callback passed and getLogs returns logs without an error',
		account: '0x02a32d32ca2b37495839dd932c9e92fea10cba12',
		options: { maker: true, market: '0x0a1', fromBlock: '0x0b1', toBlock: '0x0c1' },
		callback: function(err, logs) {
			assert.isNull(err);
			assert.deepEqual(logs[0], {
				fromBlock: '0x0b1',
				toBlock: '0x0c1',
				address: augur.contracts.Trade,
				topics: [augur.api.events.log_short_fill_tx.signature, '0x00000000000000000000000000000000000000000000000000000000000000a1', null, '0x00000000000000000000000002a32d32ca2b37495839dd932c9e92fea10cba12'],
				timeout: augur.constants.GET_LOGS_TIMEOUT
			});
		},
		getLogs: function(filter, cb) {
			// going to simply return filters in an array to represent "logs" since the logs aren't important to this function.
			cb([filter]);
		},
		assertions: function(o) {
			// assertions for this test are fround in the callback function above.
 		}
	});

	test({
		description: 'Should handle options object where maker is true there is a callback passed and getLogs returns logs with an error',
		account: '0x02a32d32ca2b37495839dd932c9e92fea10cba12',
		options: { maker: true, market: '0x0a1', fromBlock: '0x0b1', toBlock: '0x0c1' },
		callback: function(err, logs) {
			assert.deepEqual(err, {
				error: 'this is an error message.'
			});
			assert.isNull(logs);
		},
		getLogs: function(filter, cb) {
			// going to simply return filters in an array to represent "logs" since the logs aren't important to this function.
			cb({ error: 'this is an error message.' });
		},
		assertions: function(o) {
			// assertions for this test are fround in the callback function above.
 		}
	});

	test({
		description: 'Should handle options object where maker is true there is a callback passed and getLogs returns logs as undefined',
		account: '0x02a32d32ca2b37495839dd932c9e92fea10cba12',
		options: { maker: true, market: '0x0a1', fromBlock: '0x0b1', toBlock: '0x0c1' },
		callback: function(err, logs) {
			assert.isNull(err)
			assert.deepEqual(logs, []);
		},
		getLogs: function(filter, cb) {
			// going to simply return filters in an array to represent "logs" since the logs aren't important to this function.
			cb(undefined);
		},
		assertions: function(o) {
			// assertions for this test are fround in the callback function above.
 		}
	});

	test({
		description: 'Should handle a callback passed in the options slot and getLogs returns logs without an error',
		account: '0x02a32d32ca2b37495839dd932c9e92fea10cba12',
		options: function(err, logs) {
			assert.isNull(err);
			assert.deepEqual(logs[0], {
				fromBlock: augur.constants.GET_LOGS_DEFAULT_FROM_BLOCK,
				toBlock: augur.constants.GET_LOGS_DEFAULT_TO_BLOCK,
				address: augur.contracts.Trade,
				topics: [augur.api.events.log_short_fill_tx.signature, null, '0x00000000000000000000000002a32d32ca2b37495839dd932c9e92fea10cba12', null],
				timeout: augur.constants.GET_LOGS_TIMEOUT
			});
		},
		callback: undefined,
		getLogs: function(filter, cb) {
			// going to simply return filters in an array to represent "logs" since the logs aren't important to this function.
			cb([filter]);
		},
		assertions: function(o) {
			// assertions for this test are fround in the callback function above.
 		}
	});
});

describe("logs.getCompleteSetsLogs", function() {
	// 7 tests total
	var test = function(t) {
		it(t.description, function() {
			var getLogs = augur.rpc.getLogs;
			augur.rpc.getLogs = t.getLogs;

			t.assertions(augur.getCompleteSetsLogs(t.account, t.options, t.callback));

			augur.rpc.getLogs = getLogs;
		});
	};

	test({
		description: 'Should handle no options, no callback',
		account: '0x02a32d32ca2b37495839dd932c9e92fea10cba12',
		options: undefined,
		callback: undefined,
		getLogs: function(filters) {
			return filters;
		},
		assertions: function(o) {
			assert.deepEqual(o, {
				fromBlock: augur.constants.GET_LOGS_DEFAULT_FROM_BLOCK,
				toBlock: augur.constants.GET_LOGS_DEFAULT_TO_BLOCK,
				address: augur.contracts.CompleteSets,
				topics: [
					augur.api.events.completeSets_logReturn.signature,
					'0x00000000000000000000000002a32d32ca2b37495839dd932c9e92fea10cba12',
					null,
					null
				],
				timeout: augur.constants.GET_LOGS_TIMEOUT
			});
		}
	});

	test({
		description: 'Should handle options with shortAsk true but no market or type, no callback',
		account: '0x02a32d32ca2b37495839dd932c9e92fea10cba12',
		options: { shortAsk: true, fromBlock: '0x0b1', toBlock: '0x0b2'},
		callback: undefined,
		getLogs: function(filters) {
			return filters;
		},
		assertions: function(o) {
			assert.deepEqual(o, {
				fromBlock: '0x0b1',
				toBlock: '0x0b2',
				address: augur.contracts.BuyAndSellShares,
				topics: [
					augur.api.events.completeSets_logReturn.signature,
					'0x00000000000000000000000002a32d32ca2b37495839dd932c9e92fea10cba12',
					null,
					null
				],
				timeout: augur.constants.GET_LOGS_TIMEOUT
			});
		}
	});

	test({
		description: 'Should handle options with shortAsk true, market, and type, no callback',
		account: '0x02a32d32ca2b37495839dd932c9e92fea10cba12',
		options: { shortAsk: true, fromBlock: '0x0b1', toBlock: '0x0b2', type: 'buy', market: '0x0a1' },
		callback: undefined,
		getLogs: function(filters) {
			return filters;
		},
		assertions: function(o) {
			assert.deepEqual(o, {
				fromBlock: '0x0b1',
				toBlock: '0x0b2',
				address: augur.contracts.BuyAndSellShares,
				topics: [
					augur.api.events.completeSets_logReturn.signature,
					'0x00000000000000000000000002a32d32ca2b37495839dd932c9e92fea10cba12',
					'0x00000000000000000000000000000000000000000000000000000000000000a1',
					'0x0000000000000000000000000000000000000000000000000000000000000001'
				],
				timeout: augur.constants.GET_LOGS_TIMEOUT
			});
		}
	});

	test({
		description: 'Should handle options with shortAsk false, market, and type, no callback',
		account: '0x02a32d32ca2b37495839dd932c9e92fea10cba12',
		options: { shortAsk: false, fromBlock: '0x0b1', toBlock: '0x0b2', type: 'buy', market: '0x0a1' },
		callback: undefined,
		getLogs: function(filters) {
			return filters;
		},
		assertions: function(o) {
			assert.deepEqual(o, {
				fromBlock: '0x0b1',
				toBlock: '0x0b2',
				address: augur.contracts.CompleteSets,
				topics: [
					augur.api.events.completeSets_logReturn.signature,
					'0x00000000000000000000000002a32d32ca2b37495839dd932c9e92fea10cba12',
					'0x00000000000000000000000000000000000000000000000000000000000000a1',
					'0x0000000000000000000000000000000000000000000000000000000000000001'
				],
				timeout: augur.constants.GET_LOGS_TIMEOUT
			});
		}
	});

	test({
		description: 'Should handle options with shortAsk false, market, and type, and a callback',
		account: '0x02a32d32ca2b37495839dd932c9e92fea10cba12',
		options: { shortAsk: false, fromBlock: '0x0b1', toBlock: '0x0b2', type: 'sell', market: '0x0a1' },
		callback: function(err, logs) {
			assert.isNull(err);
			assert.deepEqual(logs[0], {
				fromBlock: '0x0b1',
				toBlock: '0x0b2',
				address: augur.contracts.CompleteSets,
				topics: [
					augur.api.events.completeSets_logReturn.signature,
					'0x00000000000000000000000002a32d32ca2b37495839dd932c9e92fea10cba12',
					'0x00000000000000000000000000000000000000000000000000000000000000a1',
					'0x0000000000000000000000000000000000000000000000000000000000000002'
				],
				timeout: augur.constants.GET_LOGS_TIMEOUT
			});
		},
		getLogs: function(filters, cb) {
			// simply return the filters in an array so we can test that we sent the expected filters to getLogs.
			cb([filters]);
		},
		assertions: function(o) {
			// callback above will work as the assertion for this test
		}
	});

	test({
		description: 'Should handle options with a callback when logs returns an error object',
		account: '0x02a32d32ca2b37495839dd932c9e92fea10cba12',
		options: { shortAsk: false, fromBlock: '0x0b1', toBlock: '0x0b2', type: 'buy', market: '0x0a1' },
		callback: function(err, logs) {
			assert.isNull(logs);
			assert.deepEqual(err, { error: 'this is an error!' });
		},
		getLogs: function(filters, cb) {
			cb({ error: 'this is an error!' });
		},
		assertions: function(o) {
			// callback above will work as the assertion for this test
		}
	});

	test({
		description: 'Should handle options with a callback but getLogs returns undefined',
		account: '0x02a32d32ca2b37495839dd932c9e92fea10cba12',
		options: { shortAsk: false, fromBlock: '0x0b1', toBlock: '0x0b2', type: 'buy', market: '0x0a1' },
		callback: function(err, logs) {
			assert.isNull(err);
			assert.deepEqual(logs, []);
		},
		getLogs: function(filters, cb) {
			cb(undefined);
		},
		assertions: function(o) {
			// callback above will work as the assertion for this test
		}
	});
});

describe("logs.sortByBlockNumber", function() {
	// 4 tests total
	var test = function(t) {
		it(t.description, function() {
			t.assertions(augur.sortByBlockNumber(t.a, t.b));
		});
	};

	test({
		description: 'should sort 2 numbers sent as Strings',
		a: { blockNumber: '3' },
		b: { blockNumber: '2' },
		assertions: function(o) {
			assert.equal(o, '1');
		}
	});

	test({
		description: 'should sort 2 numbers sent as JS Numbers',
		a: { blockNumber: 50 },
		b: { blockNumber: 3 },
		assertions: function(o) {
			assert.equal(o, 47);
		}
	});

	test({
		description: 'should sort 2 numbers sent as Hex Strings',
		a: { blockNumber: '0x01' },
		b: { blockNumber: '0x05' },
		assertions: function(o) {
			assert.equal(o, -4);
		}
	});

	test({
		description: 'should sort 2 numbers sent as Big Numbers',
		a: { blockNumber: abi.bignum('25') },
		b: { blockNumber: abi.bignum('3') },
		assertions: function(o) {
			assert.equal(o, 22);
		}
	});
});

describe("logs.buildTopicsList", function() {
	// 3 tests total
	var test = function(t) {
		it(t.description, function() {
			t.assertions(augur.buildTopicsList(t.event, t.params));
		});
	};

	test({
		description: 'should handle an event with a single input',
		event: { signature: augur.api.events.completeSets_logReturn.signature, inputs: [{ name: 'amount', indexed: true }]},
		params: { amount: '50' },
		assertions: function(o) {
			assert.deepEqual(o, [ '0x59193f204bd4754cff0e765b9ee9157305fb373586ec5d680b49e6341ef922a6' , '0x0000000000000000000000000000000000000000000000000000000000000050']);
		}
	});

	test({
		description: 'should handle an event with a multiple inputs, some indexed some not',
		event: { signature: augur.api.events.completeSets_logReturn.signature, inputs: [{ name: 'amount', indexed: true }, { name: 'unindexed', indexed: false }, { name: 'shares', indexed: true } ]},
		params: { amount: '50', unindexed: 'this shouldnt be in the topics array out', shares: '10' },
		assertions: function(o) {
			assert.deepEqual(o, [ '0x59193f204bd4754cff0e765b9ee9157305fb373586ec5d680b49e6341ef922a6' , '0x0000000000000000000000000000000000000000000000000000000000000050',
			'0x0000000000000000000000000000000000000000000000000000000000000010']);
		}
	});

	test({
		description: 'should handle an event with no inputs',
		event: { signature: augur.api.events.completeSets_logReturn.signature, inputs: []},
		params: {},
		assertions: function(o) {
			assert.deepEqual(o, [ '0x59193f204bd4754cff0e765b9ee9157305fb373586ec5d680b49e6341ef922a6']);
		}
	});
});

describe("logs.parametrizeFilter", function() {
	// 2 tests total
	var test = function(t) {
		it(t.description, function() {
			t.assertions(augur.parametrizeFilter(t.event, t.params));
		});
	};

	test({
		description: 'should return a prepared filter object',
		event: { signature: augur.api.events.completeSets_logReturn.signature, inputs: [ { name: 'amount', indexed: true }, { name: 'market', indexed: true }, { name: 'numOutcomes', indexed: true } ], contract: 'CompleteSets'},
		params: { amount: '50', market: '0x0a1', numOutcomes: '2' },
		assertions: function(o) {
			assert.deepEqual(o, {
				fromBlock: augur.constants.GET_LOGS_DEFAULT_FROM_BLOCK,
				toBlock: augur.constants.GET_LOGS_DEFAULT_TO_BLOCK,
				address: augur.contracts.CompleteSets,
				topics: [augur.api.events.completeSets_logReturn.signature, '0x0000000000000000000000000000000000000000000000000000000000000050', '0x00000000000000000000000000000000000000000000000000000000000000a1',
				'0x0000000000000000000000000000000000000000000000000000000000000002'],
				timeout: augur.constants.GET_LOGS_TIMEOUT,
			});
		}
	});

	test({
		description: 'should return a prepared filter object when given to/from blocks',
		event: { signature: augur.api.events.completeSets_logReturn.signature, inputs: [ { name: 'amount', indexed: true }, { name: 'market', indexed: true }, { name: 'numOutcomes', indexed: true } ], contract: 'CompleteSets'},
		params: { amount: '50', market: '0x0a1', numOutcomes: '2', toBlock: '0x0b2', fromBlock: '0x0b1' },
		assertions: function(o) {
			assert.deepEqual(o, {
				fromBlock: '0x0b1',
				toBlock: '0x0b2',
				address: augur.contracts.CompleteSets,
				topics: [augur.api.events.completeSets_logReturn.signature, '0x0000000000000000000000000000000000000000000000000000000000000050', '0x00000000000000000000000000000000000000000000000000000000000000a1',
				'0x0000000000000000000000000000000000000000000000000000000000000002'],
				timeout: augur.constants.GET_LOGS_TIMEOUT,
			});
		}
	});
});

describe("logs.insertIndexedLog", function() {
	// ? tests total
	var processedLogs;
	var test = function(t) {
		it(t.description, function() {
			processedLogs = t.processedLogs;
			t.assertions(augur.insertIndexedLog(t.processedLogs, t.parsed, t.index, t.log));
		});
	};

	test({
		description: 'Should insert an indexed log into the processedLogs passed in',
		processedLogs: {'0x00c1': '0x000def456'},
		parsed: {
			'0x00c1': '0x000abc123',
		},
		index: ['0x00c1'],
		log: undefined,
		assertions: function(o) {
			assert.deepEqual(processedLogs, { '0x000abc123': [ { '0x00c1': '0x000abc123' } ], '0x00c1': '0x000def456' });
		}
	});

	test({
		description: 'Should insert an indexed log into the processedLogs passed in as an empty object',
		processedLogs: {},
		parsed: {
			'0x00c1': '0x000abc123',
		},
		index: ['0x00c1'],
		log: undefined,
		assertions: function(o) {
			assert.deepEqual(processedLogs, { '0x000abc123': [ { '0x00c1': '0x000abc123' } ] });
		}
	});

	test({
		description: 'Should insert an indexed log, where indexed is a string, into the processedLogs passed in as an empty object',
		processedLogs: {},
		parsed: {
			'0x00c1': '0x000abc123',
		},
		index: '0x00c1',
		log: undefined,
		assertions: function(o) {
			assert.deepEqual(processedLogs, { '0x000abc123': [ { '0x00c1': '0x000abc123' } ] });
		}
	});
});

describe.skip("logs.processLogs", function() {});
describe.skip("logs.getFilteredLogs", function() {});
describe.skip("logs.getLogs", function() {});
describe.skip("logs.sortTradesByBlockNumber", function() {});
describe.skip("logs.getMakerShortSellLogs", function() {});
describe.skip("logs.getTakerShortSellLogs", function() {});
describe.skip("logs.getMakerTakerShortSellLogs", function() {});
describe.skip("logs.getParsedShortSellLogs", function() {});
describe.skip("logs.getParsedCompleteSetsLogs", function() {});
describe.skip("logs.getShortAskBuyCompleteSetsLogs", function() {});
describe.skip("logs.getRegularCompleteSetsLogs", function() {});
describe.skip("logs.getBuyCompleteSetsLogs", function() {});
describe.skip("logs.getSellCompleteSetsLogs", function() {});
describe.skip("logs.getAccountMeanTradePrices", function() {});
