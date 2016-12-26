"use strict";

var assert = require("chai").assert;
var utils = require("../../../src/utilities.js");
var augur = require('../../../src/');
var transact;
var currentAssertions;

var sharedMockTransact = function(tx, onSent, onSuccess, onFailed) {
	// if onSent is defined then callbacks where passed, check that they are functions.
	if (onSent) {
		assert.isFunction(onSent);
		assert.isFunction(onSuccess);
		assert.isFunction(onFailed);
	}
	// pass transaction object to assertions
	currentAssertions(tx);
};

describe("payout.closeMarket", function() {
	var test = function(t) {
		it(t.testDescription, function() {
			currentAssertions = t.assertions;
			augur.closeMarket(t.branch, t.market, t.sender, t.description, t.onSent, t.onSuccess, t.onFailed);
		});
	};

	before(function() {
		transact = augur.transact;
		augur.transact = sharedMockTransact;
	});

	after(function() {
		augur.transact = transact;
	});

	test({
		testDescription: "Should handle sending a transaction to close a market",
		assertions: function(out) {
			assert.deepEqual(out.to, augur.tx.CloseMarket.closeMarket.to);
			assert.deepEqual(out.label, 'Close Market');
			assert.deepEqual(out.method, 'closeMarket');
			assert.deepEqual(out.description, 'This is my market that has some crazy question, do you think it will happen?');
			assert.deepEqual(out.params, [
				'0a1d18a485f77dcee53ea81f1010276b67153b745219afc4eac4288045f5ca3d', '09f7e3e3fbc7d5b4c7e9e8fb3013efb22a47b326e7461c7655a2e8466ac27f9b', '2c72686849275a98be3d3d06f062d3fbb3821cc30890218721cce9c67c91157e'
			]);
		},
		branch: '0a1d18a485f77dcee53ea81f1010276b67153b745219afc4eac4288045f5ca3d',
		market: '09f7e3e3fbc7d5b4c7e9e8fb3013efb22a47b326e7461c7655a2e8466ac27f9b',
		sender: '2c72686849275a98be3d3d06f062d3fbb3821cc30890218721cce9c67c91157e',
		description: 'This is my market that has some crazy question, do you think it will happen?',
		onSent: utils.noop,
		onSuccess: utils.noop,
		onFailed: utils.noop
	});
	test({
		testDescription: "Should handle sending a transaction to close a market with a single object as the argument",
		assertions: function(out) {
			assert.deepEqual(out.to, augur.tx.CloseMarket.closeMarket.to);
			assert.deepEqual(out.label, 'Close Market');
			assert.deepEqual(out.method, 'closeMarket');
			assert.deepEqual(out.description, 'This is my market that has some crazy question, do you think it will happen?');
			assert.deepEqual(out.params, [
				'0a1d18a485f77dcee53ea81f1010276b67153b745219afc4eac4288045f5ca3d', '09f7e3e3fbc7d5b4c7e9e8fb3013efb22a47b326e7461c7655a2e8466ac27f9b', '2c72686849275a98be3d3d06f062d3fbb3821cc30890218721cce9c67c91157e'
			]);
		},
		branch: {
			branch: '0a1d18a485f77dcee53ea81f1010276b67153b745219afc4eac4288045f5ca3d',
			market: '09f7e3e3fbc7d5b4c7e9e8fb3013efb22a47b326e7461c7655a2e8466ac27f9b',
			sender: '2c72686849275a98be3d3d06f062d3fbb3821cc30890218721cce9c67c91157e',
			description: 'This is my market that has some crazy question, do you think it will happen?',
			onSent: utils.noop,
			onSuccess: utils.noop,
			onFailed: utils.noop
		}
	});
});

describe("payout.claimProceeds", function() {
	var test = function(t) {
		it(t.testDescription, function() {
			currentAssertions = t.assertions;
			augur.claimProceeds(t.branch, t.market, t.description, t.onSent, t.onSuccess, t.onFailed);
		});
	};

	before(function() {
		transact = augur.transact;
		augur.transact = sharedMockTransact;
	});

	after(function() {
		augur.transact = transact;
	});

	
});
