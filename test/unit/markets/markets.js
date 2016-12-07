"use strict";

var assert = require("chai").assert;
var augur = require("../../../src");
var abi = require("augur-abi");
var contracts = require('augur-contracts');
var utils = require("../../../src/utilities");

describe("Markets Unit Tests", function() {
	var fire = augur.fire;
	var getMarketNumOutcomes = augur.getMarketNumOutcomes;
	var getMarketNumOutcomesCallCount = 0;
	var fireCallCount = 0;
	var test = function (t) {
		it(t.description, function() {
			var output = augur.getWinningOutcomes(t.market, t.callback);
			t.assertions(output);
		});
	};

	before(function() {
		augur.fire = function(tx, cb) {
			var out;
			fireCallCount++;
			// console.log('fireCallCount:', fireCallCount);
			// console.log(tx);
			assert.deepEqual(tx.inputs, ['market']);
			assert.equal(tx.method, 'getWinningOutcomes');
			assert.deepEqual(tx.signature, ['int256']);
			assert.equal(tx.returns, 'number[]');
			// tx.to should point to the markets contract.
			assert.deepEqual(tx.to, contracts['2']['Markets']);
			assert.equal(tx.params, 'marketID');

			switch(fireCallCount) {
			case 1:
			case 8:
				out = undefined;
				break;
			case 2:
			case 9:
				out = { error: '404', message: 'page not found!' };
				break;
			case 10:
			case 3:
				out = '1';
				break;
			case 7:
				out = ['1', '2', '3', '4', '5', '6'];
				break;
			default:
				out = ['1','2','3'];
				break;
			}
			// if cb was passed and is a function, call it with out as the arg
			if (utils.is_function(cb)) cb(out);
			// return for tests where cb is not defined.
			return out;
		};
		augur.getMarketNumOutcomes = function(market, cb) {
			var output;
			getMarketNumOutcomesCallCount++
			// console.log('getMarketNumOutcomesCallCount:', getMarketNumOutcomesCallCount);

			switch(getMarketNumOutcomesCallCount) {
			case 2:
			case 5:
				output = { error: '1', message: 'hello world' };
				break;
			case 3:
				output = undefined;
				break;
			default:
				output = '5';
				break;
			};
			// if cb was passed and is a function, call it with output as the arg
			if (utils.is_function(cb)) cb(output);
			// return for tests where cb is not defined.
			return output;
		};
	});

	after(function() {
		augur.fire = fire;
		augur.getMarketNumOutcomes = getMarketNumOutcomes;
	});

	test({
		assertions: utils.noop,
		description: 'Should return null to the callback if getWinningOutcomes transaction returns undefined',
		market: 'marketID',
		callback: function(outcomes) { assert.equal(outcomes, null); }
	});
	test({
		assertions: utils.noop,
		description: 'Should return an error object to callback if getWinningOutcomes transaction returns an error object',
		market: 'marketID',
		callback: function(outcomes) {
			assert.deepEqual(outcomes, { error: '404', message: 'page not found!' });
		}
	});
	test({
		assertions: utils.noop,
		description: 'Should return any non array value to callback if getWinningOutcomes transaction does not return an array',
		market: 'marketID',
		callback: function(outcomes) {
			assert.deepEqual(outcomes, '1');
		}
	});
	test({
		assertions: utils.noop,
		description: 'Should return the winning outcomes',
		market: 'marketID',
		callback: function(outcomes) {
			assert.deepEqual(outcomes, ['1', '2', '3']);
		}
	});
	test({
		assertions: utils.noop,
		description: 'Should return an error object if getMarketNumOutcomes returns an error',
		market: 'marketID',
		callback: function(outcomes) {
			assert.deepEqual(outcomes, { error: '1', message: 'hello world' });
		}
	});
	test({
		assertions: utils.noop,
		description: 'Should return the winning outcomes if getMarketNumOutcomes returns undefined',
		market: 'marketID',
		callback: function(outcomes) {
			assert.deepEqual(outcomes, ['1', '2', '3']);
		}
	});
	test({
		description: 'Should handle no callback passed with everything else returning valid values',
		market: 'marketID',
		assertions: function(out) {
			assert.deepEqual(out, ['1', '2', '3', '4', '5']);
		}
	});
	test({
		description: 'Should handle no callback passed with tx.fire returning undefined',
		market: 'marketID',
		assertions: function(out) {
			assert.deepEqual(out, null);
		}
	});
	test({
		description: 'Should handle no callback passed with tx.fire returning an error object',
		market: 'marketID',
		assertions: function(out) {
			assert.deepEqual(out, { error: '404', message: 'page not found!' });
		}
	});
	test({
		description: 'Should handle no callback passed with tx.fire returning a non array object that does not contain an error',
		market: 'marketID',
		assertions: function(out) {
			assert.deepEqual(out, '1');
		}
	});
	test({
		description: 'Should handle no callback passed with getMarketNumOutcomes returning an error object',
		market: 'marketID',
		assertions: function(out) {
			assert.deepEqual(out, { error: '1', message: 'hello world' });
		}
	});
	test({
		description: 'Should handle no callback passed with getMarketNumOutcomes returning a number',
		market: 'marketID',
		assertions: function(out) {
			assert.deepEqual(out, ['1', '2', '3']);
		}
	});
});
