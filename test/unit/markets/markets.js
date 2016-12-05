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
	var test = function (t) {
		it(t.description, function() {
			augur.getWinningOutcomes(t.market, t.callback);
		});
	};

	before(function() {
		augur.fire = function(tx, cb) {
			getMarketNumOutcomesCallCount++;
			console.log('getMarketNumOutcomesCallCount:', getMarketNumOutcomesCallCount);
			// console.log(tx);
			assert.deepEqual(tx.inputs, ['market']);
			assert.equal(tx.method, 'getWinningOutcomes');
			assert.deepEqual(tx.signature, ['int256']);
			assert.equal(tx.returns, 'number[]');

			// tx.to should point to the markets contract.
			assert.deepEqual(tx.to, contracts['2']['Markets']);
			assert.equal(tx.params, 'marketID');
			var out;

			switch(getMarketNumOutcomesCallCount) {
			case 2:
				out = { error: '404', message: 'page not found!' };
				break;
			case 3:
				out = '1';
				break;
			default:
				out = undefined;
				break;
			}
			// if cb was passed and is a function, call it with out as the arg
			if (utils.is_function(cb)) cb(out);
			// return for tests where cb is not defined.
			return out;
		};
	});

	after(function() {
		augur.fire = fire;
		augur.getMarketNumOutcomes = getMarketNumOutcomes;
	});

	test({
		description: 'Should return null to the callback if getWinningOutcomes transaction returns undefined',
		market: 'marketID',
		callback: function(outcomes) { assert.equal(outcomes, null); }
	});
	test({
		description: 'Should return an error object to callback if getWinningOutcomes transaction returns an error object',
		market: 'marketID',
		callback: function(outcomes) {
			assert.deepEqual(outcomes, { error: '404', message: 'page not found!' });
		}
	});
	test({
		description: 'Should return any non array value to callback if getWinningOutcomes transaction does not return an array',
		market: 'marketID',
		callback: function(outcomes) {
			assert.deepEqual(outcomes, '1');
		}
	});
});
