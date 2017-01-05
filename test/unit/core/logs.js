"use strict";

var assert = require('chai').assert;
var augur = require('../../../src');
var utils = require("../../../src/utilities");
var abi = require("augur-abi");
// 17 tests total

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
	// 5 tests total
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
				fromBlock: '0x1',
				toBlock: 'latest',
				address: augur.contracts.Trade,
				topics: [augur.api.events.log_short_fill_tx.signature, null, '0x00000000000000000000000002a32d32ca2b37495839dd932c9e92fea10cba12', null],
				timeout: 480000
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
				timeout: 480000
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
				timeout: 480000
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
});

describe.skip("logs.getCompleteSetsLogs", function() {});
describe.skip("logs.sortByBlockNumber", function() {});
describe.skip("logs.buildTopicsList", function() {});
describe.skip("logs.parametrizeFilter", function() {});
describe.skip("logs.insertIndexedLog", function() {});
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
