"use strict";

var assert = require('chai').assert;
var augur = require('../../../src');
var utils = require("../../../src/utilities");
var abi = require("augur-abi");
// 77 tests total

/***********
 * Parsers *
 ***********/
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

/***********
 * Getters *
 ***********/
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
	// 5 tests total
	var processedLogs;
	var test = function(t) {
		it(t.description, function() {
			processedLogs = t.processedLogs;
			t.assertions(augur.insertIndexedLog(t.processedLogs, t.parsed, t.index, t.log));
		});
	};

	test({
		description: 'Should insert an indexed log, passed as an array, into the processedLogs passed in',
		processedLogs: {'0x00c1': []},
		parsed: {
			market: '0x00c1',
			value: '0x000abc123',
		},
		index: ['market'],
		assertions: function(o) {
			assert.deepEqual(processedLogs, { '0x00c1': [ { market: '0x00c1', value: '0x000abc123' } ] });
		}
	});

	test({
		description: 'Should insert an indexed log, passed as an array, into the processedLogs passed in as an empty object',
		processedLogs: {},
		parsed: {
			market: '0x000abc123',
		},
		index: ['market'],
		assertions: function(o) {
			assert.deepEqual(processedLogs, { '0x000abc123': [ { 'market': '0x000abc123' } ] });
		}
	});

	test({
		description: 'Should insert an indexed log, where indexed is a string, into the processedLogs passed in as an empty object',
		processedLogs: {},
		parsed: {
			market: '0x000abc123',
		},
		index: 'market',
		assertions: function(o) {
			assert.deepEqual(processedLogs, { '0x000abc123': [ { 'market': '0x000abc123' } ] });
		}
	});

	test({
		description: 'Should insert an indexed log, where indexed is an array of length 2, into the processedLogs passed in as an empty object',
		processedLogs: {},
		parsed: {
			'0x00c1': '0x0000000000000000000000000000000000000000000000000000000000000002',
			'0x00a1': '0x0000000000000000000000000000000000000000000000000000000000000001'
		},
		index: ['0x00c1', '0x00a1'],
		assertions: function(o) {
			assert.deepEqual(processedLogs, {
				'0x0000000000000000000000000000000000000000000000000000000000000002': {
					'0x0000000000000000000000000000000000000000000000000000000000000001': [{
						'0x00a1': '0x0000000000000000000000000000000000000000000000000000000000000001',
						'0x00c1': '0x0000000000000000000000000000000000000000000000000000000000000002'
					}]
				}
			});
		}
	});

	test({
		description: 'Should insert an indexed log, where indexed is an array of length 2, into the processedLogs passed in',
		processedLogs: { '0x00c1': { '0x00a1': [] }},
		parsed: {
			market: '0x00c1',
			value: '0x00a1'
		},
		index: ['market', 'value'],
		assertions: function(o) {
			assert.deepEqual(processedLogs, {
				'0x00c1': {
					'0x00a1': [{
						value: '0x00a1',
						market: '0x00c1'
					}],
				}
			});
		}
	});
});
describe("logs.processLogs", function() {
	// 6 total tests
	var test = function(t) {
		it(t.description, function() {
			t.assertions(augur.processLogs(t.label, t.index, t.logs, t.extraField, t.processedLogs));
		});
	};

	test({
		description: 'should handle no index, processedLogs, or extraField passed in, with only 1 log to parse.',
		label: 'log_add_tx',
		index: undefined,
		logs: [{
			topics: [null, '0x0b1', '0x0a1'],
			data: ['1', '100000000000000000000', '10000000000000000000', '1', '0x0abc1', false, 150000000],
			blockNumber: '010101',
			transactionHash: '0x0c1',
			removed: false
		}],
		extraField: undefined,
		processedLogs: undefined,
		assertions: function(o) {
			assert.deepEqual(o, [{
				market: '0x0b1',
				sender: '0x00000000000000000000000000000000000000a1',
				type: 'buy',
				price: '100',
				amount: '10',
				outcome: 1,
				tradeid: '0x0abc1',
				isShortAsk: true,
				timestamp: 5637144576,
				blockNumber: 65793,
				transactionHash: '0x0c1',
				removed: false
			}]);
		}
	});

	test({
		description: 'should handle no index or processedLogs passed in, with 2 logs to parse with an extraField to add',
		label: 'log_add_tx',
		index: undefined,
		logs: [{
			topics: [null, '0x0b1', '0x0a1'],
			data: ['1', '100000000000000000000', '10000000000000000000', '1', '0x0abc1', false, 150000000],
			blockNumber: '010101',
			transactionHash: '0x0c1',
			removed: false
		},
		{
			topics: [null, '0x0d1', '0x0a1'],
			data: ['2', '125000000000000000000', '15000000000000000000', '1', '0x0abc2', false, 150000000],
			blockNumber: '010101',
			transactionHash: '0x0c1',
			removed: false
		}],
		extraField: { name: 'type', value: 'buy'},
		processedLogs: undefined,
		assertions: function(o) {
			// we should have 2 processedLogs back, the 2nd should have it's type changed to buy because of the extraField modification despite it being passed as a sell.
			assert.deepEqual(o, [{
				market: '0x0b1',
				sender: '0x00000000000000000000000000000000000000a1',
				type: 'buy',
				price: '100',
				amount: '10',
				outcome: 1,
				tradeid: '0x0abc1',
				isShortAsk: true,
				timestamp: 5637144576,
				blockNumber: 65793,
				transactionHash: '0x0c1',
				removed: false
			},
			{
				market: '0x0d1',
				sender: '0x00000000000000000000000000000000000000a1',
				type: 'buy',
				price: '125',
				amount: '15',
				outcome: 1,
				tradeid: '0x0abc2',
				isShortAsk: true,
				timestamp: 5637144576,
				blockNumber: 65793,
				transactionHash: '0x0c1',
				removed: false
			}]);
		}
	});

	test({
		description: 'should handle an index String but no processedLogs passed in, with 2 logs to parse with an extraField to add and one of the logs is to be removed',
		label: 'log_add_tx',
		index: 'market',
		logs: [{
			topics: [null, '0x0b1', '0x0a1'],
			data: ['1', '100000000000000000000', '10000000000000000000', '1', '0x0abc1', false, 150000000],
			blockNumber: '010101',
			transactionHash: '0x0c1',
			removed: false
		},
		{
			topics: [null, '0x0d1', '0x0a1'],
			data: ['2', '125000000000000000000', '15000000000000000000', '1', '0x0abc2', false, 150000000],
			blockNumber: '010101',
			transactionHash: '0x0c1',
			removed: true
		}],
		extraField: { name: 'type', value: 'buy'},
		processedLogs: undefined,
		assertions: function(o) {
			assert.deepEqual(o, {
				'0x0b1': [{
					market: '0x0b1',
					sender: '0x00000000000000000000000000000000000000a1',
					type: 'buy',
					price: '100',
					amount: '10',
					outcome: 1,
					tradeid: '0x0abc1',
					isShortAsk: true,
					timestamp: 5637144576,
					blockNumber: 65793,
					transactionHash: '0x0c1',
					removed: false
				}]
			});
		}
	});

	test({
		description: 'should handle an index Array but no processedLogs passed in, with 1 log passed in, no extraField.',
		label: 'log_add_tx',
		index: ['market'],
		logs: [{
			topics: [null, '0x0b1', '0x0a1'],
			data: ['2', '100000000000000000000', '10000000000000000000', '1', '0x0abc1', false, 150000000],
			blockNumber: '010101',
			transactionHash: '0x0c1',
			removed: false
		}],
		extraField: undefined,
		processedLogs: undefined,
		assertions: function(o) {
			assert.deepEqual(o, {
				'0x0b1': [{
					market: '0x0b1',
					sender: '0x00000000000000000000000000000000000000a1',
					type: 'sell',
					price: '100',
					amount: '10',
					outcome: 1,
					tradeid: '0x0abc1',
					isShortAsk: true,
					timestamp: 5637144576,
					blockNumber: 65793,
					transactionHash: '0x0c1',
					removed: false
				}]
			});
		}
	});

	test({
		description: 'should handle an index Array and processedLogs passed in, with 1 log passed in, no extraField.',
		label: 'log_add_tx',
		index: ['market'],
		logs: [{
			topics: [null, '0x0b1', '0x0a1'],
			data: ['2', '100000000000000000000', '10000000000000000000', '1', '0x0abc1', false, 150000000],
			blockNumber: '010101',
			transactionHash: '0x0c1',
			removed: false
		}],
		extraField: undefined,
		processedLogs: {'0x0b1': [{ name: 'test', value: 'example'}]},
		assertions: function(o) {
			// in this case we simply add an example object in the processedLogs to prove that it adds to an existing array.
			assert.deepEqual(o, {
				'0x0b1': [{ name: 'test', value: 'example'}, {
					market: '0x0b1',
					sender: '0x00000000000000000000000000000000000000a1',
					type: 'sell',
					price: '100',
					amount: '10',
					outcome: 1,
					tradeid: '0x0abc1',
					isShortAsk: true,
					timestamp: 5637144576,
					blockNumber: 65793,
					transactionHash: '0x0c1',
					removed: false
				}]
			});
		}
	});

	test({
		description: 'should handle an index Array of length 2 and processedLogs passed in, with 2 log passed in, no extraField.',
		label: 'log_add_tx',
		index: ['type', 'market'],
		logs: [{
			topics: [null, '0x0b1', '0x0a1'],
			data: ['2', '100000000000000000000', '10000000000000000000', '1', '0x0abc1', false, 150000000],
			blockNumber: '010101',
			transactionHash: '0x0c1',
			removed: false
		},
		{
			topics: [null, '0x0b1', '0x0a1'],
			data: ['1', '10000000000000000000', '1000000000000000000', '1', '0x0abc1', false, 150000000],
			blockNumber: '010101',
			transactionHash: '0x0c2',
			removed: false
		}],
		extraField: undefined,
		processedLogs: {'sell': {'0x0b1': []}, 'buy': {'0x0b1': []},},
		assertions: function(o) {
			assert.deepEqual(o, {
				'buy': {
					'0x0b1': [{
						market: '0x0b1',
						sender: '0x00000000000000000000000000000000000000a1',
						type: 'buy',
						price: '10',
						amount: '1',
						outcome: 1,
						tradeid: '0x0abc1',
						isShortAsk: true,
						timestamp: 5637144576,
						blockNumber: 65793,
						transactionHash: '0x0c2',
						removed: false
					}],
				},
				'sell': {
					'0x0b1': [{
						market: '0x0b1',
						sender: '0x00000000000000000000000000000000000000a1',
						type: 'sell',
						price: '100',
						amount: '10',
						outcome: 1,
						tradeid: '0x0abc1',
						isShortAsk: true,
						timestamp: 5637144576,
						blockNumber: 65793,
						transactionHash: '0x0c1',
						removed: false
					}],
				}
			});
		}
	});
});
describe("logs.getFilteredLogs", function() {
	// 6 total tests
	var test = function(t) {
		it(t.description, function() {
			var getLogs = augur.rpc.getLogs;
			augur.rpc.getLogs = t.getLogs;

			t.assertions(augur.getFilteredLogs(t.label, t.filterParams, t.callback));

			augur.rpc.getLogs = getLogs;
		});
	};

	test({
		description: 'Should handle undefined filterParams and cb',
		label: 'log_add_tx',
		filterParams: undefined,
		callback: undefined,
		getLogs: function(filters) {
			// simply pass back filters to be tested by assertions
			return filters;
		},
 		assertions: function(o) {
			assert.deepEqual(o, {
				fromBlock: '0x1',
				toBlock: 'latest',
				address: augur.api.events['log_add_tx'].address,
				topics: [augur.api.events['log_add_tx'].signature,
					null,
					null
				],
				timeout: 480000
			});
		}
	});

	test({
		description: 'Should handle passed filterParams and undefined cb',
		label: 'log_add_tx',
		filterParams: {
			toBlock: '0x0b2',
			fromBlock: '0x0b1'
		},
		callback: undefined,
		getLogs: function(filters) {
			// simply pass back filters to be tested by assertions
			return filters;
		},
 		assertions: function(o) {
			assert.deepEqual(o, {
				fromBlock: '0x0b1',
				toBlock: '0x0b2',
				address: augur.api.events['log_add_tx'].address,
				topics: [augur.api.events['log_add_tx'].signature,
					null,
					null
				],
				timeout: 480000
			});
		}
	});

	test({
		description: 'Should handle passed filterParams and cb',
		label: 'log_add_tx',
		filterParams: {
			toBlock: '0x0b2',
			fromBlock: '0x0b1'
		},
		callback: function(err, logs) {
			assert.isNull(err);
			assert.deepEqual(logs[0], {
				fromBlock: '0x0b1',
				toBlock: '0x0b2',
				address: augur.api.events['log_add_tx'].address,
				topics: [augur.api.events['log_add_tx'].signature,
					null,
					null
				],
				timeout: 480000
			});
		},
		getLogs: function(filters, cb) {
			// simply pass back filters to be tested by cb assertions
			cb([filters]);
		},
 		assertions: function(o) {}
	});

	test({
		description: 'Should handle passed filterParams and cb when getLogs returns an error object',
		label: 'log_add_tx',
		filterParams: {
			toBlock: '0x0b2',
			fromBlock: '0x0b1'
		},
		callback: function(err, logs) {
			assert.isNull(logs);
			assert.deepEqual(err, {
				error: 'this is a problem!'
			});
		},
		getLogs: function(filters, cb) {
			// simply pass back filters to be tested by cb assertions
			cb({ error: 'this is a problem!' });
		},
 		assertions: function(o) {}
	});

	test({
		description: 'Should handle passed filterParams and cb when getLogs returns an empty array',
		label: 'log_add_tx',
		filterParams: {
			toBlock: '0x0b2',
			fromBlock: '0x0b1'
		},
		callback: function(err, logs) {
			assert.isNull(err);
			assert.deepEqual(logs, []);
		},
		getLogs: function(filters, cb) {
			// simply pass back an empty array to be tested by cb assertions
			cb([]);
		},
 		assertions: function(o) {}
	});

	test({
		description: 'Should handle passed filterParams as a callback',
		label: 'log_add_tx',
		filterParams: function(err, logs) {
			assert.isNull(err);
			assert.deepEqual(logs, []);
		},
		callback: undefined,
		getLogs: function(filters, cb) {
			// simply pass back undefined to be tested by cb assertions
			cb(undefined);
		},
 		assertions: function(o) {}
	});
});
describe("logs.getLogs", function() {
	// 5 total tests
	var test = function(t) {
		it(t.description, function() {
			var processLogs = augur.processLogs;
			var getFilteredLogs = augur.getFilteredLogs;
			augur.processLogs = t.processLogs;
			augur.getFilteredLogs = t.getFilteredLogs;
			t.assertions(augur.getLogs(t.label, t.filterParams, t.aux, t.callback));
			augur.processLogs = processLogs;
			augur.getFilteredLogs = getFilteredLogs;
		});
	};

	test({
		description: 'should handle only a label with no params, aux, or callback',
		label: 'log_add_tx',
		filterParams: undefined,
		aux: undefined,
		callback: undefined,
		processLogs: function(label, index, filteredLogs, extraField, mergedLogs) {
			// pass the args as an object so that they can be tested by assertions
			return {label: label, index: index, filteredLogs: filteredLogs, extraField: extraField, mergedLogs: mergedLogs };
		},
		getFilteredLogs: function(label, filterParams) {
			// pass back the filterParams only to test what was sent to getFilteredLogs
			return filterParams;
		},
		assertions: function(o) {
			assert.deepEqual(o, {
				label: 'log_add_tx',
				index: undefined,
				filteredLogs: {},
				extraField: undefined,
				mergedLogs: undefined
			});
		}
	});

	test({
		description: 'should handle a label with params. no aux or callback',
		label: 'log_add_tx',
		filterParams: {
			toBlock: '0x0b2',
			fromBlock: '0x0b1'
		},
		aux: undefined,
		callback: undefined,
		processLogs: function(label, index, filteredLogs, extraField, mergedLogs) {
			// pass the args as an object so that they can be tested by assertions
			return {label: label, index: index, filteredLogs: filteredLogs, extraField: extraField, mergedLogs: mergedLogs };
		},
		getFilteredLogs: function(label, filterParams) {
			// pass back the filterParams only to test what was sent to getFilteredLogs
			return filterParams;
		},
		assertions: function(o) {
			assert.deepEqual(o, {
				label: 'log_add_tx',
				index: undefined,
				filteredLogs: {
					toBlock: '0x0b2',
					fromBlock: '0x0b1'
				},
				extraField: undefined,
				mergedLogs: undefined
			});
		}
	});

	test({
		description: 'should handle a label with params and aux, no callback',
		label: 'log_add_tx',
		filterParams: {
			toBlock: '0x0b2',
			fromBlock: '0x0b1'
		},
		aux: {index: '0x000abc123', mergedLogs: {}, extraField: {name: 'test', value: 'example'}},
		callback: undefined,
		processLogs: function(label, index, filteredLogs, extraField, mergedLogs) {
			// pass the args as an object so that they can be tested by assertions
			return {label: label, index: index, filteredLogs: filteredLogs, extraField: extraField, mergedLogs: mergedLogs };
		},
		getFilteredLogs: function(label, filterParams) {
			// pass back the filterParams only to test what was sent to getFilteredLogs
			return filterParams;
		},
		assertions: function(o) {
			assert.deepEqual(o, {
				label: 'log_add_tx',
				index: '0x000abc123',
				filteredLogs: {
					toBlock: '0x0b2',
					fromBlock: '0x0b1'
				},
				extraField: { name: 'test', value: 'example'},
				mergedLogs: {}
			});
		}
	});

	test({
		description: 'should handle a label with params, aux, and callback where getFilteredLogs does not error',
		label: 'log_add_tx',
		filterParams: {
			toBlock: '0x0b2',
			fromBlock: '0x0b1'
		},
		aux: {index: '0x000abc123', mergedLogs: {}, extraField: {name: 'test', value: 'example'}},
		callback: function(err, logs) {
			assert.isNull(err);
			assert.deepEqual(logs, {
				label: 'log_add_tx',
				index: '0x000abc123',
				filteredLogs: {
					toBlock: '0x0b2',
					fromBlock: '0x0b1'
				},
				extraField: { name: 'test', value: 'example'},
				mergedLogs: {}
			});
		},
		processLogs: function(label, index, filteredLogs, extraField, mergedLogs) {
			// pass the args as an object so that they can be tested by assertions
			return {label: label, index: index, filteredLogs: filteredLogs, extraField: extraField, mergedLogs: mergedLogs };
		},
		getFilteredLogs: function(label, filterParams, cb) {
			// simply pass back the filterParams to be asserted later
			cb(null, filterParams);
		},
		assertions: function(o) {
			// not used, see callback
		}
	});

	test({
		description: 'should handle a label with params, aux as the callback and undefined callback passed where getFilteredLogs does error',
		label: 'log_add_tx',
		filterParams: {
			toBlock: '0x0b2',
			fromBlock: '0x0b1'
		},
		aux: function(err, logs) {
			assert.deepEqual(err, { error: 'uh-oh!' });
		},
		callback: undefined,
		processLogs: function(label, index, filteredLogs, extraField, mergedLogs) {
			// pass the args as an object so that they can be tested by assertions
			return {label: label, index: index, filteredLogs: filteredLogs, extraField: extraField, mergedLogs: mergedLogs };
		},
		getFilteredLogs: function(label, filterParams, cb) {
			// simply pass back the filterParams to be asserted later
			cb({ error: 'uh-oh!' });
		},
		assertions: function(o) {
			// not used, see callback
		}
	});
});
describe.skip("logs.getAccountTrades", function() {});
describe("logs.sortTradesByBlockNumber", function() {
	// 2 total tests
	var test = function(t) {
		it(t.description, function() {
			t.assertions(augur.sortTradesByBlockNumber(t.trades));
		});
	};

	test({
		description: 'Should handle a trades object with multiple markets trades',
		trades: {
			'0x0a1': {
				'1': [{blockNumber: '0x01'}, { blockNumber: '0x05' }, {blockNumber: '0x03'}],
				'2': [{ blockNumber: '0x04'}, { blockNumber: '0x08'}, { blockNumber: '0x02'}]
			},
			'0x0b1': {
				'1': [{blockNumber: '0x0f'}, {blockNumber: '0x0a'}, {blockNumber: '0x09'}, {blockNumber: '0x0c'}],
				'2': [{blockNumber: '0x0a'}, {blockNumber: '0x01'}, {blockNumber: '0x0d'}],
				'3': [{blockNumber: '0x05'}, {blockNumber: '0x011'}],
				'4': [{blockNumber: '0x012'}, {blockNumber: '0x0d'}, {blockNumber: '0x0d1'}, {blockNumber: '0x09c'}]
			}
		},
		assertions: function(o) {
			assert.deepEqual(o, {
				'0x0a1': {
					'1':
				   [ { blockNumber: '0x01' },
				     { blockNumber: '0x03' },
				     { blockNumber: '0x05' } ],
				  '2':
				   [ { blockNumber: '0x02' },
				     { blockNumber: '0x04' },
				     { blockNumber: '0x08' } ]
				},
				'0x0b1': {
					'1':
				   [ { blockNumber: '0x09' },
				     { blockNumber: '0x0a' },
				     { blockNumber: '0x0c' },
				     { blockNumber: '0x0f' } ],
				  '2':
				   [ { blockNumber: '0x01' },
				     { blockNumber: '0x0a' },
				     { blockNumber: '0x0d' } ],
				  '3': [ { blockNumber: '0x05' }, { blockNumber: '0x011' } ],
				  '4':
				  	[ { blockNumber: '0x0d' },
				     { blockNumber: '0x012' },
				     { blockNumber: '0x09c' },
				     { blockNumber: '0x0d1' } ]
				}
			})
		}
	});

	test({
		description: 'Should handle an empty trades object',
		trades: {},
		assertions: function(o) {
			assert.deepEqual(o, {});
		}
	});
});

/************************
 * Convenience wrappers *
 ************************/
describe("logs.getMakerShortSellLogs", function() {
	// 3 tests total
	var test = function(t) {
		it(t.description, function() {
			var getShortSellLogs = augur.getShortSellLogs;
			augur.getShortSellLogs = t.getShortSellLogs;
			t.assertions(augur.getMakerShortSellLogs(t.account, t.options, t.callback));
			augur.getShortSellLogs = getShortSellLogs;
		});
	};

	test({
		description: 'Should handle something just an account, no options passed with a cb',
		account: '0x0',
		options: undefined,
		callback: utils.noop,
		getShortSellLogs: function(account, options, callback) {
			return { account: account, options: options, callback: callback };
		},
		assertions: function(o) {
			assert.deepEqual(o, { account: '0x0', options: {maker: true}, callback: utils.noop });
		}
	});

	test({
		description: 'Should handle something an account and some options passed with a cb',
		account: '0x0',
		options: { amount: '10' },
		callback: utils.noop,
		getShortSellLogs: function(account, options, callback) {
			return { account: account, options: options, callback: callback };
		},
		assertions: function(o) {
			assert.deepEqual(o, { account: '0x0', options: {maker: true, amount: '10'}, callback: utils.noop });
		}
	});

	test({
		description: 'Should handle something an account and cb is passed as the options',
		account: '0x0',
		options: utils.noop,
		callback: undefined,
		getShortSellLogs: function(account, options, callback) {
			return { account: account, options: options, callback: callback };
		},
		assertions: function(o) {
			assert.deepEqual(o, { account: '0x0', options: {maker: true}, callback: utils.noop });
		}
	});
});
describe("logs.getTakerShortSellLogs", function() {
	// 3 tests total
	var test = function(t) {
		it(t.description, function() {
			var getShortSellLogs = augur.getShortSellLogs;
			augur.getShortSellLogs = t.getShortSellLogs;
			t.assertions(augur.getTakerShortSellLogs(t.account, t.options, t.callback));
			augur.getShortSellLogs = getShortSellLogs;
		});
	};

	test({
		description: 'Should handle something just an account, no options passed with a cb',
		account: '0x0',
		options: undefined,
		callback: utils.noop,
		getShortSellLogs: function(account, options, callback) {
			return { account: account, options: options, callback: callback };
		},
		assertions: function(o) {
			assert.deepEqual(o, { account: '0x0', options: {maker: false}, callback: utils.noop });
		}
	});

	test({
		description: 'Should handle something an account and some options passed with a cb',
		account: '0x0',
		options: { amount: '10' },
		callback: utils.noop,
		getShortSellLogs: function(account, options, callback) {
			return { account: account, options: options, callback: callback };
		},
		assertions: function(o) {
			assert.deepEqual(o, { account: '0x0', options: {maker: false, amount: '10'}, callback: utils.noop });
		}
	});

	test({
		description: 'Should handle something an account and cb is passed as the options',
		account: '0x0',
		options: utils.noop,
		callback: undefined,
		getShortSellLogs: function(account, options, callback) {
			return { account: account, options: options, callback: callback };
		},
		assertions: function(o) {
			assert.deepEqual(o, { account: '0x0', options: {maker: false}, callback: utils.noop });
		}
	});
});
describe("logs.getMakerTakerShortSellLogs", function() {
	// 5 tests total
	var getShortSellLogsCC = 0;
	var test = function(t) {
		it(t.description, function() {
			var getShortSellLogs = augur.getShortSellLogs;
			augur.getShortSellLogs = t.getShortSellLogs;
			getShortSellLogsCC = 0;

			augur.getMakerTakerShortSellLogs(t.account, t.options, t.callback);

			augur.getShortSellLogs = getShortSellLogs;
		});
	};

	test({
		description: 'Should handle options as undefined',
		account: '0x0',
		options: undefined,
		callback: function(err, logs) {
			assert.isNull(err);
			assert.equal(logs[0].account, '0x0');
			assert.deepEqual(logs[0].options, { maker: true });
			assert.isFunction(logs[0].callback);
			assert.equal(logs[1].account, '0x0');
			assert.deepEqual(logs[1].options, { maker: false });
			assert.isFunction(logs[1].callback);
		},
		getShortSellLogs: function(account, options, callback) {
			return callback(null, [{ account: account, options: options, callback: callback }]);
		}
	});

	test({
		description: 'Should handle options as the callback',
		account: '0x0',
		options: function(err, logs) {
			assert.isNull(err);
			assert.equal(logs[0].account, '0x0');
			assert.deepEqual(logs[0].options, { maker: true });
			assert.isFunction(logs[0].callback);
			assert.equal(logs[1].account, '0x0');
			assert.deepEqual(logs[1].options, { maker: false });
			assert.isFunction(logs[1].callback);
		},
		callback: undefined,
		getShortSellLogs: function(account, options, callback) {
			return callback(null, [{ account: account, options: options, callback: callback }]);
		}
	});

	test({
		description: 'Should handle options passed in',
		account: '0x0',
		options: { price: '0.5' },
		callback: function(err, logs) {
			assert.isNull(err);
			// maker logs
			assert.equal(logs[0].account, '0x0');
			assert.deepEqual(logs[0].options, { maker: true, price: '0.5' });
			assert.isFunction(logs[0].callback);
			// taker logs
			assert.equal(logs[1].account, '0x0');
			assert.deepEqual(logs[1].options, { maker: false, price: '0.5' });
			assert.isFunction(logs[1].callback);
		},
		getShortSellLogs: function(account, options, callback) {
			return callback(null, [{ account: account, options: options, callback: callback }]);
		}
	});

	test({
		description: 'Should handle Errors from getMakerShortSellLogs',
		account: '0x0',
		options: { price: '0.5' },
		callback: function(err, logs) {
			assert.isUndefined(logs);
			assert.deepEqual(err, { error: 'Uh-Oh!' });
		},
		getShortSellLogs: function(account, options, callback) {
			return callback({error: 'Uh-Oh!'});
		}
	});

	test({
		description: 'Should handle Errors from getTakerShortSellLogs',
		account: '0x0',
		options: { price: '0.5' },
		callback: function(err, logs) {
			assert.isUndefined(logs);
			assert.deepEqual(err, { error: 'Uh-Oh!' });
		},
		getShortSellLogs: function(account, options, callback) {
			switch(getShortSellLogsCC) {
			case 1:
				// this is the 2nd call, getTakerShortSellLogs
				return callback({error: 'Uh-Oh!'});
				break;
			default:
				// this is the first call, getMakerShortSellLogs
				getShortSellLogsCC++;
				return callback(null, [{ account: account, options: options, callback: callback }]);
				break;
			}
		}
	});
});
describe("logs.getParsedShortSellLogs", function() {
	// 4 tests total
	var getShortSellLogs, parseShortSellLogs;
	var test = function(t) {
		it(t.description, function() {
			getShortSellLogs = augur.getShortSellLogs;
			parseShortSellLogs = augur.parseShortSellLogs;
			augur.getShortSellLogs = t.getShortSellLogs;
			augur.parseShortSellLogs = t.parseShortSellLogs;

			augur.getParsedShortSellLogs(t.account, t.options, t.callback);

			augur.getShortSellLogs = getShortSellLogs;
			augur.parseShortSellLogs = parseShortSellLogs;
		});
	};

	test({
		description: 'Should handle no options passed and no errors from getShortSellLogs',
		account: '0x0',
		options: undefined,
		callback: function(err, logs) {
			assert.isNull(err);
			assert.deepEqual(logs, {
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
		},
		getShortSellLogs: function(account, options, cb) {
			assert.deepEqual(options, {});
			assert.deepEqual(account, '0x0');
			assert.isFunction(cb);
			cb(null, [{
				data: [ abi.bignum('100'), abi.bignum('10'), '0x00a1', '1' ],
				topics: ['0x00d1', '0x00c1'],
				blockNumber: '010101'
			}]);
		},
		parseShortSellLogs: function(logs, isMaker) {
			return {
				[logs[0].topics[1]]: {
					[logs[0].data[3]]: [{
						type: 'sell',
						price: logs[0].data[0].toFixed(),
						amount: logs[0].data[1].toFixed(),
						tradeid: logs[0].data[2],
						blockNumber: parseInt(logs[0].blockNumber, 16),
						maker: !!isMaker
					}]
				}
			};
		}
	});

	test({
		description: 'Should handle no options passed and an error from getShortSellLogs',
		account: '0x0',
		options: undefined,
		callback: function(err, logs) {
			assert.deepEqual(err, { error: 'uh-oh!' });
			assert.isUndefined(logs);
		},
		getShortSellLogs: function(account, options, cb) {
			assert.deepEqual(options, {});
			assert.deepEqual(account, '0x0');
			assert.isFunction(cb);
			cb({ error: 'uh-oh!' });
		},
		parseShortSellLogs: function(logs, isMaker) {
			// in this case, this function should never be reached.
		}
	});

	test({
		description: 'Should handle options passed and no errors from getShortSellLogs',
		account: '0x0',
		options: { maker: true },
		callback: function(err, logs) {
			assert.isNull(err);
			assert.deepEqual(logs, {
				'0x00c1': {
					'1': [{
						type: 'sell',
						price: '100',
						amount: '10',
						tradeid: '0x00a1',
						blockNumber: 65793,
						maker: true
					}]
				}
			});
		},
		getShortSellLogs: function(account, options, cb) {
			assert.deepEqual(options, { maker: true });
			assert.deepEqual(account, '0x0');
			assert.isFunction(cb);
			cb(null, [{
				data: [ abi.bignum('100'), abi.bignum('10'), '0x00a1', '1' ],
				topics: ['0x00d1', '0x00c1'],
				blockNumber: '010101'
			}]);
		},
		parseShortSellLogs: function(logs, isMaker) {
			return {
				[logs[0].topics[1]]: {
					[logs[0].data[3]]: [{
						type: 'sell',
						price: logs[0].data[0].toFixed(),
						amount: logs[0].data[1].toFixed(),
						tradeid: logs[0].data[2],
						blockNumber: parseInt(logs[0].blockNumber, 16),
						maker: !!isMaker
					}]
				}
			};
		}
	});

	test({
		description: 'Should handle options passed as the callback and no errors from getShortSellLogs',
		account: '0x0',
		options: function(err, logs) {
			assert.isNull(err);
			assert.deepEqual(logs, {
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
		},
		callback: undefined,
		getShortSellLogs: function(account, options, cb) {
			assert.deepEqual(options, {});
			assert.deepEqual(account, '0x0');
			assert.isFunction(cb);
			cb(null, [{
				data: [ abi.bignum('100'), abi.bignum('10'), '0x00a1', '1' ],
				topics: ['0x00d1', '0x00c1'],
				blockNumber: '010101'
			}]);
		},
		parseShortSellLogs: function(logs, isMaker) {
			return {
				[logs[0].topics[1]]: {
					[logs[0].data[3]]: [{
						type: 'sell',
						price: logs[0].data[0].toFixed(),
						amount: logs[0].data[1].toFixed(),
						tradeid: logs[0].data[2],
						blockNumber: parseInt(logs[0].blockNumber, 16),
						maker: !!isMaker
					}]
				}
			};
		}
	});
});
describe("logs.getParsedCompleteSetsLogs", function() {
	// 4 tests total
	var getCompleteSetsLogs, parseCompleteSetsLogs;
	var test = function(t) {
		it(t.description, function() {
			getCompleteSetsLogs = augur.getCompleteSetsLogs;
 			parseCompleteSetsLogs = augur.parseCompleteSetsLogs;
			augur.getCompleteSetsLogs = t.getCompleteSetsLogs;
			augur.parseCompleteSetsLogs = t.parseCompleteSetsLogs;

			augur.getParsedCompleteSetsLogs(t.account, t.options, t.callback);

			augur.getCompleteSetsLogs = getCompleteSetsLogs;
			augur.parseCompleteSetsLogs = parseCompleteSetsLogs;
		});
	};

	test({
		description: 'Should handle no options passed and no error from getCompleteSetsLogs',
		account: '0x0',
		options: undefined,
		callback: function(err, logs) {
			assert.isNull(err);
			assert.deepEqual(logs, [{ '0x00c1': [ { amount: '100', blockNumber: 65793, numOutcomes: '2', type: 'buy' } ] }]);
		},
		getCompleteSetsLogs: function(account, options, callback) {
			assert.deepEqual(account, '0x0');
			assert.deepEqual(options, {});
			assert.isFunction(callback);
			callback(null, [{
				data: [ abi.bignum('100'), '2' ],
				topics: ['0x00a1', '0x00b1', '0x00c1', '1'],
				blockNumber: '010101'
			}]);
		},
		parseCompleteSetsLogs: function(logs, mergeInto) {
			assert.isUndefined(mergeInto);
			return [{
				[logs[0].topics[2]]: [{
					amount: logs[0].data[0].toFixed(),
					blockNumber: parseInt(logs[0].blockNumber, 16),
					numOutcomes: logs[0].data[1],
					type: 'buy'
				}]
			}];
		}
	});

	test({
		description: 'Should handle no options passed and an error from getCompleteSetsLogs',
		account: '0x0',
		options: undefined,
		callback: function(err, logs) {
			assert.deepEqual(err, { error: 'Uh-Oh!' });
			assert.isUndefined(logs);
		},
		getCompleteSetsLogs: function(account, options, callback) {
			assert.deepEqual(account, '0x0');
			assert.deepEqual(options, {});
			assert.isFunction(callback);
			callback({ error: 'Uh-Oh!' });
		},
		parseCompleteSetsLogs: function(logs, mergeInto) {
			// Shouldn't be hit.
		}
	});

	test({
		description: 'Should handle options passed and no error from getCompleteSetsLogs',
		account: '0x0',
		options: { mergeInto: {} },
		callback: function(err, logs) {
			assert.isNull(err);
			assert.deepEqual(logs, [{ '0x00c1': [ { amount: '100', blockNumber: 65793, numOutcomes: '2', type: 'buy' } ] }]);
		},
		getCompleteSetsLogs: function(account, options, callback) {
			assert.deepEqual(account, '0x0');
			assert.deepEqual(options, { mergeInto: {} });
			assert.isFunction(callback);
			callback(null, [{
				data: [ abi.bignum('100'), '2' ],
				topics: ['0x00a1', '0x00b1', '0x00c1', '1'],
				blockNumber: '010101'
			}]);
		},
		parseCompleteSetsLogs: function(logs, mergeInto) {
			assert.deepEqual(mergeInto, {});
			return [{
				[logs[0].topics[2]]: [{
					amount: logs[0].data[0].toFixed(),
					blockNumber: parseInt(logs[0].blockNumber, 16),
					numOutcomes: logs[0].data[1],
					type: 'buy'
				}]
			}];
		}
	});

	test({
		description: 'Should handle options passed as the callback and no error from getCompleteSetsLogs',
		account: '0x0',
		options: function(err, logs) {
			assert.isNull(err);
			assert.deepEqual(logs, [{ '0x00c1': [ { amount: '100', blockNumber: 65793, numOutcomes: '2', type: 'buy' } ] }]);
		},
		callback: undefined,
		getCompleteSetsLogs: function(account, options, callback) {
			assert.deepEqual(account, '0x0');
			assert.deepEqual(options, {});
			assert.isFunction(callback);
			callback(null, [{
				data: [ abi.bignum('100'), '2' ],
				topics: ['0x00a1', '0x00b1', '0x00c1', '1'],
				blockNumber: '010101'
			}]);
		},
		parseCompleteSetsLogs: function(logs, mergeInto) {
			assert.isUndefined(mergeInto);
			return [{
				[logs[0].topics[2]]: [{
					amount: logs[0].data[0].toFixed(),
					blockNumber: parseInt(logs[0].blockNumber, 16),
					numOutcomes: logs[0].data[1],
					type: 'buy'
				}]
			}];
		}
	});
});
describe.skip("logs.getShortAskBuyCompleteSetsLogs", function() {});
describe.skip("logs.getRegularCompleteSetsLogs", function() {});
describe.skip("logs.getBuyCompleteSetsLogs", function() {});
describe.skip("logs.getSellCompleteSetsLogs", function() {});
describe.skip("logs.getAccountMeanTradePrices", function() {});
